import { MapPin, Wrench, Droplets } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";

const Services = () => {
  const services = [
    { 
      icon: Droplets, 
      name: "Gas Stations", 
      count: 12,
      color: "text-accent"
    },
    { 
      icon: Wrench, 
      name: "Service Centers", 
      count: 8,
      color: "text-primary"
    },
    { 
      icon: MapPin, 
      name: "Car Wash", 
      count: 15,
      color: "text-success"
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
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.count} nearby locations</p>
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
