import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSensorsWrapper } from "@/hooks/useSensorsWrapper";

const MOVEMENT_THRESHOLD = 1.2; // Sensibilité du mouvement
const PROXIMITY_REQUIRED_TIME = 1 * 60 * 1000; // Réduit à 1 minute en ms

export function useTracing() {
    const { user, addContact } = useAppStore();
    const [isMoving, setIsMoving] = useState(false);
    const proximityTimer = useRef<NodeJS.Timeout | null>(null);
    const lastUpdate = useRef(Date.now());
    const { subscribeToAccelerometer } = useSensorsWrapper();

    useEffect(() => {
        // 1. Surveillance de l'accéléromètre avec wrapper
        const unsubscribe = subscribeToAccelerometer((data) => {
            const acceleration = Math.sqrt(
                data.x ** 2 + data.y ** 2 + data.z ** 2,
            );

            if (acceleration > MOVEMENT_THRESHOLD) {
                if (!isMoving) setIsMoving(true);
                lastUpdate.current = Date.now();
            } else {
                // Si pas de mouvement pendant 10s, on considère à l'arrêt
                if (Date.now() - lastUpdate.current > 10000) {
                    setIsMoving(false);
                }
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isMoving]);

    useEffect(() => {
        // 2. Logique de détection de proximité (Simulation pour PWA)
        // On active la simulation de proximité uniquement si on détecte un mouvement
        if (isMoving) {
            console.log("Mouvement détecté, recherche de contacts...");

            // On lance un timer de 5 minutes
            proximityTimer.current = setTimeout(() => {
                // Simulation d'un échange d'ID après 5 min de mouvement/proximité
                const mockNearbyId =
                    "ZR" + Math.floor(1000 + Math.random() * 9000);
                console.log("Contact prolongé détecté avec :", mockNearbyId);
                addContact(mockNearbyId, 5);
            }, PROXIMITY_REQUIRED_TIME);
        } else {
            if (proximityTimer.current) {
                clearTimeout(proximityTimer.current);
            }
        }

        return () => {
            if (proximityTimer.current) clearTimeout(proximityTimer.current);
        };
    }, [isMoving]);

    return { isMoving };
}
