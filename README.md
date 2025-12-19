# DeliveryPro - Application de Livraison pour Livreurs 🛵

Bienvenue sur **DeliveryPro**, une application mobile moderne et performante conçue pour les livreurs. Cette application permet de gérer les livraisons, suivre les itinéraires, et consulter les statistiques de performance, le tout avec une interface utilisateur premium et ergonomique.

## 📱 Fonctionnalités Principales

*   **Tableau de Bord Intuitif** : Vue d'ensemble des livraisons disponibles, en cours et terminées.
*   **Carte Interactive** : Visualisation en temps réel des livraisons et de la position du livreur (basée sur OpenStreetMap via `react-native-webview`).
*   **Détails de Livraison Ergonomiques** : Interface type "Bottom Sheet" pour consulter les infos client, appeler en un clic, et naviguer vers la destination.
*   **Gestion de Profil** : Modification des informations personnelles, changement de photo de profil, et consultation des statistiques de gains.
*   **Preuve de Livraison** : Prise de photo intégrée pour valider les livraisons.
*   **Mode Sombre / Clair** : Thème adaptatif pour un confort visuel optimal de jour comme de nuit.
*   **Multilingue** : Support complet du Français 🇫🇷 et de l'Anglais 🇬🇧.
*   **Données Localisées** : Contexte adapté au Cameroun (Yaoundé) pour les démos.

## 🛠 Stack Technique

Ce projet est construit avec les dernières technologies de l'écosystème React Native :

*   **Framework** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/) (SDK 54).
*   **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/) pour une navigation fluide basée sur les fichiers.
*   **État Global** : [Zustand](https://github.com/pmndrs/zustand) pour une gestion d'état légère et performante.
*   **Cartographie** : OpenStreetMap + Leaflet (via `react-native-webview`) pour éviter la dépendance aux services Google Play.
*   **UI/UX** : Design system personnalisé, icônes via `lucide-react-native`, et animations fluides.
*   **Internationalisation** : `i18next` et `react-i18next`.
*   **Stockage** : `AsyncStorage` pour la persistance des données locales.

## 🚀 Installation et Démarrage

Suivez ces étapes pour lancer le projet sur votre machine :

1.  **Prérequis** : Assurez-vous d'avoir Node.js installé.

2.  **Installation des dépendances** :
    ```bash
    npm install
    ```

3.  **Lancement de l'application** :
    ```bash
    npx expo start
    ```

4.  **Test sur appareil** :
    *   Téléchargez l'application **Expo Go** sur votre téléphone (Android ou iOS).
    *   Scannez le QR code affiché dans le terminal.

## 📂 Structure du Projet

*   `app/` : Pages et navigation (Expo Router).
    *   `(tabs)/` : Écrans principaux (Accueil, Carte, Notifications, Historique, Profil).
    *   `delivery/[id].tsx` : Page de détails d'une livraison.
    *   `login.tsx` : Page de connexion.
*   `components/` : Composants réutilisables (UI, Icônes...).
*   `hooks/` : Hooks personnalisés (Thème, etc.).
*   `mock/` : Données de simulation (Clients, Livreurs, Commandes - Contexte Cameroun).
*   `store/` : Gestion d'état global avec Zustand.
*   `theme/` : Configuration des couleurs et du style global.
*   `i18n/` : Fichiers de traduction (FR/EN).

## 🌍 Contexte de Démo

L'application est actuellement configurée avec des données de simulation situées à **Yaoundé, Cameroun**.
Vous pouvez vous connecter avec les identifiants de test suivants (pré-remplis) :
*   **Email** : `franck@delivery.com`
*   **Mot de passe** : `password123`

## ✨ Auteur

Développé avec passion pour offrir la meilleure expérience aux livreurs.
