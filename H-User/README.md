# H - PWA Health Monitor

Cette application est une **PWA (Progressive Web App)** développée avec Expo et React Native Web. Elle se concentre sur la surveillance de santé et le traçage de contacts de manière privée et efficace.

## 🚀 Démarrage Rapide

1. **Installez les dépendances** :
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Lancez le serveur Web** :
   ```bash
   npm run web
   ```

## 📱 Pourquoi une PWA ?
Le passage en PWA permet de s'affranchir des complexités des Stores (Google Play / App Store) tout en offrant des fonctionnalités quasi-natives :
- **Installation** : Ajoutez l'icône sur votre écran d'accueil.
- **Mode hors-ligne** : Grâce au Service Worker.
- **Rapidité** : Chargement instantané après la première visite.

## 🛠 Fonctionnalités Web supportées
- **Localisation** : Suivi des zones à risque via le GPS du navigateur.
- **Notifications Web** : Alertes d'exposition (nécessite l'autorisation de l'utilisateur).
- **Bluetooth (Beta)** : Détection de proximité via Web Bluetooth (disponible sur Chrome Android).
- **Accéléromètre** : Détection de mouvement via l'API DeviceMotion.

## 🔒 Confidentialité
Toutes les données de traçage sont traitées localement dans le navigateur et ne sont jamais partagées sans votre consentement explicite.
