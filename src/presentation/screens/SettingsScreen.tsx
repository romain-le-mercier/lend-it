import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/utils/theme';
import { changeLanguage } from '@/i18n';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = async (langCode: string) => {
    setCurrentLanguage(langCode);
    await changeLanguage(langCode);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  currentLanguage === lang.code && styles.languageItemActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      currentLanguage === lang.code && styles.languageNameActive,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </View>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('app.name')}</Text>
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>v1.0.0</Text>
            <Text style={styles.appDescription}>
              {t('home.startAdding')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  languageList: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  languageItemActive: {
    backgroundColor: `${theme.colors.primary.green}10`,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  languageName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  languageNameActive: {
    fontWeight: '600',
    color: theme.colors.primary.green,
  },
  appInfo: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  appDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
}));