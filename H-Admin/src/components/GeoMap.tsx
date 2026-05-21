import React, { useState, useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMapEvents,
    Popup,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { Trash2, Plus, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Types
interface Center {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

interface Zone {
    id: string;
    name: string;
    type: "red" | "orange";
    lat: number;
    lng: number;
    radius: number;
}

interface MapClickHandlerProps {
    editMode: string | null;
    onLocationSelect: (latlng: LatLngExpression) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
    editMode,
    onLocationSelect,
}) => {
    useMapEvents({
        click(e) {
            if (!editMode) return;
            onLocationSelect([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
};

export const GeoMap: React.FC<{ apiEndpoint?: string }> = ({ apiEndpoint }) => {
    const [centers, setCenters] = useState<Center[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [previewLatlng, setPreviewLatlng] = useState<LatLngExpression | null>(
        null,
    );
    const [formData, setFormData] = useState({ name: "", radius: "500" });
    const [currentLocation, setCurrentLocation] = useState<LatLngExpression>([
        -4.3224, 15.307,
    ]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    const DEFAULT_ZOOM = 12;

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]);
                    setIsLoadingLocation(false);
                },
                () => {
                    setIsLoadingLocation(false);
                },
                { timeout: 10000, maximumAge: 300000 },
            );
        } else {
            setIsLoadingLocation(false);
        }
    }, []);

    const addCenter = (latlng: LatLngExpression) => {
        if (!formData.name.trim()) {
            alert("Veuillez entrer un nom");
            return;
        }
        setCenters([
            ...centers,
            {
                id: `${Date.now()}-${Math.random()}`,
                name: formData.name,
                lat: latlng[0],
                lng: latlng[1],
            },
        ]);
        resetForm();
    };

    const addZone = (latlng: LatLngExpression) => {
        if (!formData.name.trim()) {
            alert("Veuillez entrer un nom");
            return;
        }
        setZones([
            ...zones,
            {
                id: `${Date.now()}-${Math.random()}`,
                name: formData.name,
                type: (editMode === "red_zone" ? "red" : "orange") as
                    | "red"
                    | "orange",
                lat: latlng[0],
                lng: latlng[1],
                radius: parseInt(formData.radius) || 500,
            },
        ]);
        resetForm();
    };

    const handleLocationSelect = (latlng: LatLngExpression) => {
        setPreviewLatlng(latlng);
    };

    const handleSubmitForm = () => {
        if (!previewLatlng) return;
        if (editMode === "center") {
            addCenter(previewLatlng);
        } else if (editMode === "red_zone" || editMode === "orange_zone") {
            addZone(previewLatlng);
        }
    };

    const updateCenterName = (id: string, newName: string) => {
        setCenters(
            centers.map((c) => (c.id === id ? { ...c, name: newName } : c)),
        );
    };

    const updateZoneName = (id: string, newName: string) => {
        setZones(zones.map((z) => (z.id === id ? { ...z, name: newName } : z)));
    };

    const deleteCenter = (id: string) => {
        setCenters(centers.filter((c) => c.id !== id));
    };

    const deleteZone = (id: string) => {
        setZones(zones.filter((z) => z.id !== id));
    };

    const resetForm = () => {
        setEditMode(null);
        setPreviewLatlng(null);
        setFormData({ name: "", radius: "500" });
    };

    const handleExport = () => {
        const payload = { centers, zones, timestamp: new Date().toISOString() };
        console.log("📤 Données à exporter:", payload);

        if (apiEndpoint) {
            fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => console.log("✅ Backend response:", data))
                .catch((err) => console.error("❌ Erreur export:", err));
        }

        alert(`✓ Enregistré: ${centers.length} centres, ${zones.length} zones`);
    };

    return (
        <div className="flex flex-col h-full gap-3">
            {/* TOOLBAR */}
            <div className="bg-white p-3 rounded border border-gray-300 flex justify-between items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setEditMode("center")}
                        className={`px-3 py-2 text-xs font-bold rounded ${
                            editMode === "center"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-50 text-blue-600"
                        }`}
                    >
                        <Plus size={12} className="inline mr-1" />
                        Placer Centre
                    </button>
                    <button
                        onClick={() => setEditMode("red_zone")}
                        className={`px-3 py-2 text-xs font-bold rounded ${
                            editMode === "red_zone"
                                ? "bg-red-600 text-white"
                                : "bg-red-50 text-red-600"
                        }`}
                    >
                        <Plus size={12} className="inline mr-1" />
                        Zone Rouge
                    </button>
                    <button
                        onClick={() => setEditMode("orange_zone")}
                        className={`px-3 py-2 text-xs font-bold rounded ${
                            editMode === "orange_zone"
                                ? "bg-orange-600 text-white"
                                : "bg-orange-50 text-orange-600"
                        }`}
                    >
                        <Plus size={12} className="inline mr-1" />
                        Zone Orange
                    </button>
                    {editMode && (
                        <button
                            onClick={resetForm}
                            className="px-3 py-2 text-xs font-bold rounded bg-gray-200 text-gray-700"
                        >
                            <X size={12} className="inline mr-1" />
                            Annuler
                        </button>
                    )}
                </div>

                <button
                    onClick={handleExport}
                    className="px-4 py-2 text-xs font-bold rounded bg-green-600 text-white hover:bg-green-700"
                >
                    Enregistrer les modifications
                </button>
            </div>

            {/* GRID: Carte + Infos */}
            <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
                {/* CARTE */}
                <div className="col-span-2 bg-white rounded border border-gray-300 overflow-hidden relative">
                    {isLoadingLocation && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                            <p className="text-sm text-gray-700">
                                📍 Localisation...
                            </p>
                        </div>
                    )}

                    <MapContainer
                        center={currentLocation}
                        zoom={DEFAULT_ZOOM}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap"
                        />

                        <MapClickHandler
                            editMode={editMode}
                            onLocationSelect={handleLocationSelect}
                        />

                        {/* APERÇU du marqueur */}
                        {previewLatlng && editMode && (
                            <Marker position={previewLatlng} />
                        )}

                        {/* CENTRES */}
                        {centers.map((center) => (
                            <Marker
                                key={center.id}
                                position={[center.lat, center.lng]}
                            >
                                <Popup>
                                    <div className="w-40 text-xs">
                                        <p className="font-bold mb-1">Centre</p>
                                        <input
                                            type="text"
                                            value={center.name}
                                            onChange={(e) =>
                                                updateCenterName(
                                                    center.id,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-1 py-1 border border-gray-300 rounded mb-1 text-xs"
                                            placeholder="Nom"
                                        />
                                        <p className="text-gray-400 text-[10px] mb-2">
                                            {center.lat.toFixed(4)},{" "}
                                            {center.lng.toFixed(4)}
                                        </p>
                                        <button
                                            onClick={() =>
                                                deleteCenter(center.id)
                                            }
                                            className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                                        >
                                            <Trash2
                                                size={10}
                                                className="inline mr-1"
                                            />
                                            Supprimer
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* ZONES */}
                        {zones.map((zone) => (
                            <Circle
                                key={zone.id}
                                center={[zone.lat, zone.lng]}
                                radius={zone.radius}
                                pathOptions={{
                                    color:
                                        zone.type === "red"
                                            ? "#dc2626"
                                            : "#ea580c",
                                    fillColor:
                                        zone.type === "red"
                                            ? "#fca5a5"
                                            : "#fed7aa",
                                    fillOpacity: 0.3,
                                    weight: 2,
                                }}
                            >
                                <Popup>
                                    <div className="w-40 text-xs">
                                        <p className="font-bold mb-1">
                                            {zone.type === "red"
                                                ? "Zone Danger"
                                                : "Zone Suspecte"}
                                        </p>
                                        <input
                                            type="text"
                                            value={zone.name}
                                            onChange={(e) =>
                                                updateZoneName(
                                                    zone.id,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-1 py-1 border border-gray-300 rounded mb-1 text-xs"
                                            placeholder="Nom"
                                        />
                                        <p className="text-gray-400 text-[10px] mb-1">
                                            {zone.lat.toFixed(4)},{" "}
                                            {zone.lng.toFixed(4)}
                                        </p>
                                        <p className="text-gray-400 text-[10px] mb-2">
                                            Rayon: {zone.radius}m
                                        </p>
                                        <button
                                            onClick={() => deleteZone(zone.id)}
                                            className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                                        >
                                            <Trash2
                                                size={10}
                                                className="inline mr-1"
                                            />
                                            Supprimer
                                        </button>
                                    </div>
                                </Popup>
                            </Circle>
                        ))}
                    </MapContainer>
                </div>

                {/* PANNEAU DROITE */}
                <div className="bg-white rounded border border-gray-300 p-3 overflow-y-auto flex flex-col">
                    {/* FORMULAIRE */}
                    {editMode && previewLatlng && (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                            <h3 className="font-bold text-xs mb-2 uppercase">
                                Ajouter élément
                            </h3>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nom..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2"
                                autoFocus
                            />
                            {(editMode === "red_zone" ||
                                editMode === "orange_zone") && (
                                <input
                                    type="number"
                                    value={formData.radius}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            radius: e.target.value,
                                        })
                                    }
                                    placeholder="Rayon (m)"
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-2"
                                />
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSubmitForm}
                                    className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs font-bold"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LISTES */}
                    {centers.length > 0 && (
                        <div className="mb-3">
                            <h4 className="font-bold text-xs uppercase mb-1 text-gray-600">
                                Centres ({centers.length})
                            </h4>
                            <div className="space-y-1">
                                {centers.map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-1 bg-blue-50 border border-blue-200 rounded text-xs"
                                    >
                                        <p className="font-bold">{c.name}</p>
                                        <p className="text-gray-500 text-[10px]">
                                            {c.lat.toFixed(4)},{" "}
                                            {c.lng.toFixed(4)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {zones.length > 0 && (
                        <div>
                            <h4 className="font-bold text-xs uppercase mb-1 text-gray-600">
                                Zones ({zones.length})
                            </h4>
                            <div className="space-y-1">
                                {zones.map((z) => (
                                    <div
                                        key={z.id}
                                        className={`p-1 rounded text-xs border ${
                                            z.type === "red"
                                                ? "bg-red-50 border-red-200"
                                                : "bg-orange-50 border-orange-200"
                                        }`}
                                    >
                                        <p className="font-bold">{z.name}</p>
                                        <p className="text-gray-500 text-[10px]">
                                            {z.lat.toFixed(4)},{" "}
                                            {z.lng.toFixed(4)}
                                        </p>
                                        <p className="text-gray-500 text-[10px]">
                                            Rayon: {z.radius}m
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {centers.length === 0 &&
                        zones.length === 0 &&
                        !editMode && (
                            <p className="text-xs text-gray-400 text-center py-4">
                                Aucun élément
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
};

export default GeoMap;
