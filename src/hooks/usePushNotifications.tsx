import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from '@/hooks/use-toast';

export const usePushNotifications = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check permission status on mount
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await PushNotifications.checkPermissions();
      setIsRegistered(result.receive === 'granted');
    } catch (error) {
      console.log('Push notifications not available on this platform');
    }
  };

  const registerNotifications = async () => {
    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your device settings.",
          variant: "destructive",
        });
        return;
      }

      // Register with Apple / Google to receive push via APNS/FCM
      await PushNotifications.register();

      // Listen for registration success
      await PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        setToken(token.value);
        setIsRegistered(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive alerts about your vehicle.",
        });
      });

      // Listen for registration errors
      await PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
        toast({
          title: "Registration Failed",
          description: "Could not register for push notifications.",
          variant: "destructive",
        });
      });

      // Listen for push notifications received
      await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
          console.log('Push notification received: ', notification);
          toast({
            title: notification.title || "New Notification",
            description: notification.body || "",
          });
        }
      );

      // Listen for notification actions performed
      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          console.log('Push notification action performed', notification.actionId, notification.notification);
        }
      );

    } catch (error) {
      console.error('Error registering for push notifications:', error);
      toast({
        title: "Error",
        description: "Push notifications are not available on this device.",
        variant: "destructive",
      });
    }
  };

  const unregisterNotifications = async () => {
    try {
      await PushNotifications.removeAllListeners();
      setIsRegistered(false);
      setToken(null);
      toast({
        title: "Notifications Disabled",
        description: "You won't receive push notifications anymore.",
      });
    } catch (error) {
      console.error('Error unregistering notifications:', error);
    }
  };

  return {
    isRegistered,
    token,
    registerNotifications,
    unregisterNotifications,
  };
};
