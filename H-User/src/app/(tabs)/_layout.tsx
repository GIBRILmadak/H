import { useTracing } from "@/hooks/useTracing";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabsLayout() {
    useTracing();
    const { hasUnreadAlerts } = useAppStore();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="exposure"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="shield-checkmark-outline"
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    tabBarIcon: () => (
                        <View style={styles.centerButtonContainer}>
                            <Ionicons name="map" color="#FFFFFF" size={28} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <Ionicons
                                name="notifications-outline"
                                color={color}
                                size={24}
                            />
                            {hasUnreadAlerts && <View style={styles.badge} />}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="person-outline"
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 24,
        left: 20,
        right: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 35,
        height: 70,
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        paddingBottom: 0,
        paddingHorizontal: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    centerButtonContainer: {
        backgroundColor: "#000000",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Platform.OS === "web" ? 0 : 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    badge: {
        position: "absolute",
        right: -6,
        top: -6,
        backgroundColor: "#EF4444",
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
});
