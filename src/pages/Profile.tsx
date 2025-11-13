import { User, Car, Bell, Shield, Languages, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage, languageNames, type Language } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string | null;
  car_make: string | null;
  car_model: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const menuItems = [
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
      .select('full_name, car_make, car_model')
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

        <Card 
          className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer mb-6"
          onClick={() => navigate('/vehicles')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-card-foreground">{t('profile.carInfo')}</div>
                {!isLoading && profile?.car_make && profile?.car_model && (
                  <div className="text-sm text-muted-foreground">
                    {profile.car_make} {profile.car_model}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
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
