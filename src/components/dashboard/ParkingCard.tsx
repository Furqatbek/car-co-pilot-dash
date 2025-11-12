import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const ParkingCard = () => {
  const { t } = useLanguage();
  const savedLocation = {
    lat: 40.7128,
    lng: -74.0060,
    address: "Downtown Parking"
  };

  const handleSaveSpot = () => {
    toast.success(t('dashboard.spotSaved'), {
      description: t('dashboard.locationMarked')
    });
  };

  const handleNavigate = () => {
    toast.info(t('dashboard.openingNav'));
  };

  return (
    <Card className="p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">{t('dashboard.parking')}</h2>
      </div>
      
      <div className="space-y-4">
        {savedLocation ? (
          <>
            <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">{savedLocation.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {savedLocation.lat.toFixed(4)}, {savedLocation.lng.toFixed(4)}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-accent hover:text-accent hover:bg-accent/10"
                onClick={handleNavigate}
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t('dashboard.noParking')}</p>
        )}
        
        <Button 
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={handleSaveSpot}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {t('dashboard.saveSpot')}
        </Button>
      </div>
    </Card>
  );
};

export default ParkingCard;
