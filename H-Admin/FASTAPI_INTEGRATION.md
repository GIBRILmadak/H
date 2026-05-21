# 🔌 GeoMap - Intégration Backend FastAPI

## 📡 Flux de Données

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│  GeoMap React   │ POST    │  FastAPI     │         │  Database   │
│                 ├────────>│  Endpoint    ├────────>│  (MongoDB)  │
│  "Enregistrer   │ JSON    │  /geodata    │ INSERT  │             │
│   les modif"    │         │  (webhook)   │         │             │
└─────────────────┘         └──────────────┘         └─────────────┘

Payload JSON envoyé:
{
  "centers": [
    { "id": "1234", "name": "Centre A", "lat": -4.32, "lng": 15.30 }
  ],
  "zones": [
    { "id": "5678", "name": "Zone Rouge", "type": "red",
      "lat": -4.31, "lng": 15.31, "radius": 2000 }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🚀 Configuration Frontend (React)

### Option 1: Sans Backend (Console Only)

```typescript
<GeoMap />  // Aucun endpoint
// Les données vont uniquement dans la console
```

### Option 2: Avec Backend (FastAPI)

```typescript
<GeoMap apiEndpoint="https://api.example.com/geodata" />
// Cliquer sur "Enregistrer les modifications" envoie les données
```

---

## 🎯 Exemple Backend FastAPI

### Installation

```bash
pip install fastapi uvicorn pymongo
```

### Code Minimal

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List

app = FastAPI()

class Center(BaseModel):
    id: str
    name: str
    lat: float
    lng: float

class Zone(BaseModel):
    id: str
    name: str
    type: str  # "red" or "orange"
    lat: float
    lng: float
    radius: int

class GeoData(BaseModel):
    centers: List[Center]
    zones: List[Zone]
    timestamp: str

@app.post("/geodata")
async def receive_geodata(data: GeoData):
    """
    Reçoit les données géographiques de GeoMap React
    """
    try:
        # Exemple: Afficher les données
        print(f"✅ Données reçues à {data.timestamp}")
        print(f"   - {len(data.centers)} centres")
        print(f"   - {len(data.zones)} zones")

        # TODO: Insérer dans MongoDB
        # db.geo_data.insert_one({
        #     "centers": [c.dict() for c in data.centers],
        #     "zones": [z.dict() for z in data.zones],
        #     "created_at": datetime.fromisoformat(data.timestamp)
        # })

        return {
            "success": True,
            "message": f"Données reçues: {len(data.centers)} centres, {len(data.zones)} zones"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Démarrage

```bash
python app.py
# ➜ http://localhost:8000
```

---

## 🔐 CORS Configuration (Important!)

Si le backend et le frontend ne sont pas sur le même domaine:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Schéma MongoDB

```javascript
// Collection: geo_data
db.createCollection("geo_data")

// Index pour les recherches rapides
db.geo_data.createIndex({ "created_at": -1 })
db.geo_data.createIndex({ "centers.id": 1 })

// Exemple de document
{
  "_id": ObjectId("..."),
  "timestamp": "2024-01-15T10:30:00.000Z",
  "centers": [
    {
      "id": "1234-5678",
      "name": "Hôpital Central Bunia",
      "lat": -4.3224,
      "lng": 15.3071
    }
  ],
  "zones": [
    {
      "id": "9876-5432",
      "name": "Zone Épidémie Bunia",
      "type": "red",
      "lat": -4.32,
      "lng": 15.30,
      "radius": 2000
    },
    {
      "id": "4567-8901",
      "name": "Zone Suspecte Beni",
      "type": "orange",
      "lat": -4.28,
      "lng": 15.25,
      "radius": 1500
    }
  ],
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔍 Interrogation des Données

### Récupérer Tous les Centres

```python
@app.get("/centers")
async def get_centers():
    latest = db.geo_data.find_one(sort=[("created_at", -1)])
    return {"centers": latest["centers"] if latest else []}
```

### Récupérer les Zones par Type

```python
@app.get("/zones/{zone_type}")
async def get_zones_by_type(zone_type: str):  # "red" or "orange"
    latest = db.geo_data.find_one(sort=[("created_at", -1)])
    zones = [z for z in latest["zones"] if z["type"] == zone_type]
    return {"zones": zones}
```

### Calculer la Distance (Haversine)

```python
import math

def haversine_distance(lat1, lng1, lat2, lng2):
    """Distance en mètres entre deux points"""
    R = 6371000  # Rayon Terre en mètres
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)

    a = math.sin(delta_phi/2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@app.post("/check-in-zone")
async def check_point_in_zone(lat: float, lng: float, zone_id: str):
    """Vérifie si un point (lat,lng) est dans une zone"""
    latest = db.geo_data.find_one(sort=[("created_at", -1)])

    for zone in latest["zones"]:
        if zone["id"] == zone_id:
            distance = haversine_distance(lat, lng, zone["lat"], zone["lng"])
            in_zone = distance <= zone["radius"]
            return {
                "in_zone": in_zone,
                "distance": round(distance, 2),
                "radius": zone["radius"],
                "zone_name": zone["name"]
            }

    raise HTTPException(status_code=404, detail="Zone non trouvée")
```

---

## 🧪 Test avec curl

```bash
# Test POST (envoyer des données)
curl -X POST http://localhost:8000/geodata \
  -H "Content-Type: application/json" \
  -d '{
    "centers": [
      {"id": "1", "name": "Test", "lat": -4.32, "lng": 15.30}
    ],
    "zones": [],
    "timestamp": "2024-01-15T10:30:00Z"
  }'

# Test GET (récupérer les centres)
curl http://localhost:8000/centers

# Test Check-In
curl -X POST "http://localhost:8000/check-in-zone?lat=-4.32&lng=15.30&zone_id=9876-5432"
```

---

## ✅ Checklist Intégration

- [ ] Backend FastAPI lancé sur http://localhost:8000
- [ ] CORS configuré pour http://localhost:3001
- [ ] Endpoint POST `/geodata` opérationnel
- [ ] MongoDB connectée et collection créée
- [ ] GeoMap configurée avec `apiEndpoint="http://localhost:8000/geodata"`
- [ ] Console affiche les logs du backend
- [ ] Test: Cliquer "Enregistrer les modifications" → Données dans MongoDB
- [ ] Test: Récupérer `/centers` → Les données s'affichent

---

## 🚨 Dépannage

### Erreur: "Failed to fetch"

```
→ Vérifier CORS dans FastAPI
→ Vérifier que le backend écoute sur 0.0.0.0:8000
```

### Erreur: "Connection refused"

```
→ Le backend n'est pas lancé
→ Lancer: python app.py
```

### Erreur: "Invalid JSON"

```
→ Vérifier le format du payload React
→ Vérifier les types (lat/lng doivent être float)
```

---

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Python Driver](https://pymongo.readthedocs.io/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [GeoJSON Spec](https://geojson.org/)
