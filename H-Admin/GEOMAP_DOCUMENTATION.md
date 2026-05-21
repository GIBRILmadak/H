# GeoMap Component - Documentation

## Aperçu

Le composant `GeoMap` est un composant React/TypeScript robuste pour gérer les zones de traitement et les zones de danger/suspicion géographiquement ancrées. Il résout complètement le bug de zoom en utilisant des `Markers` et `Circle` réels de react-leaflet qui sont synchronisés avec les coordonnées terrestres.

## Caractéristiques Principales

### 1. **Ancrage Géographique Réel (Résolution du Bug de Zoom)**

- ✅ Centres de traitement = `<Marker>` react-leaflet ancrés aux coordonnées [lat, lng]
- ✅ Zones rouges/oranges = `<Circle>` react-leaflet avec rayon en mètres
- ✅ Les cercles se dimensionnent et se déplacent dynamiquement avec le zoom
- ✅ Tous les objets restent ancrés au sol (pas de freeze au zoom)

### 2. **Mode Édition Visuel**

- 🔵 **[Placer Centre]** : Cliquez sur la carte pour ajouter un centre de traitement
- 🔴 **[Zone Rouge]** : Cliquez sur la carte pour créer une zone de danger (Rayon ajustable)
- 🟠 **[Zone Orange]** : Cliquez sur la carte pour créer une zone suspecte (Rayon ajustable)
- ❌ **[Annuler]** : Quitter le mode édition

### 3. **Export de Données**

- 📥 **Exporter JSON** : Télécharge un fichier GeoJSON localement
- 🌐 **Envoyer Backend** : Envoie les données au backend FastAPI
- 💾 Sauvegarde automatique dans localStorage

## Installation et Utilisation

### 1. **Importer le composant**

```tsx
import GeoMap from "./components/GeoMap";
```

### 2. **Utilisation Basique**

```tsx
<GeoMap />
```

### 3. **Utilisation Avancée avec Export**

```tsx
import GeoMap from "./components/GeoMap";
import { loadFromLocalStorage, saveToLocalStorage } from "./lib/geoUtils";

function MapView() {
    const handleDataExport = (data) => {
        console.log("Données exportées:", data);
        saveToLocalStorage(data);
    };

    return (
        <div className="h-full">
            <GeoMap
                onDataExport={handleDataExport}
                initialData={loadFromLocalStorage()}
                apiEndpoint="http://localhost:8000/api/map-zones"
            />
        </div>
    );
}
```

## Props du Composant

| Prop           | Type                          | Description                           | Optionnel |
| -------------- | ----------------------------- | ------------------------------------- | --------- |
| `onDataExport` | `(data: MapEntity[]) => void` | Callback appelé à chaque modification | ✅        |
| `initialData`  | `MapEntity[]`                 | Données initiales à charger           | ✅        |
| `apiEndpoint`  | `string`                      | URL du backend FastAPI                | ✅        |

## Types TypeScript

### `TreatmentCenter`

```tsx
{
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: "center";
}
```

### `DangerZone`

```tsx
{
    id: string;
    name: string;
    lat: number;
    lng: number;
    radius: number; // en mètres
    type: "red_zone" | "orange_zone";
}
```

### `GeoJSONFeature` (Exporte)

```tsx
{
  type: 'Feature';
  geometry: {
    type: 'Point' | 'Circle';
    coordinates: [number, number]; // [lng, lat] en GeoJSON standard
    radius?: number;
  };
  properties: {
    name: string;
    type: string;
    radius?: number;
  };
}
```

## Format d'Export GeoJSON

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [15.307, -4.3224]
            },
            "properties": {
                "name": "Centre Bunia",
                "type": "treatment_center"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Circle",
                "coordinates": [15.307, -4.3224],
                "radius": 500
            },
            "properties": {
                "name": "Zone Danger - Bombole",
                "type": "danger_zone",
                "radius": 500
            }
        }
    ],
    "metadata": {
        "exported_at": "2024-05-21T10:30:00.000Z",
        "center": [-4.3224, 15.307],
        "count": 2
    }
}
```

## Intégration Backend FastAPI

### Endpoint Recommandé

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: tuple
    radius: Optional[int] = None

class GeoJSONProperty(BaseModel):
    name: str
    type: str
    radius: Optional[int] = None

class GeoJSONFeature(BaseModel):
    type: str
    geometry: GeoJSONGeometry
    properties: GeoJSONProperty

class GeoJSONFeatureCollection(BaseModel):
    type: str
    features: List[GeoJSONFeature]
    metadata: dict

@app.post("/api/map-zones")
async def save_map_zones(data: GeoJSONFeatureCollection):
    """
    Sauvegarder les zones géographiques du dashboard médical
    """
    try:
        # Traitement des données
        for feature in data.features:
            if feature.properties.type == 'treatment_center':
                # Sauvegarder centre
                print(f"Centre: {feature.properties.name}")
            elif feature.properties.type == 'danger_zone':
                # Sauvegarder zone rouge
                print(f"Zone Danger: {feature.properties.name} - {feature.geometry.radius}m")
            elif feature.properties.type == 'suspect_zone':
                # Sauvegarder zone orange
                print(f"Zone Suspect: {feature.properties.name} - {feature.geometry.radius}m")

        return {
            "success": True,
            "message": f"{len(data.features)} zones sauvegardées",
            "timestamp": data.metadata.get("exported_at")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Utilitaires (geoUtils.ts)

### `sendToBackendAPI(features, apiEndpoint)`

Envoie les données au backend avec gestion d'erreur.

```tsx
import { sendToBackendAPI } from "./lib/geoUtils";

const result = await sendToBackendAPI(
    features,
    "http://localhost:8000/api/map-zones",
);
if (result.success) {
    console.log(result.message);
}
```

### `downloadGeoJSON(features)`

Télécharge un fichier GeoJSON localement.

```tsx
import { downloadGeoJSON } from "./lib/geoUtils";

downloadGeoJSON(features);
// Crée: zones-sanitaires-2024-05-21.geojson
```

### `saveToLocalStorage(data, key?)`

Sauvegarde dans le localStorage du navigateur.

```tsx
import { saveToLocalStorage } from "./lib/geoUtils";

saveToLocalStorage(mapData, "my_zones");
```

### `loadFromLocalStorage(key?)`

Charge les données du localStorage.

```tsx
import { loadFromLocalStorage } from "./lib/geoUtils";

const data = loadFromLocalStorage("my_zones");
```

## Architecture et Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                       App.jsx                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              MapView Component                      │    │
│  │                                                     │    │
│  │  const [data, setData] = useState(...)             │    │
│  │  const handleExport = (data) => {                  │    │
│  │    saveToLocalStorage(data)                        │    │
│  │  }                                                  │    │
│  │                                                     │    │
│  │  <GeoMap                                           │    │
│  │    onDataExport={handleExport}                    │    │
│  │    initialData={loadFromLocalStorage()}           │    │
│  │    apiEndpoint="http://..."                       │    │
│  │  />                                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          GeoMap.tsx Component                       │    │
│  │                                                     │    │
│  │  - Gestion des clics sur la carte                  │    │
│  │  - Rendu des Markers & Circles                     │    │
│  │  - Mode édition (3 boutons)                        │    │
│  │  - Panel latéral avec liste                        │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │  MapClickHandler                             │  │    │
│  │  │  (useMapEvents hook)                         │  │    │
│  │  │  Émet: onLocationSelect(latlng)              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                     │    │
│  │  Exports:                                           │    │
│  │  - exportGeoJSON() ────┐                            │    │
│  │  - sendToBackend() ─────┤─── GeoJSON Format        │    │
│  │  - handleDownload() ────┘                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        localStorage          Backend API
        (geoUtils.ts)      (sendToBackendAPI)
                                     │
                                     ▼
                              FastAPI Server
```

## Exemple Complet d'Intégration

### Frontend (H-Admin/src/pages/MapView.tsx)

```tsx
import React from "react";
import GeoMap from "../components/GeoMap";
import { loadFromLocalStorage, saveToLocalStorage } from "../lib/geoUtils";

export function MapView() {
    const handleDataExport = (data) => {
        // Sauvegarder en localStorage
        saveToLocalStorage(data);
        console.log(`${data.length} zones sauvegardées`);
    };

    return (
        <div className="h-full">
            <GeoMap
                onDataExport={handleDataExport}
                initialData={loadFromLocalStorage()}
                apiEndpoint={
                    process.env.REACT_APP_API_URL ||
                    "http://localhost:8000/api/map-zones"
                }
            />
        </div>
    );
}
```

### Backend (FastAPI - main.py)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

app = FastAPI()

# CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MapZonesRequest(BaseModel):
    type: str
    features: List[dict]
    metadata: dict

@app.post("/api/map-zones")
async def save_map_zones(data: MapZonesRequest):
    """
    Endpoint pour sauvegarder les zones géographiques
    """
    try:
        timestamp = datetime.now().isoformat()

        # Exemple: Sauvegarder en fichier JSON
        with open(f'zones_{timestamp.replace(":", "-")}.json', 'w') as f:
            json.dump(data.dict(), f, indent=2)

        return {
            "success": True,
            "message": f"{len(data.features)} zones sauvegardées",
            "timestamp": timestamp,
            "features_count": len(data.features)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Notes Importantes

1. **Coordonnées**:
    - Frontend utilise [lat, lng]
    - GeoJSON utilise [lng, lat] (standard GeoJSON)
    - Le composant gère la conversion automatiquement

2. **Rayon des Cercles**:
    - En mètres (1 rayon = 1 mètre)
    - S'adapte dynamiquement au zoom
    - Les calculs Leaflet gèrent la projection

3. **Performance**:
    - Optimisé pour jusqu'à 500+ marqueurs/zones
    - Pagination recommandée pour très grandes quantités

4. **Persistance**:
    - localStorage pour le stockage local (max ~5MB)
    - Backend pour persistance à long terme

## Dépannage

### Problème: Les cercles ne changent pas de taille au zoom

**Solution**: Vérifier que le composant `<Circle>` reçoit bien le rayon en mètres

### Problème: Les données ne s'exportent pas

**Solution**: Vérifier que le backend accepte les requêtes CORS

### Problème: L'API endpoint ne répond pas

**Solution**: Vérifier que l'URL est correcte et le serveur est lancé

## Support et Améliorations Futures

- [ ] Support du dessin de polygones libres
- [ ] Import depuis un fichier GeoJSON
- [ ] Affichage de la distance/rayon en temps réel
- [ ] Recherche/filtrage des zones
- [ ] Historique des modifications
- [ ] Collaboration en temps réel (WebSocket)

---

**Version**: 1.0.0
**Dernière mise à jour**: 21 mai 2024
**Créé pour**: H - Système de Biosécurité RDC
