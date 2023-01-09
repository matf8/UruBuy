import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { sendToken } from "../services/Requests";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SettingNotifications() {
  const nav = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationData, setData] = useState({
    title: "",
    body: "",
    category: "",
    purchaseId: "",
  });
  const notificationListener = useRef();
  const responseListener = useRef();
  const [tokenSent, setTokenSent] = useState(false);
  const [userNotification, setUserNotification] = useState(true);

  const manageSentToken = (token: any) => {
    if (tokenSent === false) {
      sendToken(token);
      setTokenSent(true);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      setExpoPushToken(token!);
      manageSentToken(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
      setNotification(notification);
      setData({
        title: notification.request.content.title,
        body: notification.request.content.body,
        category: notification.request.content.data.category,
        purchaseId: notification.request.content.data.purchaseId,
      });
    }) as never;

    // This listener when is tapped
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      notificationData.category && notificationData.category !== ""
        ? notificationData.category === "estado"
          ? nav.navigate(
              "Notification" as never,
              {
                category: notificationData.category,
                purchaseId: notificationData.purchaseId,
              } as never,
            )
          : nav.navigate(
              "Notification" as never,
              {
                category: notificationData.category,
              } as never,
            )
        : console.error("no category");
    }) as never;
  }, [notificationData, nav]);

  return <></>;
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}
