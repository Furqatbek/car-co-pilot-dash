import { useState, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { toast } from '@/hooks/use-toast';

export const useGeolocation = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check permissions
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      setPosition(coordinates);
      return coordinates;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const watchPosition = (callback: (position: Position) => void) => {
    const watchId = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      },
      (position, err) => {
        if (err) {
          setError(err.message);
          return;
        }
        if (position) {
          setPosition(position);
          callback(position);
        }
      }
    );

    return watchId;
  };

  const clearWatch = async (watchId: Promise<string>) => {
    const id = await watchId;
    await Geolocation.clearWatch({ id });
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  return {
    position,
    error,
    isLoading,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    calculateDistance,
  };
};
