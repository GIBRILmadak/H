import React, { useState, useEffect } from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    Alert,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { HealthStatusCard } from "@/components/HealthStatusCard";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { useLocationWrapper } from "@/hooks/useLocationWrapper";

export default function HomeScreen() {
    const router = useRouter();
    const { user, contacts } = useAppStore();
    const [zoneStatus, setZoneStatus] = useState("Sûr");
    const { requestPermission, getCurrentPosition } = useLocationWrapper();

    useEffect(() => {
        checkLocalZone();
        // Rafraîchir toutes les 2 minutes ou lors de changements sur la map
        const sub = supabase
            .channel("map-sync-home")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "map_entities" },
                checkLocalZone,
            )
            .subscribe();
        return () => {
            supabase.removeChannel(sub);
        };
    }, []);

    const getDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ) => {
        const R = 6371e3; // Rayon de la terre en mètres
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance en mètres
    };

    const checkLocalZone = async () => {
        try {
            const { status } = await requestPermission();
            if (status !== "granted") return;

            const loc = await getCurrentPosition();
            const { data: entities } = await supabase
                .from("map_entities")
                .select("*");

            if (entities) {
                let currentStatus = "Sûr";
                for (const e of entities) {
                    if (e.type === "red_zone" || e.type === "orange_zone") {
                        const dist = getDistance(
                            loc.coords.latitude,
                            loc.coords.longitude,
                            e.lat,
                            e.lng,
                        );
                        if (dist <= (e.radius || 500)) {
                            currentStatus =
                                e.type === "red_zone" ? "Danger" : "Risque";
                            break;
                        }
                    }
                }
                setZoneStatus(currentStatus);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Calcul des statistiques
    const today = new Date().setHours(0, 0, 0, 0);
    const contactsToday = contacts.filter((c) => c.timestamp >= today).length;
    const syncScore = user ? 100 : 0;

    const handleSOSCall = () => {
        const phoneNumber = "tel:151";
        Linking.canOpenURL(phoneNumber).then((supported) => {
            if (!supported) {
                Alert.alert(
                    "Erreur",
                    "Votre appareil ne permet pas de passer des appels.",
                );
            } else {
                Alert.alert(
                    "Urgence SOS",
                    "Appeler le service d'urgence (151) ?",
                    [
                        { text: "Annuler", style: "cancel" },
                        {
                            text: "Appeler",
                            onPress: () => Linking.openURL(phoneNumber),
                        },
                    ],
                );
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Typography variant="caption">Bienvenue,</Typography>
                        <Typography variant="h2">
                            {user?.name || "Utilisateur Anonyme"}
                        </Typography>
                    </View>
                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={() => router.push("/(tabs)/profile")}
                    >
                        {user?.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                style={styles.avatarImg}
                            />
                        ) : (
                            <Ionicons name="person" color="#FFFFFF" size={24} />
                        )}
                    </TouchableOpacity>
                </View>

                <HealthStatusCard
                    status={user?.status || "safe"}
                    lastSync="2 min"
                />

                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>
                        Actions Rapides
                    </Typography>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push("/questionnaire")}
                        >
                            <View
                                style={[
                                    styles.actionIcon,
                                    { backgroundColor: "#EEF4FF" },
                                ]}
                            >
                                <Ionicons
                                    name="pulse-outline"
                                    color="#3538CD"
                                    size={24}
                                />
                            </View>
                            <Typography variant="label">Signalement</Typography>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push("/daily-check")}
                        >
                            <View
                                style={[
                                    styles.actionIcon,
                                    { backgroundColor: "#F9F5FF" },
                                ]}
                            >
                                <Ionicons
                                    name="thermometer-outline"
                                    color="#6941C6"
                                    size={24}
                                />
                            </View>
                            <Typography variant="label">Suivi</Typography>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={handleSOSCall}
                        >
                            <View
                                style={[
                                    styles.actionIcon,
                                    { backgroundColor: "#FDF2FA" },
                                ]}
                            >
                                <Ionicons
                                    name="flash-outline"
                                    color="#C11574"
                                    size={24}
                                />
                            </View>
                            <Typography variant="label">SOS 151</Typography>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography variant="h3">
                            Expositions Récentes
                        </Typography>
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/exposure")}
                        >
                            <Typography
                                variant="label"
                                color={Theme.colors.primary}
                            >
                                Voir Tout
                            </Typography>
                        </TouchableOpacity>
                    </View>
                    <Card variant="outline" style={styles.exposureSummary}>
                        {contacts.length > 0 ? (
                            <View style={styles.exposureItem}>
                                <View style={styles.exposureInfo}>
                                    <Typography variant="bodyMedium">
                                        Dernier contact détecté
                                    </Typography>
                                    <Typography variant="caption">
                                        Appareil{" "}
                                        {contacts[contacts.length - 1].id}
                                    </Typography>
                                </View>
                                <View
                                    style={[
                                        styles.riskBadge,
                                        { backgroundColor: "#ECFDF5" },
                                    ]}
                                >
                                    <Typography variant="label" color="#10B981">
                                        Normal
                                    </Typography>
                                </View>
                            </View>
                        ) : (
                            <Typography variant="caption" align="center">
                                Aucun contact récent détecté
                            </Typography>
                        )}
                    </Card>
                </View>

                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>
                        Aperçu Santé
                    </Typography>
                    <View style={styles.insightGrid}>
                        <Card style={styles.insightCard}>
                            <Typography variant="h2">
                                {contactsToday}
                            </Typography>
                            <Typography variant="caption" align="center">
                                Contacts
                            </Typography>
                        </Card>
                        <Card style={styles.insightCard}>
                            <Typography variant="h2">{syncScore}%</Typography>
                            <Typography variant="caption" align="center">
                                Sync
                            </Typography>
                        </Card>
                        <Card
                            style={[
                                styles.insightCard,
                                zoneStatus !== "Sûr" && {
                                    backgroundColor:
                                        zoneStatus === "Danger"
                                            ? "#FEF2F2"
                                            : "#FFFBEB",
                                },
                            ]}
                        >
                            <Typography
                                variant="h2"
                                style={
                                    zoneStatus !== "Sûr" && {
                                        color:
                                            zoneStatus === "Danger"
                                                ? "#EF4444"
                                                : "#F59E0B",
                                    }
                                }
                            >
                                {zoneStatus}
                            </Typography>
                            <Typography variant="caption" align="center">
                                Zone Locale
                            </Typography>
                        </Card>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    scrollContent: { padding: Theme.spacing.lg },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Theme.spacing.xl,
        marginTop: Theme.spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    avatarImg: { width: "100%", height: "100%" },
    section: { marginBottom: Theme.spacing.xl },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Theme.spacing.md,
    },
    sectionTitle: { marginBottom: Theme.spacing.md },
    actionGrid: { flexDirection: "row", justifyContent: "space-between" },
    actionCard: { width: "30%", alignItems: "center" },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Theme.spacing.sm,
    },
    exposureSummary: {
        padding: Theme.spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    exposureItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    exposureInfo: { flex: 1 },
    riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    insightGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    insightCard: {
        flex: 1,
        height: 110,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 20,
        padding: 10,
        borderWidth: 0,
    },
});
