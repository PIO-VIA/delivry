import { ScreenContainer } from '@/components/screen-container';
import { SwipeableTabWrapper } from '@/components/swipeable-tab-wrapper';
import { Icon } from '@/components/ui/icon';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useTheme } from '@/hooks/use-theme';
import i18n from '@/i18n';
import { StatistiquesLivreur } from '@/lib/types';
import { getUserAvatar } from '@/lib/utils';
import { useStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { livreur, setLivreur, logout, language, setLanguage, theme: themeMode, setTheme, history, fetchHistory } = useStore();
  const { isLandscape } = useResponsiveLayout();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatistiquesLivreur | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const loadStatistics = async () => {
    if (!livreur) return;

    // Ensure we have the latest history
    if (history.length === 0) {
      await fetchHistory();
    }

    const currentHistory = useStore.getState().history;

    const total = currentHistory.length;
    const successful = currentHistory.filter(h => h.statut_final === 'livre').length;
    const failed = currentHistory.filter(h => h.statut_final === 'echec').length;
    const totalAmount = currentHistory.reduce((sum, h) => sum + (h.statut_final === 'livre' ? h.montant_total : 0), 0);

    setStats({
      total_livraisons: total,
      livraisons_reussies: successful,
      livraisons_echouees: failed,
      taux_reussite: total > 0 ? (successful / total) * 100 : 0,
      montant_total_livre: totalAmount
    });
    setLoading(false);
  };

  useEffect(() => {
    if (livreur) {
      setEditName(livreur.username);
      setEditEmail(livreur.email);
      setEditPhone(livreur.phone);
      setEditPhoto(livreur.photo_url);
      loadStatistics();
    }
  }, [livreur]);

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Voulez-vous vraiment vous déconnecter ?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return t('settings.themeLight');
      case 'dark':
        return t('settings.themeDark');
      case 'auto':
        return t('settings.themeAuto');
    }
  };

  const handlePickImage = async () => {
    if (!isEditing) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditPhoto(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    if (!livreur) return;

    // Update local store (mock update)
    setLivreur({
      ...livreur,
      username: editName,
      email: editEmail,
      phone: editPhone,
      photo_url: editPhoto,
    });

    setIsEditing(false);
    Alert.alert(t('common.success'), 'Profil mis à jour avec succès');
  };

  if (!livreur) {
    return (
      <ScreenContainer>
        <SwipeableTabWrapper>
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('common.error')}
            </Text>
          </View>
        </SwipeableTabWrapper>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['bottom']}>
      <SwipeableTabWrapper>
        <ScrollView style={styles.container} contentContainerStyle={isLandscape && styles.contentLandscape}>
          {/* Header / Profile Card */}
          <View style={styles.headerContainer}>
            <View style={[styles.profileCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
              <View style={styles.headerTop}>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: isEditing ? theme.colors.success : theme.colors.primary }]}
                  onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  <Icon name={isEditing ? 'check-circle' : 'settings'} size={20} color="#FFFFFF" />
                  <Text style={styles.editButtonText}>
                    {isEditing ? t('common.save') : t('common.edit')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.avatarContainer}>
                <Image
                  source={
                    isEditing && editPhoto
                      ? { uri: editPhoto }
                      : getUserAvatar(livreur)
                  }
                  style={styles.avatar}
                />

                {isEditing && (
                  <>
                    <TouchableOpacity
                      style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
                      onPress={() => {
                        setIsEditing(false);
                        setEditName(livreur.username);
                        setEditEmail(livreur.email);
                        setEditPhone(livreur.phone);
                        setEditPhoto(livreur.photo_url);
                      }}
                    >
                      <Icon name="x" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.editOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                      onPress={handlePickImage}
                    >
                      <Icon name="camera" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {isEditing ? (
                <View style={styles.editForm}>
                  <TextInput
                    style={[styles.editInput, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                  <TextInput
                    style={[styles.editInput, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                  <TextInput
                    style={[styles.editInput, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="Téléphone"
                    keyboardType="phone-pad"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                </View>
              ) : (
                <View style={styles.infoContainer}>
                  <Text style={[styles.name, { color: theme.colors.text }]}>{livreur.username}</Text>
                  <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{livreur.email}</Text>
                  <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>{livreur.phone}</Text>

                  <View style={[styles.statusBadge, { backgroundColor: livreur.statut === 'en_ligne' ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: livreur.statut === 'en_ligne' ? theme.colors.success : theme.colors.error }]} />
                    <Text style={[styles.statusText, { color: livreur.statut === 'en_ligne' ? theme.colors.success : theme.colors.error }]}>
                      {livreur.statut === 'en_ligne' ? t('profile.online') : t('profile.offline')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('profile.statistics')}
            </Text>

            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
            ) : stats ? (
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Icon name="package" size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.total_livraisons}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.totalDeliveries')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '15' }]}>
                    <Icon name="check-circle" size={24} color={theme.colors.success} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.livraisons_reussies}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.successfulDeliveries')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.info + '15' }]}>
                    <Icon name="trending-up" size={24} color={theme.colors.info} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.taux_reussite.toFixed(0)}%</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.successRate')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '15' }]}>
                    <Icon name="dollar" size={24} color={theme.colors.warning} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{(stats.montant_total_livre / 1000).toFixed(1)}k</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Gains (FCFA)</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('settings.title')}
            </Text>

            <TouchableOpacity
              style={[styles.settingRow, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}
              onPress={toggleLanguage}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name="globe" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  {t('settings.language')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                  {language === 'fr' ? 'Français' : 'English'}
                </Text>
                <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}
              onPress={cycleTheme}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name="moon" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  {t('settings.theme')}
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                  {getThemeLabel()}
                </Text>
                <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error, shadowColor: theme.colors.error }]}
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SwipeableTabWrapper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: -20,
    zIndex: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 0,
    left: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  editForm: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  phone: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 16,
  },
  contentLandscape: {
    paddingHorizontal: 24,
  },
});
