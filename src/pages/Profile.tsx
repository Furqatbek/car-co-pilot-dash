import { User, Car, Bell, Shield, Languages, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage, languageNames, type Language } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string | null;
  car_make: string | null;
  car_model: string | null;
  car_year: number | null;
  car_plate: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [carForm, setCarForm] = useState({
    car_make: "",
    car_model: "",
    car_year: "",
    car_plate: ""
  });
  
  const menuItems = [
    { icon: Car, label: t('profile.carInfo'), color: "text-primary", path: "/vehicles" },
    { icon: Bell, label: t('nav.notifications'), color: "text-accent", path: "/notifications" },
    { icon: Shield, label: "Privacy & Security", color: "text-success", path: "/privacy" },
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, car_make, car_model, car_year, car_plate')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load profile',
        variant: 'destructive'
      });
    } else if (data) {
      setProfile(data);
      setCarForm({
        car_make: data.car_make || "",
        car_model: data.car_model || "",
        car_year: data.car_year?.toString() || "",
        car_plate: data.car_plate || ""
      });
    }
    setIsLoading(false);
  };

  const handleLanguageChange = async (newLang: string) => {
    await setLanguage(newLang as Language);
    toast({
      title: t('common.success'),
      description: `${t('profile.language')}: ${languageNames[newLang as Language]}`,
    });
  };

  const handleCarFormChange = (field: string, value: string) => {
    setCarForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCarInfo = async () => {
    if (!user) return;

    const yearNum = carForm.car_year ? parseInt(carForm.car_year) : null;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        car_make: carForm.car_make || null,
        car_model: carForm.car_model || null,
        car_year: yearNum,
        car_plate: carForm.car_plate || null
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error saving car info:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to save car information',
        variant: 'destructive'
      });
    } else {
      toast({
        title: t('common.success'),
        description: 'Car information saved successfully'
      });
      setIsEditingCar(false);
      fetchProfile();
    }
  };

  const hasCarInfo = profile?.car_make || profile?.car_model || profile?.car_year || profile?.car_plate;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Car Information Section */}
        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">{t('profile.carInfo')}</h3>
            </div>
            {hasCarInfo && !isEditingCar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingCar(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : !hasCarInfo || isEditingCar ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="car_make">Make</Label>
                <Input
                  id="car_make"
                  value={carForm.car_make}
                  onChange={(e) => handleCarFormChange('car_make', e.target.value)}
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <Label htmlFor="car_model">Model</Label>
                <Input
                  id="car_model"
                  value={carForm.car_model}
                  onChange={(e) => handleCarFormChange('car_model', e.target.value)}
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <Label htmlFor="car_year">Year</Label>
                <Input
                  id="car_year"
                  type="number"
                  value={carForm.car_year}
                  onChange={(e) => handleCarFormChange('car_year', e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <Label htmlFor="car_plate">License Plate</Label>
                <Input
                  id="car_plate"
                  value={carForm.car_plate}
                  onChange={(e) => handleCarFormChange('car_plate', e.target.value)}
                  placeholder="e.g., ABC123"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCarInfo} className="flex-1">
                  Save
                </Button>
                {hasCarInfo && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingCar(false);
                      setCarForm({
                        car_make: profile?.car_make || "",
                        car_model: profile?.car_model || "",
                        car_year: profile?.car_year?.toString() || "",
                        car_plate: profile?.car_plate || ""
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {profile.car_make && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Make:</span>
                  <span className="font-medium">{profile.car_make}</span>
                </div>
              )}
              {profile.car_model && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{profile.car_model}</span>
                </div>
              )}
              {profile.car_year && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{profile.car_year}</span>
                </div>
              )}
              {profile.car_plate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License Plate:</span>
                  <span className="font-medium">{profile.car_plate}</span>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Languages className="w-5 h-5 text-primary" />
            <span className="font-semibold text-card-foreground">{t('profile.language')}</span>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('profile.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageNames).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <div className="space-y-3">{menuItems.map((item) => (
            <Card 
              key={item.label}
              className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-card-foreground font-medium">{item.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
