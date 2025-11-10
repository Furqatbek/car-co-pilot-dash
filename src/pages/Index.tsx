import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import MaintenanceCard from "@/components/dashboard/MaintenanceCard";
import ParkingCard from "@/components/dashboard/ParkingCard";
import DocumentCard from "@/components/dashboard/DocumentCard";
import FinanceCard from "@/components/dashboard/FinanceCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <MaintenanceCard />
        <ParkingCard />
        <DocumentCard />
        <FinanceCard />
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
