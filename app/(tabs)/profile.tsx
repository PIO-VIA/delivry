import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import mockApi from '@/api/mockService';
import { StatistiquesLivreur } from '@/mock/types';
import i18n from '@/i18n';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { livreur, logout, language, setLanguage, theme: themeMode, setTheme } = useStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatistiquesLivreur | null>(null);

  const loadStatistics = async () => {
    if (!livreur) return;

    try {
      const data = await mockApi.getMyStatistics(livreur.id);
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
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

  if (!livreur) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {t('common.error')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Image source={{ uri: livreur.photo_url }} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.colors.text }]}>{livreur.username}</Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{livreur.email}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                livreur.statut === 'en_ligne'
                  ? theme.colors.success + '20'
                  : theme.colors.error + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: livreur.statut === 'en_ligne' ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {livreur.statut === 'en_ligne' ? t('profile.online') : t('profile.offline')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('profile.statistics')}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
        ) : stats ? (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.total_livraisons}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {t('profile.totalDeliveries')}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {stats.livraisons_reussies}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {t('profile.successfulDeliveries')}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {stats.livraisons_echouees}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {t('profile.failedDeliveries')}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.statValue, { color: theme.colors.info }]}>
                {stats.taux_reussite.toFixed(1)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {t('profile.successRate')}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                styles.statCardWide,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.montant_total_livre.toLocaleString()} FCFA
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {t('profile.totalEarnings')}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('settings.title')}
        </Text>

        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={toggleLanguage}
        >
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            {t('settings.language')}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.primary }]}>
            {language === 'fr' ? t('settings.french') : t('settings.english')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={cycleTheme}
        >
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            {t('settings.theme')}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.primary }]}>
            {getThemeLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>{t('auth.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCardWide: {
    minWidth: '100%',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
  },
});
