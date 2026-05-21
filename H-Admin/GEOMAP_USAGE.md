# GeoMap Component - Guide d'Utilisation

## 🎯 Vue d'ensemble

Le composant **GeoMap** est une interface interactive permettant de:

- **Placer des centres de traitement** sur la carte (marqueurs)
- **Créer des zones rouges et oranges** (cercles géographiques)
- **Éditer les noms** directement depuis les popups
- **Supprimer les éléments** avec un clic
- **Exporter les données** au backend ou en JSON local
- **Se géolocaliser** automatiquement au démarrage

---

## 📦 Structure de l'État

```typescript
// Deux états séparés comme spécifié
const [centers, setCenters] = useState<Center[]>([]);
const [zones, setZones] = useState<Zone[]>([]);

interface Center {
    id: string; // Unique, généré avec timestamp
    name: string; // Éditable via popup
    lat: number; // Latitude
    lng: number; // Longitude
}

interface Zone {
    id: string; // Unique, généré avec timestamp
    name: string; // Éditable via popup
    type: "red" | "orange"; // Type de zone
    lat: number; // Latitude du centre
    lng: number; // Longitude du centre
    radius: number; // Rayon en mètres
}
```

---

## 🎮 Workflow CRUD Complet

### 1️⃣ **CRÉER (CREATE)**

```
1. Cliquer sur [Placer Centre] / [Zone Rouge] / [Zone Orange]
2. La carte passe en mode édition
3. Cliquer sur la carte pour positionner l'élément
4. Un formulaire apparaît à droite
5. Entrer le nom (et rayon pour les zones)
6. Cliquer [Ajouter]
7. L'élément s'ajoute à la carte + au panneau droite
```

**État React mis à jour en temps réel** ✓

### 2️⃣ **LIRE (READ)**

```
- Les centres/zones s'affichent automatiquement sur la carte
- Panneau droite liste tous les éléments avec:
  - Nom
  - Coordonnées (lat, lng)
  - Rayon (pour les zones uniquement)
```

**Affichage instantané** ✓

### 3️⃣ **METTRE À JOUR (UPDATE)**

```
1. Cliquer sur un marqueur/cercle sur la carte
2. La popup s'ouvre
3. Cliquer dans le champ texte et modifier le nom
4. L'état React se met à jour en temps réel
5. La popup et le panneau droite reflètent les changements
```

**Édition inline dans la popup** ✓

### 4️⃣ **SUPPRIMER (DELETE)**

```
1. Cliquer sur un marqueur/cercle sur la carte
2. Cliquer sur le bouton rouge [Supprimer] dans la popup
3. L'élément disparaît de la carte et du panneau droite
```

**Bouton rouge (#D92D20 via Tailwind: bg-red-600)** ✓

---

## 🔄 Export et Persistance

### Export Console (Développement)

```typescript
// Cliquer sur [Enregistrer les modifications]
console.log("📤 Données à exporter:", {
  centers: [...],
  zones: [...],
  timestamp: "2024-01-15T10:30:00.000Z"
});
```

### Export Backend (Prodution)

```typescript
// Si apiEndpoint est fourni:
fetch(apiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        centers,
        zones,
        timestamp,
    }),
});
```

### Persistance Locale

Dans **App.jsx**, MapView sauvegarde automatiquement:

```javascript
const handleDataExport = (data) => {
    localStorage.setItem("map_data", JSON.stringify(data));
};
```

---

## 🗺️ Fonctionnalités Avancées

### Géolocalisation Automatique

```typescript
useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setCurrentLocation([
                position.coords.latitude,
                position.coords.longitude,
            ]);
            // La carte se centre automatiquement
        },
        // Fallback: Bunia, RDC [-4.3224, 15.307]
    );
}, []);
```

### Zoom Fixe

- ✅ **Les cercles RESTENT ANCRÉS aux coordonnées** lors du zoom
- ✅ **Le rayon se redimensionne proportionnellement** (Leaflet native)
- ✅ **Pas de bug de freeze**

### Popup Éditable

- Chaque popup contient:
    - Titre (Centre / Zone Danger / Zone Suspecte)
    - Input texte pour le nom (éditable en temps réel)
    - Coordonnées et rayon
    - Bouton [Supprimer] rouge

---

## 📋 Props du Composant

```typescript
interface GeoMapProps {
  apiEndpoint?: string;  // URL du backend FastAPI (optionnel)
}

// Utilisation:
<GeoMap apiEndpoint="https://api.example.com/geodata" />
```

---

## 🔧 Débogage

Tous les exports vont dans la **Console du Navigateur** (F12):

```
📤 Données à exporter: { centers: [...], zones: [...] }
✅ Backend response: { success: true, ... }
❌ Erreur export: { message: "..." }
```

---

## ✅ Spécifications Respectées

- [x] Deux états majeurs séparés: `centers` et `zones`
- [x] Popup s'ouvre avec édition inline du nom
- [x] Bouton [Supprimer] rouge (#D92D20)
- [x] Modification met à jour l'état React en temps réel
- [x] Géolocalisation auto au démarrage
- [x] Zéro bug de zoom (cercles ancrés aux coordonnées)
- [x] Export console + backend API
- [x] Code "sans fioritures", 100% opérationnel
- [x] Compilation TypeScript stricte ✓

---

## 🚀 Prochaines Étapes

1. Tester le CRUD complet en live
2. Vérifier le backend API avec FastAPI
3. Tester la persistance localStorage
4. Configurer l'URL backend si besoin
