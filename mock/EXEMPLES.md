# Exemples d'utilisation des Mock Data

Ce fichier contient des exemples pratiques pour utiliser les mock data dans votre application React Native.

## Table des matières

1. [Authentification](#1-authentification)
2. [Gestion des commandes](#2-gestion-des-commandes)
3. [Notifications](#3-notifications)
4. [Géolocalisation](#4-géolocalisation)
5. [Historique](#5-historique)
6. [Mise à jour de statut](#6-mise-à-jour-de-statut)
7. [Statistiques](#7-statistiques)

---

## 1. Authentification

### Écran de connexion complet

```javascript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { loginLivreur } from '../mock';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    // Simuler un délai réseau
    setTimeout(() => {
      const result = loginLivreur(email, password);

      setLoading(false);

      if (result.success) {
        // Stocker le token et les données du livreur
        // AsyncStorage.setItem('token', result.token);
        // AsyncStorage.setItem('livreur', JSON.stringify(result.data));

        navigation.replace('Home', { livreur: result.data });
      } else {
        Alert.alert('Erreur', result.message);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion Livreur</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>
        Utilisez: amadou.diallo@delivery.com / password123
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen;
```

---

## 2. Gestion des commandes

### Liste des commandes avec filtres

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getCommandesByLivreur, getCommandesByStatut } from '../mock';

const CommandesScreen = ({ route }) => {
  const { livreur } = route.params;
  const [commandes, setCommandes] = useState([]);
  const [filtreActif, setFiltreActif] = useState('toutes');

  useEffect(() => {
    chargerCommandes();
  }, [filtreActif]);

  const chargerCommandes = () => {
    let commandesFiltrees;

    if (filtreActif === 'toutes') {
      commandesFiltrees = getCommandesByLivreur(livreur.id);
    } else {
      const toutesCommandes = getCommandesByStatut(filtreActif);
      commandesFiltrees = toutesCommandes.filter(
        cmd => cmd.livreur_id === livreur.id
      );
    }

    setCommandes(commandesFiltrees);
  };

  const renderCommande = ({ item }) => (
    <TouchableOpacity style={styles.commandeCard}>
      <View style={styles.commandeHeader}>
        <Text style={styles.numeroCommande}>{item.numero_commande}</Text>
        <View style={[styles.badge, styles[`badge_${item.statut}`]]}>
          <Text style={styles.badgeText}>{item.statut}</Text>
        </View>
      </View>

      <Text style={styles.clientNom}>{item.client_nom}</Text>
      <Text style={styles.adresse}>{item.adresse_livraison}</Text>

      <View style={styles.commandeFooter}>
        <Text style={styles.montant}>{item.montant_total} FCFA</Text>
        <Text style={styles.phone}>{item.client_phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filtres */}
      <View style={styles.filtres}>
        {['toutes', 'en_attente', 'en_route', 'en_cours', 'livre'].map(filtre => (
          <TouchableOpacity
            key={filtre}
            style={[
              styles.filtreBtn,
              filtreActif === filtre && styles.filtreBtnActif,
            ]}
            onPress={() => setFiltreActif(filtre)}
          >
            <Text
              style={[
                styles.filtreBtnText,
                filtreActif === filtre && styles.filtreBtnTextActif,
              ]}
            >
              {filtre.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      <FlatList
        data={commandes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCommande}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune commande trouvée</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtres: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filtreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filtreBtnActif: {
    backgroundColor: '#007AFF',
  },
  filtreBtnText: {
    fontSize: 12,
    color: '#666',
  },
  filtreBtnTextActif: {
    color: '#fff',
    fontWeight: 'bold',
  },
  liste: {
    padding: 15,
  },
  commandeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commandeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numeroCommande: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  badge_en_attente: {
    backgroundColor: '#FFA500',
  },
  badge_en_route: {
    backgroundColor: '#4169E1',
  },
  badge_en_cours: {
    backgroundColor: '#9370DB',
  },
  badge_livre: {
    backgroundColor: '#32CD32',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientNom: {
    fontSize: 16,
    marginBottom: 5,
  },
  adresse: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  commandeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  montant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default CommandesScreen;
```

---

## 3. Notifications

### Badge de notifications + liste

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Badge,
} from 'react-native';
import {
  getNotificationsByLivreur,
  getUnreadNotificationsByLivreur,
} from '../mock';

const NotificationsScreen = ({ route }) => {
  const { livreur } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);

  useEffect(() => {
    chargerNotifications();
  }, []);

  const chargerNotifications = () => {
    const allNotifs = getNotificationsByLivreur(livreur.id);
    const unread = getUnreadNotificationsByLivreur(livreur.id);

    setNotifications(allNotifs);
    setNonLues(unread.length);
  };

  const marquerCommeLu = (notificationId) => {
    // Dans une vraie app, vous feriez un appel API ici
    const updatedNotifs = notifications.map(n =>
      n.id === notificationId ? { ...n, lu: true } : n
    );
    setNotifications(updatedNotifs);
    setNonLues(prev => Math.max(0, prev - 1));
  };

  const getIconeType = (type) => {
    switch (type) {
      case 'nouvelle_livraison':
        return '📦';
      case 'changement_statut':
        return '✅';
      case 'rappel':
        return '⏰';
      default:
        return '📢';
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.lu && styles.notificationNonLue,
      ]}
      onPress={() => !item.lu && marquerCommeLu(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.icone}>{getIconeType(item.type)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>
            {new Date(item.date).toLocaleString('fr-FR')}
          </Text>
        </View>
        {!item.lu && <View style={styles.pointNonLu} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {nonLues > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{nonLues} non lue(s)</Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune notification</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  badgeContainer: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liste: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationNonLue: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icone: {
    fontSize: 24,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 15,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  pointNonLu: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationsScreen;
```

---

## 4. Géolocalisation

### Carte avec marqueurs de livraison

```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getCommandesByLivreur } from '../mock';

const CarteScreen = ({ route }) => {
  const { livreur } = route.params;
  const [commandes, setCommandes] = useState([]);
  const [region, setRegion] = useState({
    latitude: livreur.derniere_position_lat,
    longitude: livreur.derniere_position_lng,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    const commandesActives = getCommandesByLivreur(livreur.id).filter(
      cmd => ['en_route', 'en_cours'].includes(cmd.statut)
    );
    setCommandes(commandesActives);
  }, []);

  const getMarkerColor = (statut) => {
    switch (statut) {
      case 'en_route':
        return '#4169E1';
      case 'en_cours':
        return '#FFA500';
      default:
        return '#32CD32';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Marqueur du livreur */}
        <Marker
          coordinate={{
            latitude: livreur.derniere_position_lat,
            longitude: livreur.derniere_position_lng,
          }}
          title="Ma position"
          pinColor="blue"
        />

        {/* Marqueurs des livraisons */}
        {commandes.map(commande => (
          <Marker
            key={commande.id}
            coordinate={{
              latitude: commande.latitude,
              longitude: commande.longitude,
            }}
            title={commande.client_nom}
            description={commande.adresse_livraison}
            pinColor={getMarkerColor(commande.statut)}
          />
        ))}
      </MapView>

      {/* Légende */}
      <View style={styles.legende}>
        <Text style={styles.legendeTitle}>Légende</Text>
        <View style={styles.legendeItem}>
          <View style={[styles.legendePoint, { backgroundColor: 'blue' }]} />
          <Text>Ma position</Text>
        </View>
        <View style={styles.legendeItem}>
          <View style={[styles.legendePoint, { backgroundColor: '#4169E1' }]} />
          <Text>En route</Text>
        </View>
        <View style={styles.legendeItem}>
          <View style={[styles.legendePoint, { backgroundColor: '#FFA500' }]} />
          <Text>En cours</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legende: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legendeTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});

export default CarteScreen;
```

---

## 5. Historique

### Liste de l'historique avec statistiques

```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, StyleSheet } from 'react-native';
import { getHistoriqueByLivreur, getCommandeById } from '../mock';

const HistoriqueScreen = ({ route }) => {
  const { livreur } = route.params;
  const [historique, setHistorique] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    reussies: 0,
    echouees: 0,
    tauxReussite: 0,
  });

  useEffect(() => {
    const hist = getHistoriqueByLivreur(livreur.id);
    setHistorique(hist);

    const total = hist.length;
    const reussies = hist.filter(h => h.statut_final === 'livre').length;
    const echouees = hist.filter(h => h.statut_final === 'echec').length;

    setStats({
      total,
      reussies,
      echouees,
      tauxReussite: total > 0 ? ((reussies / total) * 100).toFixed(1) : 0,
    });
  }, []);

  const renderHistorique = ({ item }) => {
    const commande = getCommandeById(item.commande_id);

    return (
      <View style={styles.historiqueCard}>
        <View style={styles.historiqueHeader}>
          <Text style={styles.numeroCommande}>{commande.numero_commande}</Text>
          <View
            style={[
              styles.badge,
              item.statut_final === 'livre'
                ? styles.badgeSuccess
                : styles.badgeError,
            ]}
          >
            <Text style={styles.badgeText}>
              {item.statut_final === 'livre' ? '✓ Livrée' : '✗ Échec'}
            </Text>
          </View>
        </View>

        <Text style={styles.clientNom}>{commande.client_nom}</Text>
        <Text style={styles.date}>
          {new Date(item.date_livraison).toLocaleString('fr-FR')}
        </Text>

        {item.preuve_photo_url && (
          <Image
            source={{ uri: item.preuve_photo_url }}
            style={styles.photo}
          />
        )}

        <Text style={styles.montant}>{commande.montant_total} FCFA</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#32CD32' }]}>
            {stats.reussies}
          </Text>
          <Text style={styles.statLabel}>Réussies</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#FF3B30' }]}>
            {stats.echouees}
          </Text>
          <Text style={styles.statLabel}>Échecs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#007AFF' }]}>
            {stats.tauxReussite}%
          </Text>
          <Text style={styles.statLabel}>Taux</Text>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={historique}
        keyExtractor={item => item.id.toString()}
        renderItem={renderHistorique}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun historique</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  liste: {
    padding: 15,
  },
  historiqueCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  historiqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  numeroCommande: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  badgeSuccess: {
    backgroundColor: '#32CD32',
  },
  badgeError: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientNom: {
    fontSize: 15,
    marginBottom: 5,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  montant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default HistoriqueScreen;
```

---

## 6. Mise à jour de statut

### Écran de détails avec actions

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const DetailCommandeScreen = ({ route, navigation }) => {
  const { commande } = route.params;
  const [statut, setStatut] = useState(commande.statut);
  const [photo, setPhoto] = useState(null);

  const prendrePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  const changerStatut = (nouveauStatut) => {
    Alert.alert(
      'Confirmation',
      `Changer le statut en "${nouveauStatut}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setStatut(nouveauStatut);
            // Dans une vraie app: appel API pour mettre à jour
            Alert.alert('Succès', 'Statut mis à jour');
          },
        },
      ]
    );
  };

  const validerLivraison = () => {
    if (!photo) {
      Alert.alert('Erreur', 'Veuillez prendre une photo de preuve');
      return;
    }

    Alert.alert(
      'Validation',
      'Confirmer la livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Valider',
          onPress: () => {
            // Dans une vraie app: upload photo + update statut
            setStatut('livre');
            Alert.alert('Succès', 'Livraison validée avec succès !');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Informations commande */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <Text style={styles.label}>Numéro de commande</Text>
        <Text style={styles.value}>{commande.numero_commande}</Text>

        <Text style={styles.label}>Statut actuel</Text>
        <View style={[styles.badge, styles[`badge_${statut}`]]}>
          <Text style={styles.badgeText}>{statut}</Text>
        </View>

        <Text style={styles.label}>Montant</Text>
        <Text style={styles.value}>{commande.montant_total} FCFA</Text>
      </View>

      {/* Client */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client</Text>
        <Text style={styles.value}>{commande.client_nom}</Text>
        <Text style={styles.phone}>{commande.client_phone}</Text>
        <Text style={styles.adresse}>{commande.adresse_livraison}</Text>

        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>📞 Appeler le client</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        {statut === 'en_attente' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4169E1' }]}
            onPress={() => changerStatut('en_route')}
          >
            <Text style={styles.actionButtonText}>🚗 Démarrer la livraison</Text>
          </TouchableOpacity>
        )}

        {statut === 'en_route' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#9370DB' }]}
            onPress={() => changerStatut('en_cours')}
          >
            <Text style={styles.actionButtonText}>📦 Arrivé sur place</Text>
          </TouchableOpacity>
        )}

        {statut === 'en_cours' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FFA500' }]}
              onPress={prendrePhoto}
            >
              <Text style={styles.actionButtonText}>
                📸 {photo ? 'Photo prise ✓' : 'Prendre une photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#32CD32' }]}
              onPress={validerLivraison}
            >
              <Text style={styles.actionButtonText}>✓ Valider la livraison</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
              onPress={() => changerStatut('echec')}
            >
              <Text style={styles.actionButtonText}>✗ Signaler un échec</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  adresse: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  badge_en_attente: { backgroundColor: '#FFA500' },
  badge_en_route: { backgroundColor: '#4169E1' },
  badge_en_cours: { backgroundColor: '#9370DB' },
  badge_livre: { backgroundColor: '#32CD32' },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailCommandeScreen;
```

---

## 7. Statistiques

### Dashboard avec statistiques complètes

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  getCommandesByLivreur,
  getHistoriqueByLivreur,
  commandes,
} from '../mock';

const DashboardScreen = ({ route }) => {
  const { livreur } = route.params;
  const [stats, setStats] = useState({
    enCours: 0,
    aujourdHui: 0,
    total: 0,
    montantTotal: 0,
    tauxReussite: 0,
  });

  useEffect(() => {
    calculerStats();
  }, []);

  const calculerStats = () => {
    const mesCommandes = getCommandesByLivreur(livreur.id);
    const historique = getHistoriqueByLivreur(livreur.id);

    const enCours = mesCommandes.filter(cmd =>
      ['en_route', 'en_cours'].includes(cmd.statut)
    ).length;

    const aujourdHui = mesCommandes.filter(cmd => {
      const dateCmd = new Date(cmd.date_commande);
      const today = new Date();
      return dateCmd.toDateString() === today.toDateString();
    }).length;

    const montantTotal = historique
      .filter(h => h.statut_final === 'livre')
      .reduce((sum, h) => {
        const cmd = commandes.find(c => c.id === h.commande_id);
        return sum + (cmd ? cmd.montant_total : 0);
      }, 0);

    const total = historique.length;
    const reussies = historique.filter(h => h.statut_final === 'livre').length;
    const tauxReussite = total > 0 ? ((reussies / total) * 100).toFixed(1) : 0;

    setStats({
      enCours,
      aujourdHui,
      total,
      montantTotal,
      tauxReussite,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {livreur.username} 👋</Text>
        <View
          style={[
            styles.statutBadge,
            livreur.statut === 'en_ligne'
              ? styles.statutEnLigne
              : styles.statutHorsLigne,
          ]}
        >
          <Text style={styles.statutText}>{livreur.statut}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#4169E1' }]}>
          <Text style={styles.statNumber}>{stats.enCours}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFA500' }]}>
          <Text style={styles.statNumber}>{stats.aujourdHui}</Text>
          <Text style={styles.statLabel}>Aujourd'hui</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#32CD32' }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total livré</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#9370DB' }]}>
          <Text style={styles.statNumber}>{stats.tauxReussite}%</Text>
          <Text style={styles.statLabel}>Taux réussite</Text>
        </View>
      </View>

      <View style={styles.montantCard}>
        <Text style={styles.montantLabel}>Montant total livré</Text>
        <Text style={styles.montantValue}>
          {stats.montantTotal.toLocaleString()} FCFA
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statutBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statutEnLigne: {
    backgroundColor: '#32CD32',
  },
  statutHorsLigne: {
    backgroundColor: '#999',
  },
  statutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  montantCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  montantLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  montantValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default DashboardScreen;
```

---

## Notes importantes

- Tous ces exemples utilisent les mock data locales
- Pour passer en production, remplacez les imports par des appels API
- Installez les dépendances nécessaires : `react-native-maps`, `expo-image-picker`, etc.
- Adaptez les styles selon votre design system

## Dépendances à installer

```bash
npm install react-native-maps
npx expo install expo-image-picker
npx expo install @react-native-async-storage/async-storage
```
