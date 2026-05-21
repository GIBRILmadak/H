import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
    Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { useLocationWrapper } from "@/hooks/useLocationWrapper";

const { width } = Dimensions.get("window");

export default function MapScreen() {
    const [location, setLocation] = useState<any | null>(null);
    const [mapUrl, setMapUrl] = useState<string>("");
    const [entities, setEntities] = useState<any[]>([]);
    const { requestPermission, getCurrentPosition } = useLocationWrapper();

    useEffect(() => {
        fetchEntities();
        const sub = supabase
            .channel("map-entities-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "map_entities" },
                fetchEntities,
            )
            .subscribe();

        (async () => {
            const { status } = await requestPermission();
            if (status !== "granted") {
                updateMapUrl(-4.3224, 15.307);
                return;
            }
            try {
                const userLocation = await getCurrentPosition();
                setLocation(userLocation);
                updateMapUrl(
                    userLocation.coords.latitude,
                    userLocation.coords.longitude,
                );
            } catch (error) {
                console.error("Error getting position:", error);
                updateMapUrl(-4.3224, 15.307);
            }
        })();

        return () => {
            supabase.removeChannel(sub);
        };
    }, []);

    const fetchEntities = async () => {
        const { data } = await supabase.from("map_entities").select("*");
        if (data) setEntities(data);
    };

    const updateMapUrl = (lat: number, lon: number) => {
        const delta = 0.05;
        const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
        const marker = `${lat}%2C${lon}`;
        setMapUrl(
            `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`,
        );
    };

    const handleGetDirections = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    const hospitals = entities.filter((e) => e.type === "center");

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {Platform.OS === "web" && mapUrl ? (
                    <>
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            src={mapUrl}
                            style={{ border: 0 }}
                        />
                        {entities.map((e) => (
                            <View
                                key={e.id}
                                style={[
                                    styles.mapOverlayEntity,
                                    {
                                        top: "50%",
                                        left: "50%",
                                        transform: [
                                            {
                                                translateX:
                                                    (e.lng -
                                                        (location?.coords
                                                            .longitude ||
                                                            15.307)) *
                                                    5000,
                                            },
                                            {
                                                translateY:
                                                    (e.lat -
                                                        (location?.coords
                                                            .latitude ||
                                                            -4.3224)) *
                                                    -5000,
                                            },
                                        ],
                                    },
                                ]}
                            >
                                {e.type === "red_zone" && (
                                    <View style={styles.redZoneCircle} />
                                )}
                                {e.type === "orange_zone" && (
                                    <View style={styles.orangeZoneCircle} />
                                )}
                                {e.type === "center" && (
                                    <View style={styles.centerMarker}>
                                        <Ionicons
                                            name="medkit"
                                            size={14}
                                            color="#FFFFFF"
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Typography variant="body">
                            Initialisation de la carte sécurisée...
                        </Typography>
                    </View>
                )}
            </View>

            <SafeAreaView style={styles.overlay} pointerEvents="box-none">
                <View style={styles.header}>
                    <View style={styles.searchBar}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#9CA3AF"
                            style={{ marginRight: 10 }}
                        />
                        <Typography variant="body" color="#9CA3AF">
                            Rechercher...
                        </Typography>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={async () => {
                                let userLocation =
                                    await Location.getCurrentPositionAsync({});
                                updateMapUrl(
                                    userLocation.coords.latitude,
                                    userLocation.coords.longitude,
                                );
                            }}
                        >
                            <Ionicons name="navigate" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <Typography variant="h3" style={styles.listTitle}>
                        Centres de traitement (CTEB)
                    </Typography>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.hospitalList}
                    >
                        {hospitals.map((hosp) => (
                            <Card key={hosp.id} style={styles.hospitalCard}>
                                <View style={styles.hospHeader}>
                                    <Typography
                                        variant="bodyMedium"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {hosp.name}
                                    </Typography>
                                </View>
                                <TouchableOpacity
                                    style={styles.directionsBtn}
                                    onPress={() =>
                                        handleGetDirections(hosp.lat, hosp.lng)
                                    }
                                >
                                    <Typography variant="label" color="#FFFFFF">
                                        S'Y RENDRE
                                    </Typography>
                                </TouchableOpacity>
                            </Card>
                        ))}
                        {hospitals.length === 0 && (
                            <Typography
                                variant="caption"
                                style={{ color: "#9CA3AF", marginLeft: 20 }}
                            >
                                Aucun centre répertorié pour le moment.
                            </Typography>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#E5E7EB",
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
    },
    overlay: { flex: 1, justifyContent: "space-between" },
    header: { padding: 20 },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        height: 54,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingHorizontal: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    bottomSection: { paddingBottom: 110 },
    listTitle: { paddingHorizontal: 20, marginBottom: 12 },
    controls: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    hospitalList: { paddingHorizontal: 20, gap: 16 },
    hospitalCard: {
        width: 220,
        padding: 16,
        borderRadius: 24,
        borderWidth: 0,
        elevation: 4,
    },
    hospHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    directionsBtn: {
        backgroundColor: "#000000",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    mapOverlayEntity: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    redZoneCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderWidth: 2,
        borderColor: "#EF4444",
    },
    orangeZoneCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderWidth: 2,
        borderColor: "#F59E0B",
    },
    centerMarker: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        elevation: 5,
    },
});
