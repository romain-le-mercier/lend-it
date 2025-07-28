import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';
import esTranslation from './locales/es/translation.json';
import nlTranslation from './locales/nl/translation.json';

const LANGUAGE_KEY = '@lend_it_language';

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  es: { translation: esTranslation },
  nl: { translation: nlTranslation },
};

const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return null;
  }
};

const storeLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};

const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();
  if (locales.length > 0) {
    const deviceLang = locales[0].languageCode;
    // Check if we support this language
    if (Object.keys(resources).includes(deviceLang)) {
      return deviceLang;
    }
  }
  return 'en'; // Default to English
};

export const initI18n = async () => {
  // Try to get stored language first
  const storedLang = await getStoredLanguage();
  const initialLang = storedLang || getDeviceLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLang,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      react: {
        useSuspense: false, // Disable suspense for React Native
      },
    });

  return i18n;
};

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await storeLanguage(language);
};

export { i18n };