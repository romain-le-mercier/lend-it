import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '@/infrastructure/notifications/NotificationService';
import { container } from '@/infrastructure/di/container';

export const useNotifications = () => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const notificationService = new NotificationService();

  useEffect(() => {
    // Request permissions on mount
    notificationService.requestPermissions();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const itemId = response.notification.request.content.data?.itemId;
      if (itemId) {
        // TODO: Navigate to item details
        console.log('Navigate to item:', itemId);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleNotificationForItem = async (item: any) => {
    try {
      const notificationId = await notificationService.scheduleOverdueNotification(item);
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  };

  return {
    scheduleNotificationForItem,
    cancelNotification: notificationService.cancelNotification,
    cancelAllNotifications: notificationService.cancelAllNotifications,
  };
};