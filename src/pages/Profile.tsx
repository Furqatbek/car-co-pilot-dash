import { User, Car, Bell, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const menuItems = [
    { icon: Car, label: "My Vehicles", color: "text-primary" },
    { icon: Bell, label: "Notifications", color: "text-accent" },
    { icon: Shield, label: "Privacy & Security", color: "text-success" },
  ];

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

        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card 
              key={item.label}
              className="p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
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
