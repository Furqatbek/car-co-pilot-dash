import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Subscription = () => {
  const { subscription, checkSubscription } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        toast.error(error.message || t('subscription.checkoutError'));
        return;
      }
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error(error.message || t('subscription.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        toast.error(error.message || t('subscription.portalError'));
        return;
      }
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast.error(error.message || t('subscription.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await checkSubscription();
    setLoading(false);
    toast.success(t('subscription.statusRefreshed'));
  };

  const freeTierFeatures = [
    t('subscription.freeFeature1'),
    t('subscription.freeFeature2'),
    t('subscription.freeFeature3'),
    t('subscription.freeFeature4')
  ];

  const premiumFeatures = [
    t('subscription.premiumFeature1'),
    t('subscription.premiumFeature2'),
    t('subscription.premiumFeature3'),
    t('subscription.premiumFeature4'),
    t('subscription.premiumFeature5'),
    t('subscription.premiumFeature6')
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t('subscription.title')}</h1>
          <p className="text-muted-foreground">{t('subscription.subtitle')}</p>
        </div>

        {subscription.subscribed && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  {t('subscription.currentPlan')}
                </CardTitle>
                <Badge variant="default">{t('subscription.premium')}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {subscription.subscription_end && 
                  `${t('subscription.renewsOn')} ${new Date(subscription.subscription_end).toLocaleDateString()}`
                }
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="flex-1"
                >
                  {t('subscription.manageSubscription')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {/* Free Tier */}
          <Card className={!subscription.subscribed ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('subscription.free')}</span>
                {!subscription.subscribed && <Badge>{t('subscription.currentPlan')}</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">{t('subscription.perMonth')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {freeTierFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className={subscription.subscribed ? 'border-primary bg-primary/5' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  {t('subscription.premium')}
                </span>
                {subscription.subscribed && <Badge variant="default">{t('subscription.active')}</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">$4.99</span>
                <span className="text-muted-foreground">{t('subscription.perMonth')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {!subscription.subscribed && (
                <Button 
                  className="w-full" 
                  onClick={handleUpgrade}
                  disabled={loading}
                >
                  {loading ? t('subscription.loading') : t('subscription.upgradeToPremium')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Subscription;
