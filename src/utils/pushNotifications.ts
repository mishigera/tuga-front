import { LocalNotifications } from "@capacitor/local-notifications";

export const sendPushNotification = (title: string, body: string) => {
  return LocalNotifications.schedule({
    notifications: [
      {
        title: title,
        body: body,
        id: 1,
        schedule: { at: new Date(Date.now() + 1000 * 5) },
        actionTypeId: "",
        extra: null,
      },
    ],
  });
};
