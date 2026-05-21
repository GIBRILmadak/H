# 🚀 GeoMap Quick Start Guide

## Installation (30 secondes)

```bash
cd H-Admin
npm install  # Déjà fait
npm run dev  # Lancer le serveur
```

Accéder à: `http://localhost:3000` → Onglet "Gestion des Zones"

---

## Utilisation Basique (1 minute)

### 1. **Placer un Centre de Traitement**

```
1. Cliquez sur [Placer Centre]
2. Cliquez n'importe où sur la carte
3. Entrez le nom (ex: "Centre Bunia")
4. Cliquez [Ajouter]
```

### 2. **Créer une Zone Rouge (Danger)**

```
1. Cliquez sur [Zone Rouge]
2. Cliquez sur la carte pour positionner
3. Nom: "Quartier Bombole"
4. Rayon: 500 (mètres)
5. Cliquez [Ajouter]
```

### 3. **Créer une Zone Orange (Suspecte)**

```
1. Cliquez sur [Zone Orange]
2. Cliquez sur la carte
3. Remplissez le formulaire
4. Cliquez [Ajouter]
```

### 4. **Exporter les Données**

```
Option A: Télécharger en JSON local
  → Cliquez [Exporter JSON]
  → Un fichier zones-sanitaires-YYYY-MM-DD.geojson est créé

Option B: Envoyer au backend
  → Configurez l'API endpoint
  → Cliquez [Envoyer Backend]
```

---

## Configuration Backend (FastAPI)

### Endpoint Simple

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class GeoJSONFeatureCollection(BaseModel):
    type: str
    features: List[dict]
    metadata: dict

@app.post("/api/map-zones")
async def save_zones(data: GeoJSONFeatureCollection):
    # Sauvegarder en base de données
    # ou fichier
    return {
        "success": True,
        "count": len(data.features)
    }
```

### Activer CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Configuration Frontend

### Avec Backend

```tsx
<GeoMap
    apiEndpoint="http://localhost:8000/api/map-zones"
    onDataExport={(data) => console.log("Zones:", data)}
    initialData={[]}
/>
```

### Sans Backend (localStorage seulement)

```tsx
<GeoMap
    onDataExport={(data) => {
        localStorage.setItem("zones", JSON.stringify(data));
    }}
    initialData={JSON.parse(localStorage.getItem("zones") || "[]")}
/>
```

---

## Format des Données Exportées

### Fichier JSON généré

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
                "coordinates": [15.31, -4.32],
                "radius": 500
            },
            "properties": {
                "name": "Zone Danger Bombole",
                "type": "danger_zone",
                "radius": 500
            }
        }
    ],
    "metadata": {
        "exported_at": "2024-05-21T15:30:00.000Z",
        "center": [-4.3224, 15.307],
        "count": 2
    }
}
```

---

## Commandes Utiles

### Développement

```bash
npm run dev      # Démarrer le serveur dev
npm run build    # Compiler pour production
npm run preview  # Prévisualiser la build
```

### Dépannage

```bash
# Vérifier les erreurs TypeScript
npm run build

# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

---

## FAQ Rapide

**Q: Comment zoomer sur une zone?**

```
A: Double-cliquez sur la zone OU utilisez la molette souris
```

**Q: Comment supprimer une zone?**

```
A: Cliquez sur le bouton poubelle rouge dans le panel latéral
OU cliquez sur le marqueur/cercle, puis [Supprimer] dans le popup
```

**Q: Mes données persistent-elles?**

```
A: OUI - localStorage sauvegarde automatiquement
Rechargez la page, vos zones sont encore là
```

**Q: Comment modifier une zone créée?**

```
A: Supprimez et recréez (v1.0.0)
Édition inline prévue en v1.1.0
```

**Q: Comment importer un fichier GeoJSON existant?**

```
A: Pas encore implémenté
Prévu pour v1.1.0 - utilisez le backend pour maintenant
```

---

## Raccourcis Clavier (À Implémenter)

| Touche   | Action                  |
| -------- | ----------------------- |
| `Esc`    | Annuler le mode édition |
| `C`      | Placer Centre           |
| `R`      | Zone Rouge              |
| `O`      | Zone Orange             |
| `Ctrl+E` | Exporter                |
| `Ctrl+S` | Sauvegarder             |

---

## Cas d'Usage Courants

### Scénario 1: Déclarer une épidémie

```
1. [Placer Centre] → Cliquez sur l'hôpital → "Hôpital Principal Bunia"
2. [Zone Rouge] → Rayon 1000m → "Foyer épidémie - Quartier X"
3. [Zone Orange] → Rayon 2000m → "Zone de surveillance"
4. [Exporter JSON] → Téléchargement automatique
5. Envoyer le fichier au backend ou par email
```

### Scénario 2: Suivre plusieurs centres

```
1. [Placer Centre] → "Centre 1"
2. [Placer Centre] → "Centre 2"
3. [Placer Centre] → "Centre 3"
4. Ajouter zones de danger autour
5. [Envoyer Backend] → Tout envoyé en un clic
```

### Scénario 3: Exporter pour SIG externe

```
1. Créer toutes les zones
2. [Exporter JSON] → Télécharger le fichier GeoJSON
3. Importer dans QGIS, ArcGIS, ou autre SIG
4. Le format est compatible 100%
```

---

## Limites Actuelles (v1.0.0)

- ⚠️ Max ~500 zones avant ralentissement
- ⚠️ Pas d'édition inline (suppression/recréation)
- ⚠️ Pas d'historique des modifications
- ⚠️ Pas d'import de fichier GeoJSON
- ⚠️ Interface non-responsive mobile

---

## Améliorations Futures (Roadmap)

- [ ] v1.1.0: Édition inline des zones
- [ ] v1.1.0: Import GeoJSON
- [ ] v1.2.0: Historique/Undo-Redo
- [ ] v1.2.0: Responsive design mobile
- [ ] v2.0.0: Dessin de polygones libres
- [ ] v2.0.0: Collaboration temps réel

---

## Support

📖 Documentation complète: `GEOMAP_DOCUMENTATION.md`
📝 Changelog: `CHANGELOG.md`
🐛 Issues: Ouvrir une issue sur le repo

---

**Prêt à utiliser** ✅
Version: 1.0.0
Dernière mise à jour: 21 mai 2024
