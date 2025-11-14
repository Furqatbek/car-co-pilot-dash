import { User, Car, Bell, Shield, Languages, ChevronRight, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage, languageNames, type Language } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface ProfileData {
  full_name: string | null;
  car_make: string | null;
  car_model: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { icon: Bell, label: t("nav.notifications"), color: "text-accent", path: "/notifications" },
    { icon: Shield, label: "Privacy & Security", color: "text-success", path: "/privacy" },
  ];

  const handleSignOut = async () => {
    await signOut();
    sonnerToast.success(t("header.signOutSuccess"));
  };

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
      .select("full_name, car_make, car_model")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: t("common.error"),
        description: "Failed to load profile",
        variant: "destructive",
      });
    } else if (data) {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const handleLanguageChange = async (newLang: string) => {
    await setLanguage(newLang as Language);
    toast({
      title: t("common.success"),
      description: `${t("profile.language")}: ${languageNames[newLang as Language]}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="max-w-md mx-auto px-4 py-6">
        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                alt={profile?.full_name || user?.email || "User avatar"}
              />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">
                {profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card
            className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            onClick={() => navigate("/vehicles")}
            data-testid="card-vehicle-info"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <Car className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-card-foreground text-sm">{t("profile.carInfo")}</div>
                {!isLoading && profile?.car_make && profile?.car_model && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {profile.car_make} {profile.car_model}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card
            className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            onClick={() => navigate("/car-documents")}
            data-testid="card-car-documents"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold text-card-foreground text-sm">Car Documents</div>
                <div className="text-xs text-muted-foreground mt-1">Manage & track</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Languages className="w-5 h-5 text-primary" />
            <span className="font-semibold text-card-foreground">{t("profile.language")}</span>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("profile.selectLanguage")} />
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

        <div className="space-y-3">
          {menuItems.map((item) => (
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

        <Button variant="destructive" className="w-full mt-6" onClick={handleSignOut} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          {t("profile.logout") || "Log Out"}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
