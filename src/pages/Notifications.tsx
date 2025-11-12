import { ArrowLeft, Bell, BellOff, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isRegistered, token, registerNotifications, unregisterNotifications } = usePushNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: t('common.error'),
        description: t('notifications.error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (isRegistered) {
      await unregisterNotifications();
    } else {
      await registerNotifications();
    }
  };

  const toggleReadStatus = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: !notification.is_read })
        .eq('id', notification.id);

      if (error) throw error;

      toast({
        description: notification.is_read ? t('notifications.markedUnread') : t('notifications.markedRead'),
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: t('common.error'),
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        description: t('notifications.deleted'),
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: t('common.error'),
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('notifications.justNow');
    if (diffInMinutes < 60) return `${diffInMinutes} ${t('notifications.minutesAgo')}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ${t('notifications.hoursAgo')}`;
    return `${Math.floor(diffInMinutes / 1440)} ${t('notifications.daysAgo')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
        {/* Recent Notifications Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('notifications.recent')}</h2>
          
          {loading ? (
            <Card className="p-6 shadow-card">
              <p className="text-center text-muted-foreground">{t('common.loading')}</p>
            </Card>
          ) : notifications.length === 0 ? (
            <Card className="p-8 shadow-card text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground mb-2">{t('notifications.noNotifications')}</h3>
              <p className="text-sm text-muted-foreground">{t('notifications.noNotificationsDesc')}</p>
            </Card>
          ) : (
            <Card className="shadow-card overflow-hidden">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 transition-colors ${
                      !notification.is_read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold text-sm ${
                            !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleReadStatus(notification)}
                        >
                          <Check className={`w-4 h-4 ${
                            notification.is_read ? 'text-muted-foreground' : 'text-primary'
                          }`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Push Notifications Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('notifications.settings')}</h2>
          
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isRegistered ? (
                  <Bell className="w-6 h-6 text-primary" />
                ) : (
                  <BellOff className="w-6 h-6 text-muted-foreground" />
                )}
                <div>
                  <h3 className="font-semibold text-card-foreground">{t('notifications.push')}</h3>
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

          <Card className="p-6 shadow-card mt-6">
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
        </div>
      </main>
    </div>
  );
};

export default Notifications;
