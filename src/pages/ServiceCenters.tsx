import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ServiceCenter {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

// Mock service centers - replace with actual data from your backend
const mockServiceCenters: ServiceCenter[] = [
  { id: 1, name: "Quick Fix Auto", address: "123 Main St", latitude: 40.7128, longitude: -74.0060 },
  { id: 2, name: "Pro Mechanics", address: "456 Oak Ave", latitude: 40.7580, longitude: -73.9855 },
  { id: 3, name: "Elite Auto Care", address: "789 Pine Rd", latitude: 40.6782, longitude: -73.9442 },
];

const ServiceCenters = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const { position, isLoading, getCurrentPosition, calculateDistance } = useGeolocation();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>(mockServiceCenters);

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

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    const userLat = position?.coords.latitude || 40.7128;
    const userLng = position?.coords.longitude || -74.0060;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLng, userLat],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([userLng, userLat])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
      .addTo(map.current);

    // Add service center markers
    serviceCenters.forEach((center) => {
      if (map.current) {
        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([center.longitude, center.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${center.name}</h3><p>${center.address}</p>${center.distance ? `<p>${center.distance.toFixed(2)} km away</p>` : ''}`
            )
          )
          .addTo(map.current);
      }
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    if (position && mapboxToken && !isMapInitialized) {
      // Calculate distances from user location
      const centersWithDistance = serviceCenters.map(center => ({
        ...center,
        distance: calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          center.latitude,
          center.longitude
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setServiceCenters(centersWithDistance);
      initializeMap();
    }
  }, [position, mapboxToken, isMapInitialized]);

  const handleGetLocation = async () => {
    const token = await fetchMapboxToken();
    if (!token) return;
    
    await getCurrentPosition();
    toast({
      title: "Location Found",
      description: "Showing nearby service centers",
    });
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
                <h3 className="font-semibold text-card-foreground mb-2">Find Nearby Service Centers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable location services to find service centers near you.
                </p>
              </div>
              
              <Button 
                onClick={handleGetLocation} 
                disabled={isLoading || isLoadingToken}
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isLoadingToken ? 'Loading...' : isLoading ? 'Getting Location...' : 'Find Nearby Centers'}
              </Button>
            </div>
          </Card>
        )}

        {isMapInitialized && (
          <>
            <div ref={mapContainer} className="h-80 rounded-lg shadow-card" />

            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">Nearby Service Centers</h2>
              {serviceCenters.map((center) => (
                <Card key={center.id} className="p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{center.name}</h3>
                      <p className="text-sm text-muted-foreground">{center.address}</p>
                      {center.distance && (
                        <p className="text-sm text-primary mt-1">
                          {center.distance.toFixed(2)} km away
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ServiceCenters;
