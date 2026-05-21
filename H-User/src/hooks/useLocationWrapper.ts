import { Platform } from "react-native";
import * as Location from "expo-location";

export const useLocationWrapper = () => {
    const requestPermission = async () => {
        if (Platform.OS === "web") {
            return new Promise((resolve) => {
                if (!navigator.geolocation) {
                    resolve({ status: "denied" });
                    return;
                }
                resolve({ status: "granted" });
            });
        }
        return Location.requestForegroundPermissionsAsync();
    };

    const getCurrentPosition = async () => {
        if (Platform.OS === "web") {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation API not available"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                altitude: position.coords.altitude,
                                altitudeAccuracy:
                                    position.coords.altitudeAccuracy,
                                heading: position.coords.heading,
                                speed: position.coords.speed,
                            },
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                );
            });
        }
        return Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
    };

    const watchPosition = (callback: (location: any) => void) => {
        if (Platform.OS === "web") {
            if (!navigator.geolocation) return null;
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    callback({
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                        },
                    });
                },
                (error) => {
                    console.error("Geolocation watch error:", error);
                },
            );
            return () => navigator.geolocation.clearWatch(id);
        }

        // Pour React Native
        Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 5000 },
            (location) => callback(location),
        ).then((subscription) => {
            return () => subscription.remove();
        });
    };

    return { requestPermission, getCurrentPosition, watchPosition };
};
