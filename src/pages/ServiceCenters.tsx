import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Wrench, Droplet, Fuel, Route, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  category: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  steps: Array<{
    instruction: string;
    distance: number;
  }>;
}

type PlaceCategory = 'service' | 'carwash' | 'gas';

const categoryConfig = {
  service: {
    label: 'Service Centers',
    icon: Wrench,
    color: '#ef4444',
    searchTerms: ['auto repair', 'car service', 'mechanic']
  },
  carwash: {
    label: 'Car Wash',
    icon: Droplet,
    color: '#3b82f6',
    searchTerms: ['car wash']
  },
  gas: {
    label: 'Gas Stations',
    icon: Fuel,
    color: '#22c55e',
    searchTerms: ['gas station', 'petrol station', 'fuel']
  }
};

const ServiceCenters = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>('service');
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<ServiceCenter | null>(null);
  const { position, isLoading, getCurrentPosition, calculateDistance } = useGeolocation();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);

  const fetchMapboxToken = async () => {
    try {
      setIsLoadingToken(true);
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) throw error;
      
      if (data?.token) {
        setMapboxToken(data.token);
        return data.token;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Error fetching Mapbox token:', error);
      toast({
        title: "Error",
        description: "Failed to load map configuration",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingToken(false);
    }
  };

  const searchNearbyPlaces = async (category: PlaceCategory) => {
    if (!position || !mapboxToken) return;

    setIsSearching(true);
    const config = categoryConfig[category];
    const results: ServiceCenter[] = [];

    try {
      // Search for each term in the category
      for (const term of config.searchTerms) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
          `proximity=${position.coords.longitude},${position.coords.latitude}&` +
          `limit=5&` +
          `access_token=${mapboxToken}`
        );

        if (!response.ok) continue;

        const data = await response.json();
        
        data.features?.forEach((feature: any) => {
          const [lng, lat] = feature.center;
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            lat,
            lng
          );

          // Only include places within 50km
          if (distance <= 50) {
            results.push({
              id: feature.id,
              name: feature.text,
              address: feature.place_name,
              latitude: lat,
              longitude: lng,
              distance,
              category
            });
          }
        });
      }

      // Remove duplicates and sort by distance
      const uniqueResults = Array.from(
        new Map(results.map(item => [item.id, item])).values()
      ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setServiceCenters(uniqueResults.slice(0, 10));
      updateMapMarkers(uniqueResults.slice(0, 10), category);

      toast({
        title: "Found Places",
        description: `Found ${uniqueResults.length} nearby locations`,
      });
    } catch (error) {
      console.error('Error searching places:', error);
      toast({
        title: "Search Error",
        description: "Failed to search nearby places",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const updateMapMarkers = (centers: ServiceCenter[], category: PlaceCategory) => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const config = categoryConfig[category];

    // Add new markers
    centers.forEach((center) => {
      const marker = new mapboxgl.Marker({ color: config.color })
        .setLngLat([center.longitude, center.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3 class="font-semibold">${center.name}</h3>
             <p class="text-sm">${center.address}</p>
             ${center.distance ? `<p class="text-sm mt-1"><strong>${center.distance.toFixed(2)} km away</strong></p>` : ''}`
          )
        )
        .addTo(map.current!);
      
      markers.current.push(marker);
    });
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || !position) return;

    mapboxgl.accessToken = mapboxToken;

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLng, userLat],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#8b5cf6' })
      .setLngLat([userLng, userLat])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    setIsMapInitialized(true);
  };

  useEffect(() => {
    if (position && mapboxToken && !isMapInitialized) {
      initializeMap();
    }
  }, [position, mapboxToken, isMapInitialized]);

  const handleGetLocation = async () => {
    const token = await fetchMapboxToken();
    if (!token) return;
    
    await getCurrentPosition();
  };

  const handleCategorySearch = async (category: PlaceCategory) => {
    setSelectedCategory(category);
    clearRoute();
    if (isMapInitialized) {
      await searchNearbyPlaces(category);
    }
  };

  const getDirections = async (place: ServiceCenter) => {
    if (!position || !mapboxToken || !map.current) return;

    setSelectedPlace(place);

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${position.coords.longitude},${position.coords.latitude};` +
        `${place.longitude},${place.latitude}?` +
        `steps=true&geometries=geojson&access_token=${mapboxToken}`
      );

      if (!response.ok) throw new Error('Failed to get directions');

      const data = await response.json();
      const route = data.routes[0];

      if (!route) {
        toast({
          title: "No Route Found",
          description: "Unable to find a route to this location",
          variant: "destructive",
        });
        return;
      }

      // Extract route information
      const routeInfo: RouteInfo = {
        distance: route.distance / 1000, // Convert to km
        duration: route.duration / 60, // Convert to minutes
        steps: route.legs[0].steps.map((step: any) => ({
          instruction: step.maneuver.instruction,
          distance: step.distance / 1000
        }))
      };

      setActiveRoute(routeInfo);

      // Draw route on map
      const coordinates = route.geometry.coordinates;

      // Remove existing route layer if any
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add route layer
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      // Fit map to show entire route
      const bounds = coordinates.reduce(
        (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
          return bounds.extend(coord as [number, number]);
        },
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );

      map.current.fitBounds(bounds, {
        padding: 50
      });

      toast({
        title: "Route Found",
        description: `${routeInfo.distance.toFixed(1)} km • ${Math.round(routeInfo.duration)} min`,
      });
    } catch (error) {
      console.error('Error getting directions:', error);
      toast({
        title: "Error",
        description: "Failed to get directions",
        variant: "destructive",
      });
    }
  };

  const clearRoute = () => {
    if (map.current && map.current.getLayer('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }
    setActiveRoute(null);
    setSelectedPlace(null);

    // Reset map view to user location
    if (position && map.current) {
      map.current.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 13
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Service Centers</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {!isMapInitialized && (
          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Find Nearby Places</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable location services to find service centers, car washes, and gas stations near you.
                </p>
              </div>
              
              <Button 
                onClick={handleGetLocation} 
                disabled={isLoading || isLoadingToken}
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isLoadingToken ? 'Loading...' : isLoading ? 'Getting Location...' : 'Enable Location'}
              </Button>
            </div>
          </Card>
        )}

        {isMapInitialized && (
          <>
            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">Search by Category</h2>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(categoryConfig) as PlaceCategory[]).map((category) => {
                  const config = categoryConfig[category];
                  const Icon = config.icon;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategorySearch(category)}
                      disabled={isSearching}
                      className="flex-1"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div ref={mapContainer} className="h-80 rounded-lg shadow-card" />

            {activeRoute && selectedPlace && (
              <Card className="p-4 shadow-card border-primary">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">Route to {selectedPlace.name}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{activeRoute.distance.toFixed(1)} km</span>
                        <span>•</span>
                        <span>{Math.round(activeRoute.duration)} min</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearRoute}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {activeRoute.steps.map((step, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-foreground">{step.instruction}</p>
                          <p className="text-muted-foreground text-xs">
                            {step.distance > 0 && `${step.distance.toFixed(1)} km`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                  {serviceCenters.length > 0 ? `Found ${serviceCenters.length} Places` : 'Click a category to search'}
                </h2>
                {isSearching && (
                  <Badge variant="secondary">Searching...</Badge>
                )}
              </div>
              
              {serviceCenters.map((center) => {
                const config = categoryConfig[center.category as PlaceCategory];
                const Icon = config.icon;
                const isSelected = selectedPlace?.id === center.id;
                return (
                  <Card key={center.id} className={`p-4 shadow-card ${isSelected ? 'border-primary' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: config.color }} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{center.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{center.address}</p>
                        {center.distance && (
                          <p className="text-sm text-primary mt-1">
                            {center.distance.toFixed(2)} km away
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => getDirections(center)}
                        >
                          <Route className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ServiceCenters;
