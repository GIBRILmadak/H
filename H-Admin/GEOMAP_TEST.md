# 📋 GeoMap - Plan de Test CRUD Complet

## ✅ Checklist de Test

### 1️⃣ CRÉATION (CREATE)

#### Test 1.1: Ajouter un Centre

- [ ] Cliquer sur [Placer Centre] (le bouton se colore en bleu)
- [ ] Cliquer sur un point quelconque sur la carte
- [ ] Un formulaire apparaît à droite avec "Ajouter élément"
- [ ] Entrer le nom: "Centre de Bunia"
- [ ] Cliquer [Ajouter]
- [ ] ✓ Un marqueur apparaît sur la carte
- [ ] ✓ Le centre apparaît dans la liste "Centres (1)"
- [ ] ✓ Le formulaire disparaît
- [ ] Ouvrir F12 (Console) → Pas d'erreur

#### Test 1.2: Ajouter une Zone Rouge

- [ ] Cliquer sur [Zone Rouge] (le bouton se colore en rouge)
- [ ] Cliquer sur un point différent sur la carte
- [ ] Entrer le nom: "Zone Épidémie Bunia"
- [ ] Entrer le rayon: "2000" (2 km)
- [ ] Cliquer [Ajouter]
- [ ] ✓ Un cercle rouge apparaît sur la carte
- [ ] ✓ La zone apparaît dans la liste "Zones (1)"

#### Test 1.3: Ajouter une Zone Orange

- [ ] Cliquer sur [Zone Orange] (le bouton se colore en orange)
- [ ] Cliquer sur un troisième point
- [ ] Entrer le nom: "Zone Suspecte Beni"
- [ ] Entrer le rayon: "1500" (1.5 km)
- [ ] Cliquer [Ajouter]
- [ ] ✓ Un cercle orange apparaît sur la carte
- [ ] ✓ La zone apparaît dans la liste "Zones (2)"

---

### 2️⃣ LECTURE (READ)

#### Test 2.1: Affichage Instantané

- [ ] Le centre à droite affiche: **Centres (1)** avec le nom "Centre de Bunia"
- [ ] Les zones affichent: **Zones (2)** avec les deux zones
- [ ] Les marqueurs/cercles sont visibles sur la carte
- [ ] Les coordonnées affichées sont correctes

#### Test 2.2: Géolocalisation

- [ ] À l'ouverture de la carte, le spinner "📍 Localisation..." apparaît
- [ ] Après ~2 secondes, la carte se centre automatiquement
- [ ] Le spinner disparaît
- [ ] (Si géolocalisation refusée, la carte reste sur Bunia: [-4.3224, 15.307])

---

### 3️⃣ MISE À JOUR (UPDATE)

#### Test 3.1: Éditer le Nom d'un Centre

- [ ] Cliquer sur le marqueur bleu (Centre de Bunia)
- [ ] Une popup s'ouvre avec un champ texte
- [ ] Le champ contient "Centre de Bunia"
- [ ] Sélectionner le texte et changer en "Hôpital Central"
- [ ] ✓ Le nom change IMMÉDIATEMENT dans la liste à droite
- [ ] Fermer la popup (cliquer ailleurs sur la carte)
- [ ] Rouvrir la popup → Le nom reste "Hôpital Central"

#### Test 3.2: Éditer le Nom d'une Zone

- [ ] Cliquer sur le cercle rouge (Zone Épidémie)
- [ ] Modifier le nom en "Zone Danger Élevé"
- [ ] ✓ Le nom change dans la liste
- [ ] Fermer et rouvrir → le nouveau nom persiste

#### Test 3.3: Éditer le Rayon (Zone)

- [ ] ⚠️ REMARQUE: Le rayon ne peut être modifié que lors de la création
- [ ] (Feature future: permet d'éditer le rayon dans la popup)

---

### 4️⃣ SUPPRESSION (DELETE)

#### Test 4.1: Supprimer un Centre

- [ ] Cliquer sur le marqueur bleu (Hôpital Central)
- [ ] Cliquer sur le bouton [Supprimer] ROUGE dans la popup
- [ ] ✓ Le marqueur disparaît immédiatement de la carte
- [ ] ✓ La liste "Centres" disparaît (0 centres)
- [ ] ✓ Aucune erreur dans la console

#### Test 4.2: Supprimer une Zone

- [ ] Cliquer sur le cercle orange (Zone Suspecte)
- [ ] Cliquer sur [Supprimer] ROUGE
- [ ] ✓ Le cercle disparaît de la carte
- [ ] ✓ La liste affiche "Zones (1)" (reste la zone rouge)

#### Test 4.3: Supprimer la Dernière Zone

- [ ] Supprimer le cercle rouge restant
- [ ] ✓ La section "Zones" disparaît complètement du panneau droite
- [ ] ✓ Un message "Aucun élément" s'affiche si tout est supprimé

---

### 5️⃣ EXPORT ET CONSOLE

#### Test 5.1: Export Console

- [ ] Ajouter 1 centre et 2 zones (pour avoir des données)
- [ ] Ouvrir F12 (Console)
- [ ] Cliquer sur [Enregistrer les modifications]
- [ ] ✓ Un message apparaît: "✓ Enregistré: 1 centres, 2 zones"
- [ ] ✓ Dans la console, voir:
    ```
    📤 Données à exporter: {
      centers: [{id: "...", name: "...", lat: ..., lng: ...}],
      zones: [{id: "...", name: "...", type: "red", lat: ..., lng: ..., radius: 2000}],
      timestamp: "2024-01-15T10:30:00.000Z"
    }
    ```

#### Test 5.2: Structure JSON Valide

- [ ] Vérifier que les coordinates sont des nombres (pas du texte)
- [ ] Vérifier que chaque élément a un `id` unique
- [ ] Vérifier que `type` est "red" ou "orange" (pas "red_zone")

---

### 6️⃣ CAS D'ERREUR

#### Test 6.1: Formulaire Vide

- [ ] Cliquer sur [Placer Centre]
- [ ] Cliquer sur la carte
- [ ] Cliquer [Ajouter] SANS entrer de nom
- [ ] ✓ Une alerte apparaît: "Veuillez entrer un nom"
- [ ] ✓ L'élément n'est pas créé

#### Test 6.2: Annuler la Création

- [ ] Cliquer sur [Placer Centre]
- [ ] Cliquer sur la carte
- [ ] Cliquer [Annuler] au lieu d'[Ajouter]
- [ ] ✓ Le formulaire disparaît
- [ ] ✓ Le mode édition s'arrête

#### Test 6.3: Zoom et Panoramique

- [ ] Zoomer in/out (roulette souris ou pinçage)
- [ ] ✓ Les cercles se REDIMENSIONNENT proportionnellement
- [ ] ✓ Ils RESTENT ancrés aux mêmes coordonnées
- [ ] ✓ Pas de "freeze" ou décalage

---

### 7️⃣ INTÉGRATION

#### Test 7.1: NavBar et Onglets

- [ ] La GeoMap occupe tout l'espace disponible (hauteur: 100%)
- [ ] Cliquer sur d'autres onglets (Dashboard, Alerts, etc.)
- [ ] Revenir sur Map → Les données RESTENT inchangées
- [ ] (localStorage assure la persistance)

#### Test 7.2: Rafraîchissement Page (F5)

- [ ] Ajouter 3 centres et 2 zones
- [ ] Appuyer sur F5
- [ ] ✓ Les données RESTENT affichées
- [ ] ✓ La géolocalisation se relance

---

## 📊 Résultat Attendu: 100% Fonctionnel

```
✅ CREATE  - Ajouter centres/zones sans erreur
✅ READ    - Afficher les éléments sur la carte
✅ UPDATE  - Éditer les noms en temps réel
✅ DELETE  - Supprimer avec le bouton rouge
✅ EXPORT  - Console + Backend API
✅ ZOOM    - Zéro bug de freeze
✅ GEO     - Auto-localisation
✅ PERSIST - localStorage automatique
✅ COMPILE - TypeScript sans erreur
```

---

## 🔗 Ressources

- [Documentation GeoMap](./GEOMAP_USAGE.md)
- Console Browser (F12)
- Localhost: [http://localhost:3001](http://localhost:3001)
