import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const useNotificationsWrapper = () => {
    const requestPermission = async () => {
        if (Platform.OS === "web") {
            if (!("Notification" in window)) {
                console.warn("Web Notifications API not available");
                return { status: "denied" };
            }

            if (Notification.permission === "granted") {
                return { status: "granted" };
            }

            if (Notification.permission !== "denied") {
                try {
                    const permission = await Notification.requestPermission();
                    return {
                        status: permission === "granted" ? "granted" : "denied",
                    };
                } catch (error) {
                    console.error(
                        "Notification permission request failed:",
                        error,
                    );
                    return { status: "denied" };
                }
            }

            return { status: "denied" };
        }

        // Pour React Native/Expo
        return Notifications.requestPermissionsAsync();
    };

    const sendNotification = (title: string, options?: any) => {
        if (Platform.OS === "web") {
            if (
                "Notification" in window &&
                Notification.permission === "granted"
            ) {
                new Notification(title, {
                    icon: "/medias/logo.png",
                    ...options,
                });
            }
            return;
        }

        // Pour React Native/Expo
        Notifications.scheduleNotificationAsync({
            content: {
                title,
                body: options?.body || "",
                data: options?.data || {},
            },
            trigger: null,
        });
    };

    return { requestPermission, sendNotification };
};
