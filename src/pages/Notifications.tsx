import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useLanguage } from "@/contexts/LanguageContext";

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isRegistered, token, registerNotifications, unregisterNotifications } = usePushNotifications();

  const handleToggle = async () => {
    if (isRegistered) {
      await unregisterNotifications();
    } else {
      await registerNotifications();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t('notifications.title')}</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isRegistered ? (
                <Bell className="w-6 h-6 text-primary" />
              ) : (
                <BellOff className="w-6 h-6 text-muted-foreground" />
              )}
              <div>
                <h2 className="font-semibold text-card-foreground">{t('notifications.push')}</h2>
                <p className="text-sm text-muted-foreground">
                  {isRegistered ? t('notifications.enabled') : t('notifications.disabled')}
                </p>
              </div>
            </div>
            <Switch
              checked={isRegistered}
              onCheckedChange={handleToggle}
            />
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t('notifications.enableReceive')}
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t('notifications.maintenanceReminders')}</li>
              <li>{t('notifications.expirationWarnings')}</li>
              <li>{t('notifications.appointments')}</li>
              <li>{t('notifications.updates')}</li>
            </ul>
          </div>

          {token && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {t('notifications.deviceToken')}: <code className="text-xs break-all">{token.substring(0, 40)}...</code>
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-3">{t('notifications.howWorks')}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              {t('notifications.whenEnabled')}
            </p>
            <p>
              {t('notifications.requiresNative')}
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Notifications;
