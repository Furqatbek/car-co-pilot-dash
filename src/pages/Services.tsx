import { MapPin, Wrench, Droplets, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";

const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    { 
      icon: Wrench, 
      name: "Service Centers", 
      count: 8,
      color: "text-primary",
      path: "/service-centers"
    },
    { 
      icon: TrendingUp, 
      name: "Mileage Tracker", 
      description: "Track your trips",
      color: "text-accent",
      path: "/mileage"
    },
    { 
      icon: Droplets, 
      name: "Gas Stations", 
      count: 12,
      color: "text-success",
      path: "/service-centers"
    },
    { 
      icon: MapPin, 
      name: "Car Wash", 
      count: 15,
      color: "text-destructive",
      path: "/service-centers"
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Nearby Services</h2>
        
        <div className="space-y-4">
          {services.map((service) => (
            <Card 
              key={service.name}
              className="p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => navigate(service.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.count ? `${service.count} nearby locations` : service.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
