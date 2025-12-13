# Mock Data - Application de Livraison

Ce dossier contient toutes les données mock pour l'application mobile React Native destinée aux livreurs.

## Structure des fichiers

```
mock/
├── livreurs.js          # 5 livreurs avec coordonnées GPS
├── clients.js           # 10 clients
├── commandes.js         # 20 commandes avec différents statuts
├── notifications.js     # 15 notifications
├── historique.js        # 10 entrées d'historique de livraisons
├── index.js            # Point d'entrée centralisé avec fonctions utilitaires
└── README.md           # Ce fichier
```

## Utilisation

### Import simple

```javascript
// Importer toutes les données
import mockData from './mock';

// Ou importer des données spécifiques
import { livreurs, commandes, notifications } from './mock';
```

### Exemples d'utilisation

#### 1. Connexion d'un livreur

```javascript
import { loginLivreur } from './mock';

const handleLogin = async (email, password) => {
  const result = loginLivreur(email, password);

  if (result.success) {
    console.log('Livreur connecté:', result.data);
    console.log('Token:', result.token);
  } else {
    console.log('Erreur:', result.message);
  }
};

// Exemple de connexion
handleLogin('amadou.diallo@delivery.com', 'password123');
```

#### 2. Afficher les commandes d'un livreur

```javascript
import { getCommandesByLivreur } from './mock';

const livreurId = 1;
const mesCommandes = getCommandesByLivreur(livreurId);

console.log(`${mesCommandes.length} commandes pour le livreur #${livreurId}`);
```

#### 3. Filtrer les commandes par statut

```javascript
import { getCommandesByStatut } from './mock';

const commandesEnAttente = getCommandesByStatut('en_attente');
const commandesEnRoute = getCommandesByStatut('en_route');
const commandesLivrees = getCommandesByStatut('livre');

console.log(`En attente: ${commandesEnAttente.length}`);
console.log(`En route: ${commandesEnRoute.length}`);
console.log(`Livrées: ${commandesLivrees.length}`);
```

#### 4. Afficher les notifications non lues

```javascript
import { getUnreadNotificationsByLivreur } from './mock';

const livreurId = 1;
const notificationsNonLues = getUnreadNotificationsByLivreur(livreurId);

console.log(`${notificationsNonLues.length} notification(s) non lue(s)`);
```

#### 5. Afficher l'historique d'un livreur

```javascript
import { getHistoriqueByLivreur } from './mock';

const livreurId = 2;
const historique = getHistoriqueByLivreur(livreurId);

console.log(`${historique.length} livraison(s) dans l'historique`);
```

## Données de test disponibles

### Livreurs (5)

Tous les livreurs utilisent le mot de passe: `password123`

| ID | Email | Statut | Disponibilité |
|----|-------|--------|---------------|
| 1 | amadou.diallo@delivery.com | en_ligne | true |
| 2 | fatima.traore@delivery.com | en_ligne | true |
| 3 | moussa.kane@delivery.com | hors_ligne | false |
| 4 | khadija.ndiaye@delivery.com | en_ligne | true |
| 5 | ibrahim.sow@delivery.com | en_ligne | false |

### Statuts des commandes

- **en_attente** : Commande créée, pas encore assignée à un livreur
- **en_route** : Livreur en route vers le client
- **en_cours** : Livraison en cours de traitement
- **livre** : Commande livrée avec succès
- **echec** : Échec de livraison

### Répartition des 20 commandes

- En attente: 4 commandes
- En route: 2 commandes
- En cours: 3 commandes
- Livrées: 10 commandes
- Échec: 1 commande

### Types de notifications

- **nouvelle_livraison** : Nouvelle commande assignée
- **changement_statut** : Mise à jour du statut d'une commande
- **rappel** : Rappels divers pour le livreur

## Fonctions utilitaires disponibles

| Fonction | Description |
|----------|-------------|
| `getLivreurById(id)` | Récupère un livreur par son ID |
| `getClientById(id)` | Récupère un client par son ID |
| `getCommandeById(id)` | Récupère une commande par son ID |
| `getCommandesByStatut(statut)` | Filtre les commandes par statut |
| `getCommandesByLivreur(livreurId)` | Récupère les commandes d'un livreur |
| `getNotificationsByLivreur(livreurId)` | Récupère les notifications d'un livreur |
| `getUnreadNotificationsByLivreur(livreurId)` | Récupère les notifications non lues |
| `getHistoriqueByLivreur(livreurId)` | Récupère l'historique d'un livreur |
| `getLivreursEnLigne()` | Récupère tous les livreurs en ligne |
| `getLivreursDisponibles()` | Récupère les livreurs disponibles |
| `loginLivreur(email, password)` | Simule une connexion |

## Coordonnées GPS (Dakar, Sénégal)

Toutes les coordonnées sont basées sur des localisations réelles à Dakar :

- Almadies: 14.7392, -17.5053
- Corniche Ouest: 14.6953, -17.4439
- Plateau: 14.6708, -17.4381
- Mermoz: 14.7189, -17.4756
- Ouakam: 14.7247, -17.4928
- Point E: 14.7031, -17.4503
- Liberté 6: 14.7078, -17.4631
- Ngor: 14.7539, -17.5147

## Intégration avec React Native

### Exemple de screen de connexion

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { loginLivreur } from './mock';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const result = loginLivreur(email, password);

    if (result.success) {
      // Navigation vers l'écran principal
      Alert.alert('Succès', 'Connexion réussie');
    } else {
      Alert.alert('Erreur', result.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
};
```

### Exemple de liste de commandes

```javascript
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { getCommandesByLivreur } from './mock';

const CommandesScreen = ({ livreurId }) => {
  const commandes = getCommandesByLivreur(livreurId);

  return (
    <FlatList
      data={commandes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.numero_commande}</Text>
          <Text>{item.client_nom}</Text>
          <Text>{item.adresse_livraison}</Text>
          <Text>Statut: {item.statut}</Text>
          <Text>Montant: {item.montant_total} FCFA</Text>
        </View>
      )}
    />
  );
};
```

## Notes importantes

- Les photos de preuve utilisent des URLs de placeholder (picsum.photos et pravatar.cc)
- Les montants sont en Francs CFA (FCFA)
- Les numéros de téléphone suivent le format sénégalais (+221)
- Les dates sont au format ISO 8601
- Aucun appel API réel n'est effectué - tout est local

## Migration vers un vrai backend

Lorsque vous serez prêt à connecter votre backend Laravel :

1. Remplacez les imports des mock data par des appels API
2. Utilisez la même structure de données pour faciliter la transition
3. Les fonctions utilitaires peuvent être adaptées pour travailler avec des données d'API

```javascript
// Exemple de migration
// Avant (mock)
import { getCommandesByLivreur } from './mock';
const commandes = getCommandesByLivreur(livreurId);

// Après (API)
const commandes = await fetch(`${API_URL}/livreurs/${livreurId}/commandes`)
  .then(res => res.json());
```
