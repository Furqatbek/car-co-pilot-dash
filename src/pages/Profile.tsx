import { User, Car, Bell, Shield, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage, languageNames, type Language } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  
  const menuItems = [
    { icon: Car, label: t('profile.carInfo'), color: "text-primary", path: "/vehicles" },
    { icon: Bell, label: t('nav.notifications'), color: "text-accent", path: "/notifications" },
    { icon: Shield, label: "Privacy & Security", color: "text-success", path: "/privacy" },
  ];

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
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            </div>
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
