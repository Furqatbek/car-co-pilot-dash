import { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, Play, Square, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "@/hooks/use-toast";
import { Position } from '@capacitor/geolocation';
import { useLanguage } from "@/contexts/LanguageContext";

const MileageTracker = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { position, getCurrentPosition, watchPosition, clearWatch, calculateDistance } = useGeolocation();
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<Promise<string> | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const [tripHistory, setTripHistory] = useState<number[]>([]);

  const startTracking = async () => {
    const currentPos = await getCurrentPosition();
    if (currentPos) {
      setLastPosition(currentPos);
      setIsTracking(true);
      
      const id = watchPosition((newPosition) => {
        if (lastPosition) {
          const distance = calculateDistance(
            lastPosition.coords.latitude,
            lastPosition.coords.longitude,
            newPosition.coords.latitude,
            newPosition.coords.longitude
          );
          
          // Only add distance if moved more than 10 meters (to filter GPS noise)
          if (distance > 0.01) {
            setTotalDistance(prev => prev + distance);
          }
        }
        setLastPosition(newPosition);
      });
      
      setWatchId(id);
      toast({
        title: "Tracking Started",
        description: "Recording your mileage...",
      });
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      await clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    
    if (totalDistance > 0) {
      setTripHistory(prev => [...prev, totalDistance]);
      toast({
        title: "Trip Saved",
        description: `Distance: ${totalDistance.toFixed(2)} km`,
      });
    }
    
    setTotalDistance(0);
    setLastPosition(null);
  };

  const resetHistory = () => {
    setTripHistory([]);
    toast({
      title: "History Cleared",
      description: "All trip data has been reset",
    });
  };

  const totalMileage = tripHistory.reduce((sum, trip) => sum + trip, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t('mileage.title')}</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 shadow-card">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <Navigation className={`w-10 h-10 text-primary ${isTracking ? 'animate-pulse' : ''}`} />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {totalDistance.toFixed(2)} <span className="text-lg">km</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isTracking ? 'Current Trip' : 'Ready to Track'}
              </p>
            </div>

            <div className="flex gap-3">
              {!isTracking ? (
                <Button onClick={startTracking} className="flex-1" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button onClick={stopTracking} variant="destructive" className="flex-1" size="lg">
                  <Square className="w-4 h-4 mr-2" />
                  Stop & Save
                </Button>
              )}
            </div>

            {position && (
              <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                <p>Lat: {position.coords.latitude.toFixed(6)}</p>
                <p>Lng: {position.coords.longitude.toFixed(6)}</p>
                <p>Accuracy: ±{position.coords.accuracy.toFixed(0)}m</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Trip History</h3>
            </div>
            {tripHistory.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resetHistory}>
                Clear
              </Button>
            )}
          </div>

          {tripHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trips recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="font-semibold text-card-foreground">Total Mileage</span>
                <span className="text-lg font-bold text-primary">{totalMileage.toFixed(2)} km</span>
              </div>
              
              <div className="space-y-2">
                {tripHistory.map((trip, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-border rounded">
                    <span className="text-sm text-muted-foreground">Trip {tripHistory.length - index}</span>
                    <span className="text-sm font-medium text-card-foreground">{trip.toFixed(2)} km</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-3">How it works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              The mileage tracker uses your device's GPS to automatically calculate distance traveled.
            </p>
            <p>
              Start tracking before your trip and stop when you're done. All trips are saved to your history.
            </p>
            <p className="text-xs text-muted-foreground/70 pt-2">
              Note: Requires location permissions and works best with high GPS accuracy.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MileageTracker;
