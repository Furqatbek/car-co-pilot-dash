import { Car, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/layout/BottomNav";

interface ProfileData {
  car_make: string | null;
  car_model: string | null;
  car_year: number | null;
  car_plate: string | null;
}

const Vehicles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [carForm, setCarForm] = useState({
    car_make: "",
    car_model: "",
    car_year: "",
    car_plate: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("car_make, car_model, car_year, car_plate")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: t("common.error"),
        description: "Failed to load vehicle information",
        variant: "destructive",
      });
    } else if (data) {
      setProfile(data);
      setCarForm({
        car_make: data.car_make || "",
        car_model: data.car_model || "",
        car_year: data.car_year?.toString() || "",
        car_plate: data.car_plate || "",
      });
    }
    setIsLoading(false);
  };

  const handleCarFormChange = (field: string, value: string) => {
    setCarForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCarInfo = async () => {
    if (!user) return;

    const yearNum = carForm.car_year ? parseInt(carForm.car_year) : null;

    const { error } = await supabase
      .from("profiles")
      .update({
        car_make: carForm.car_make || null,
        car_model: carForm.car_model || null,
        car_year: yearNum,
        car_plate: carForm.car_plate || null,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error saving car info:", error);
      toast({
        title: t("common.error"),
        description: "Failed to save vehicle information",
        variant: "destructive",
      });
    } else {
      toast({
        title: t("common.success"),
        description: "Vehicle information saved successfully",
      });
      fetchProfile();
    }
  };

  const hasCarInfo = profile?.car_make || profile?.car_model || profile?.car_year || profile?.car_plate;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-card-foreground">Vehicle Information</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground">My Vehicle</h2>
              <p className="text-sm text-muted-foreground">
                {hasCarInfo ? "Manage your vehicle details" : "Add your vehicle information"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="car_make">Make</Label>
                <Input
                  id="car_make"
                  value={carForm.car_make}
                  onChange={(e) => handleCarFormChange("car_make", e.target.value)}
                  placeholder="e.g., Toyota, Honda, Ford"
                />
              </div>

              <div>
                <Label htmlFor="car_model">Model</Label>
                <Input
                  id="car_model"
                  value={carForm.car_model}
                  onChange={(e) => handleCarFormChange("car_model", e.target.value)}
                  placeholder="e.g., Camry, Civic, Mustang"
                />
              </div>

              <div>
                <Label htmlFor="car_year">Year</Label>
                <Input
                  id="car_year"
                  type="number"
                  value={carForm.car_year}
                  onChange={(e) => handleCarFormChange("car_year", e.target.value)}
                  placeholder="e.g., 2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <Label htmlFor="car_plate">License Plate</Label>
                <Input
                  id="car_plate"
                  value={carForm.car_plate}
                  onChange={(e) => handleCarFormChange("car_plate", e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                />
              </div>

              <Button onClick={handleSaveCarInfo} className="w-full mt-6">
                Save Vehicle Information
              </Button>

              {hasCarInfo && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Current Information</h3>
                  <div className="space-y-2 text-sm">
                    {profile?.car_make && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Make:</span>
                        <span className="font-medium">{profile.car_make}</span>
                      </div>
                    )}
                    {profile?.car_model && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium">{profile.car_model}</span>
                      </div>
                    )}
                    {profile?.car_year && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">{profile.car_year}</span>
                      </div>
                    )}
                    {profile?.car_plate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License Plate:</span>
                        <span className="font-medium">{profile.car_plate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Vehicles;
