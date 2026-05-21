import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Theme } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    Alert,
} from "react-native";
import { useImagePickerWrapper } from "@/hooks/useImagePickerWrapper";

export default function ProfileScreen() {
    const { user, updateUser, setAuthenticated } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || "Utilisateur Anonyme");
    const { pickImage: pickImageFromLibrary } = useImagePickerWrapper();

    const handlePickImage = async () => {
        try {
            const result = await pickImageFromLibrary();

            if (!result.canceled && result.assets?.[0]?.base64) {
                updateUser({
                    avatar: `data:image/jpeg;base64,${result.assets[0].base64}`,
                });
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Erreur", "Impossible de choisir une image");
        }
    };

    const handleSaveName = () => {
        updateUser({ name: newName });
        setIsEditing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handlePickImage}
                        style={styles.avatarContainer}
                    >
                        {user?.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons
                                    name="person"
                                    size={40}
                                    color="#FFFFFF"
                                />
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={12} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    {isEditing ? (
                        <View style={styles.editNameContainer}>
                            <TextInput
                                style={styles.nameInput}
                                value={newName}
                                onChangeText={setNewName}
                                autoFocus
                                placeholder="Votre nom"
                            />
                            <TouchableOpacity
                                onPress={handleSaveName}
                                style={styles.saveBtn}
                            >
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={Theme.colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => setIsEditing(true)}
                                style={styles.nameContainer}
                            >
                                <Typography variant="h2" style={styles.name}>
                                    {user?.name || "Utilisateur Anonyme"}
                                </Typography>
                                <Ionicons
                                    name="pencil-outline"
                                    size={16}
                                    color={Theme.colors.textSecondary}
                                    style={{ marginLeft: 8 }}
                                />
                            </TouchableOpacity>
                            <View style={styles.idBadgeMini}>
                                <Typography
                                    variant="caption"
                                    color={Theme.colors.primary}
                                    style={{ fontWeight: "bold" }}
                                >
                                    ID: {user?.id || "----"}
                                </Typography>
                            </View>
                        </View>
                    )}

                    <Typography
                        variant="body"
                        color={Theme.colors.textSecondary}
                    >
                        Santé & Protection active (RDC)
                    </Typography>
                </View>

                <View style={styles.section}>
                    <Typography variant="label" style={styles.sectionTitle}>
                        MONITORING
                    </Typography>
                    <Card style={styles.menuCard}>
                        <MenuItem
                            icon={
                                <Ionicons
                                    name="bluetooth-outline"
                                    size={20}
                                    color="#000000"
                                />
                            }
                            label="Bluetooth Exposure"
                            right={
                                <Switch
                                    value={true}
                                    trackColor={{ true: "#000000" }}
                                />
                            }
                        />
                        <MenuItem
                            icon={
                                <Ionicons
                                    name="notifications-outline"
                                    size={20}
                                    color="#000000"
                                />
                            }
                            label="Push Notifications"
                            right={
                                <Switch
                                    value={true}
                                    trackColor={{ true: "#000000" }}
                                />
                            }
                        />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Typography variant="label" style={styles.sectionTitle}>
                        SÉCURITÉ ET DONNÉES
                    </Typography>
                    <Card style={styles.menuCard}>
                        <MenuItem
                            icon={
                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color="#000000"
                                />
                            }
                            label="Effacer l'historique local"
                            color={Theme.colors.danger}
                            onPress={() =>
                                Alert.alert(
                                    "Supprimer",
                                    "Voulez-vous vraiment effacer vos données locales ?",
                                )
                            }
                        />
                        <MenuItem
                            icon={
                                <Ionicons
                                    name="log-out-outline"
                                    size={20}
                                    color={Theme.colors.danger}
                                />
                            }
                            label="Se déconnecter"
                            color={Theme.colors.danger}
                            onPress={() => setAuthenticated(false)}
                            hideChevron
                        />
                    </Card>
                </View>

                <View style={styles.footer}>
                    <Typography variant="caption" align="center">
                        H Version 1.0.0 (RDC PWA)
                    </Typography>
                    <Typography variant="caption" align="center">
                        Designed & Developed by Gibril Mad
                    </Typography>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const MenuItem = ({ icon, label, right, color, onPress, hideChevron }: any) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        disabled={!onPress}
    >
        <View style={styles.menuItemLeft}>
            <View style={styles.menuIcon}>{icon}</View>
            <Typography
                variant="body"
                style={{ color: color || Theme.colors.text }}
            >
                {label}
            </Typography>
        </View>
        {right ||
            (!hideChevron && (
                <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={Theme.colors.border}
                />
            ))}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        padding: Theme.spacing.lg,
    },
    header: {
        alignItems: "center",
        marginTop: Theme.spacing.xl,
        marginBottom: Theme.spacing.xxl,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: Theme.spacing.md,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#000000",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#000000",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0,
    },
    idBadgeMini: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
        marginTop: 4,
        marginBottom: 4,
    },
    editNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.primary,
        minWidth: 150,
        textAlign: "center",
        color: "#000000",
    },
    saveBtn: {
        marginLeft: 10,
    },
    name: {
        marginBottom: 0,
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        color: Theme.colors.textSecondary,
        marginBottom: Theme.spacing.sm,
        marginLeft: Theme.spacing.sm,
    },
    menuCard: {
        padding: 0,
        overflow: "hidden",
        borderRadius: 20,
        elevation: 2,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: Theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuIcon: {
        marginRight: Theme.spacing.md,
    },
    footer: {
        marginTop: Theme.spacing.xl,
        gap: 4,
    },
});
