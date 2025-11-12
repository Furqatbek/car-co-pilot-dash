import { DollarSign, Plus, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const FinanceCard = () => {
  const { t } = useLanguage();
  const monthlyExpenses = {
    total: 450,
    breakdown: [
      { category: t('dashboard.gas'), amount: 180 },
      { category: t('dashboard.maintenance2'), amount: 150 },
      { category: t('dashboard.insurance'), amount: 120 },
    ]
  };

  const handleLogExpense = () => {
    toast.success(t('dashboard.expenseSoon'));
  };

  return (
    <Card className="p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">{t('dashboard.finance')}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-accent rounded-lg p-4 text-accent-foreground">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${monthlyExpenses.total}</span>
            <span className="text-sm opacity-90">{t('dashboard.thisMonth')}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs opacity-90">12% {t('dashboard.lessThanLast')}</span>
          </div>
        </div>

        <div className="space-y-2">
          {monthlyExpenses.breakdown.map((item) => (
            <div key={item.category} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{item.category}</span>
              <span className="text-sm font-semibold text-card-foreground">${item.amount}</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 transition-colors"
          onClick={handleLogExpense}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('dashboard.logExpense')}
        </Button>
      </div>
    </Card>
  );
};

export default FinanceCard;
