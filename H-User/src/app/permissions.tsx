import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    Platform,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useLocationWrapper } from "@/hooks/useLocationWrapper";
import { useNotificationsWrapper } from "@/hooks/useNotificationsWrapper";
import { useSensorsWrapper } from "@/hooks/useSensorsWrapper";

const PERMISSIONS = [
    {
        id: "bluetooth",
        title: "Bluetooth (Web Bluetooth)",
        description:
            "Permet de détecter les appareils à proximité via votre navigateur (Chrome recommandé).",
        icon: "bluetooth-outline",
    },
    {
        id: "location",
        title: "Localisation",
        description:
            "Utilisée pour vous alerter si vous entrez dans une zone à risque.",
        icon: "location-outline",
    },
    {
        id: "sensors",
        title: "Mouvements & Orientation",
        description:
            "Utilise les capteurs de votre téléphone pour une meilleure précision.",
        icon: "speedometer-outline",
    },
    {
        id: "notifications",
        title: "Notifications Web",
        description:
            "Pour recevoir des alertes même quand l'onglet est fermé (PWA).",
        icon: "notifications-outline",
    },
];

export default function PermissionsScreen() {
    const router = useRouter();
    const { setHasSeenOnboarding } = useAppStore();
    const [loading, setLoading] = useState(false);
    const { requestPermission: requestLocation } = useLocationWrapper();
    const { requestPermission: requestNotifications } =
        useNotificationsWrapper();
    const { requestDeviceMotionPermission } = useSensorsWrapper();

    const handleRequestAll = async () => {
        setLoading(true);
        try {
            // Demander les permissions via les wrappers
            await Promise.all([
                requestLocation().catch(() => {}),
                requestNotifications().catch(() => {}),
                requestDeviceMotionPermission().catch(() => {}),
            ]);

            // Vérifier le support Bluetooth
            if ("bluetooth" in navigator) {
                console.log("Web Bluetooth est supporté");
            }

            setHasSeenOnboarding(true);
            router.replace("/(auth)/welcome");
        } catch (error) {
            console.error("Erreur permissions:", error);
            setHasSeenOnboarding(true);
            router.replace("/(auth)/welcome");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={require("../../medias/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Typography
                        variant="h1"
                        align="center"
                        style={styles.title}
                    >
                        Configuration PWA
                    </Typography>
                    <Typography
                        variant="body"
                        align="center"
                        color={Theme.colors.textSecondary}
                    >
                        "H" fonctionne comme une application web moderne. Pour
                        une protection optimale, autorisez les accès suivants :
                    </Typography>
                </View>

                <View style={styles.permissionsList}>
                    {PERMISSIONS.map((permission) => (
                        <Card key={permission.id} style={styles.permissionCard}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name={permission.icon as any}
                                    size={24}
                                    color={Theme.colors.primary}
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Typography variant="bodyMedium">
                                    {permission.title}
                                </Typography>
                                <Typography variant="caption">
                                    {permission.description}
                                </Typography>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Typography
                        variant="caption"
                        align="center"
                        style={styles.privacyNote}
                    >
                        Astuce : Ajoutez l'app à votre écran d'accueil pour une
                        expérience native.
                    </Typography>
                    <Button
                        label="Activer et Continuer"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        onPress={handleRequestAll}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        padding: Theme.spacing.lg,
        paddingTop: Theme.spacing.xxl,
    },
    header: {
        alignItems: "center",
        marginBottom: Theme.spacing.xxl,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: Theme.spacing.lg,
    },
    title: {
        marginBottom: Theme.spacing.sm,
    },
    permissionsList: {
        gap: Theme.spacing.md,
        marginBottom: Theme.spacing.xl,
    },
    permissionCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: Theme.spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Theme.colors.card,
        justifyContent: "center",
        alignItems: "center",
        marginRight: Theme.spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    footer: {
        gap: Theme.spacing.lg,
        paddingBottom: Theme.spacing.xl,
    },
    privacyNote: {
        color: Theme.colors.textSecondary,
    },
});
