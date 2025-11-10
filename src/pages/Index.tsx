import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import MaintenanceCard from "@/components/dashboard/MaintenanceCard";
import ParkingCard from "@/components/dashboard/ParkingCard";
import DocumentCard from "@/components/dashboard/DocumentCard";
import FinanceCard from "@/components/dashboard/FinanceCard";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionGate } from "@/components/SubscriptionGate";

const Index = () => {
  const { subscription } = useAuth();
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <MaintenanceCard />
        
        {subscription.tier === 'premium' ? (
          <>
            <ParkingCard />
            <DocumentCard />
            <FinanceCard />
          </>
        ) : (
          <>
            <SubscriptionGate feature="unlimited parking spots with map">
              <ParkingCard />
            </SubscriptionGate>
            <SubscriptionGate feature="document expiry alerts">
              <DocumentCard />
            </SubscriptionGate>
            <SubscriptionGate feature="advanced financial insights">
              <FinanceCard />
            </SubscriptionGate>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
