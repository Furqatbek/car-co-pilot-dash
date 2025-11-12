import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface FluidLevel {
  name: string;
  percentage: number;
  color: string;
}

const MaintenanceCard = () => {
  const { t } = useLanguage();
  const fluidLevels: FluidLevel[] = [
    { name: t('dashboard.oil'), percentage: 75, color: "text-success" },
    { name: t('dashboard.gas'), percentage: 45, color: "text-warning" },
  ];

  const getGaugeColor = (percentage: number) => {
    if (percentage >= 70) return "stroke-success";
    if (percentage >= 40) return "stroke-warning";
    return "stroke-destructive";
  };

  return (
    <Card className="p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">{t('dashboard.maintenance')}</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {fluidLevels.map((fluid) => (
          <div key={fluid.name} className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  className={getGaugeColor(fluid.percentage)}
                  strokeWidth="8"
                  strokeDasharray={`${fluid.percentage * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-card-foreground">{fluid.percentage}%</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{fluid.name}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MaintenanceCard;
