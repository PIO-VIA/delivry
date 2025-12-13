# Guide de Démarrage - Application Livreur

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm start
```

Cela ouvrira Expo DevTools dans votre navigateur.

### 3. Tester sur un appareil

#### Sur Android :
```bash
npm run android
```
Ou scannez le QR code avec l'application Expo Go

#### Sur iOS :
```bash
npm run ios
```
Ou scannez le QR code avec l'appareil photo

#### Sur Web :
```bash
npm run web
```

## 🔑 Connexion Test

Utilisez ces identifiants pour vous connecter :

```
Email: amadou.diallo@delivery.com
Mot de passe: password123
```

Autres comptes disponibles :
- `fatima.traore@delivery.com` / password123 (2 livraisons)
- `khadija.ndiaye@delivery.com` / password123 (2 livraisons)
- `ibrahim.sow@delivery.com` / password123 (1 livraison)

## 📱 Fonctionnalités Disponibles

### ✅ Écran de Login
- Authentification par email/mot de passe
- Redirection automatique après connexion
- Messages d'erreur en FR/EN

### ✅ Liste des Livraisons (Onglet 1)
- Affichage des commandes assignées
- Filtres : Toutes, En attente, En route, En cours
- Pull-to-refresh pour actualiser
- Badges de statut colorés

### ✅ Carte (Onglet 2)
- Position actuelle du livreur
- Marqueurs pour les livraisons actives
- Panel d'info pour livraisons en cours
- **Permissions** : Autorisez la localisation

### ✅ Notifications (Onglet 3)
- Liste des notifications du livreur
- Types : Nouvelle livraison, Changement statut, Rappel
- Indicateur non-lu (bordure bleue)
- Timestamps relatifs

### ✅ Historique (Onglet 4)
- Toutes les livraisons terminées
- Statut : Livrée ✅ ou Échouée ❌
- Photos de preuve
- Montants et dates

### ✅ Profil (Onglet 5)
- Informations personnelles
- Statistiques complètes
- Paramètres langue (FR/EN)
- Paramètres thème (Clair/Sombre/Auto)
- Déconnexion

## 🎨 Thèmes

L'application supporte 3 modes :

1. **Clair** - Interface lumineuse
2. **Sombre** - Interface sombre
3. **Auto** - S'adapte au système

Changez le thème depuis : **Profil → Thème**

## 🌍 Langues

L'application est disponible en :

- 🇫🇷 Français (par défaut)
- 🇬🇧 English

Changez la langue depuis : **Profil → Langue**

## 🗂 Structure des Données

### Livreurs (5)
- ID 1 : Amadou Diallo (4 livraisons)
- ID 2 : Fatima Traoré (4 livraisons)
- ID 4 : Khadija Ndiaye (4 livraisons)
- ID 5 : Ibrahim Sow (1 livraison)
- ID 3 : Moussa Kane (hors ligne)

### Commandes (20)
Statuts disponibles :
- `en_attente` - En attente d'assignation
- `en_route` - Livreur en route
- `en_cours` - Livraison en cours
- `livre` - Livrée avec succès
- `echec` - Livraison échouée

## 🔧 Configuration Expo

Le projet utilise :
- **Expo SDK 54**
- **TypeScript** (strict mode)
- **Expo Router** (navigation)
- **Expo Location** (géolocalisation)

## 📝 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer sur Web
npm run web

# Linter
npm run lint
```

## 🐛 Dépannage

### L'application ne démarre pas
```bash
# Nettoyer le cache
npx expo start -c
```

### Erreurs de dépendances
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

### Problèmes de localisation
- Assurez-vous d'avoir autorisé l'accès à la localisation
- Sur iOS : Paramètres → Confidentialité → Service de localisation
- Sur Android : Paramètres → Applications → Permissions → Position

### Carte ne s'affiche pas
- Vérifiez votre connexion internet
- Accordez les permissions de localisation
- Attendez quelques secondes au chargement

## 🔄 Prochaines Étapes

Pour connecter un vrai backend :

1. Créer un fichier `api/config.ts` :
```typescript
export const API_URL = 'https://votre-backend.com/api';
```

2. Remplacer `mockService.ts` par de vrais appels :
```typescript
import { API_URL } from './config';

export const realApi = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  // ... autres endpoints
};
```

3. Mettre à jour le store pour utiliser `realApi`

## 📧 Support

Pour toute question :
- Consultez [PROJECT_STATUS.md](PROJECT_STATUS.md) pour l'état du projet
- Vérifiez la documentation Expo : https://docs.expo.dev/
- Documentation React Native : https://reactnative.dev/

## ✨ Bon développement !
