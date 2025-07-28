import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ILentItem } from '@/domain/entities/LentItem';

export interface INotificationService {
  requestPermissions(): Promise<boolean>;
  scheduleOverdueNotification(item: ILentItem): Promise<string>;
  cancelNotification(notificationId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
}

export class NotificationService implements INotificationService {
  constructor() {
    this.configureNotifications();
  }

  private configureNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // On web, we'll just return true as we can't really schedule push notifications
      console.log('Notifications are simulated on web platform');
      return true;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#A855F7',
      });
    }

    return true;
  }

  async scheduleOverdueNotification(item: ILentItem): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    if (Platform.OS === 'web') {
      // On web, we'll just simulate the notification ID
      console.log(`Would schedule notification for item: ${item.itemName}`);
      return `web-notification-${item.id}-${Date.now()}`;
    }

    // Schedule notification for 1 day after due date
    const oneDayAfterDue = new Date(item.expectedReturnDate);
    oneDayAfterDue.setDate(oneDayAfterDue.getDate() + 1);
    oneDayAfterDue.setHours(10, 0, 0, 0); // 10 AM

    const trigger = oneDayAfterDue.getTime() - Date.now();
    
    if (trigger <= 0) {
      // Item is already overdue, schedule immediate notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Item Overdue! 🔴',
          body: `"${item.itemName}" borrowed by ${item.borrowerName} is overdue`,
          data: { itemId: item.id },
          categoryIdentifier: 'overdue',
        },
        trigger: null, // Immediate
      });
      return notificationId;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Item Overdue! 🔴',
        body: `"${item.itemName}" borrowed by ${item.borrowerName} was due yesterday`,
        data: { itemId: item.id },
        categoryIdentifier: 'overdue',
      },
      trigger: {
        seconds: Math.floor(trigger / 1000),
      },
    });

    // Schedule weekly reminders if still not returned
    this.scheduleWeeklyReminder(item, 7);

    return notificationId;
  }

  private async scheduleWeeklyReminder(item: ILentItem, daysFromNow: number): Promise<void> {
    if (Platform.OS === 'web') {
      console.log(`Would schedule weekly reminder for item: ${item.itemName}`);
      return;
    }

    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + daysFromNow);
    reminderDate.setHours(10, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder: Item Still Overdue! 🔴',
        body: `"${item.itemName}" borrowed by ${item.borrowerName} is ${daysFromNow} days overdue`,
        data: { itemId: item.id },
        categoryIdentifier: 'reminder',
      },
      trigger: {
        seconds: Math.floor((reminderDate.getTime() - Date.now()) / 1000),
      },
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      console.log(`Would cancel notification: ${notificationId}`);
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('Would cancel all notifications');
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications() {
    if (Platform.OS === 'web') {
      return [];
    }
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}