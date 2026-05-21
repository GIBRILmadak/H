import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function AlertsScreen() {
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { markAlertsAsRead, setHasUnreadAlerts } = useAppStore();

    const fetchBroadcasts = async () => {
        try {
            const { data, error } = await supabase
                .from("broadcasts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setBroadcasts(data);
        } catch (e) {
            console.error("Erreur lors de la récupération des alertes:", e);
        }
    };

    useEffect(() => {
        fetchBroadcasts();

        const channel = supabase
            .channel("broadcasts-realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "broadcasts" },
                (payload) => {
                    setBroadcasts((current) => [payload.new, ...current]);
                    setHasUnreadAlerts(true);
                },
            )
            .subscribe();

        // Marquer comme lu à l'entrée sur la page
        markAlertsAsRead();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBroadcasts();
        markAlertsAsRead();
        setRefreshing(false);
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "danger":
                return (
                    <Ionicons name="alert-circle" color="#EF4444" size={24} />
                );
            case "warning":
                return (
                    <Ionicons
                        name="warning-outline"
                        color="#F59E0B"
                        size={24}
                    />
                );
            default:
                return (
                    <Ionicons
                        name="information-circle"
                        color="#3B82F6"
                        size={24}
                    />
                );
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "--:--";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h1">Alertes Sanitaires</Typography>
                <Typography variant="body" color={Theme.colors.textSecondary}>
                    Informations officielles du personnel de santé.
                </Typography>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                    />
                }
            >
                {broadcasts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="notifications-off-outline"
                            size={48}
                            color="#D1D5DB"
                        />
                        <Typography
                            variant="body"
                            color={Theme.colors.textSecondary}
                            style={{ marginTop: 16 }}
                        >
                            Aucune alerte pour le moment.
                        </Typography>
                        <TouchableOpacity
                            onPress={onRefresh}
                            style={{ marginTop: 12 }}
                        >
                            <Typography
                                variant="label"
                                color={Theme.colors.primary}
                            >
                                Actualiser
                            </Typography>
                        </TouchableOpacity>
                    </View>
                ) : (
                    broadcasts.map((alert) => (
                        <TouchableOpacity key={alert.id} activeOpacity={0.8}>
                            <Card
                                style={[
                                    styles.alertCard,
                                    alert.type === "danger" &&
                                        styles.dangerCard,
                                ]}
                            >
                                <View style={styles.alertHeader}>
                                    <View style={styles.iconContainer}>
                                        {getAlertIcon(alert.type)}
                                    </View>
                                    <View style={styles.textContainer}>
                                        <View style={styles.titleRow}>
                                            <Typography
                                                variant="bodyMedium"
                                                style={{
                                                    fontWeight: "bold",
                                                    color:
                                                        alert.type === "danger"
                                                            ? "#B91C1C"
                                                            : "#1F2937",
                                                }}
                                            >
                                                {alert.type === "danger"
                                                    ? "URGENCE CRITIQUE"
                                                    : "INFORMATION"}
                                            </Typography>
                                            <Typography variant="caption">
                                                {formatTime(alert.created_at)}
                                            </Typography>
                                        </View>
                                        <Typography
                                            variant="body"
                                            style={styles.message}
                                        >
                                            {alert.message}
                                        </Typography>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        padding: 24,
        paddingTop: 40,
        backgroundColor: "#FFFFFF",
    },
    scrollContent: {
        padding: 20,
    },
    alertCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        backgroundColor: "#F9FAFB",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    dangerCard: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FEE2E2",
    },
    alertHeader: {
        flexDirection: "row",
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    message: {
        color: "#374151",
        fontSize: 14,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
});
