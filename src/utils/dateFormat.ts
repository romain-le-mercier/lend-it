import { format as dateFnsFormat } from 'date-fns';
import { enUS, fr, de, es, nl } from 'date-fns/locale';

const locales = {
  en: enUS,
  fr: fr,
  de: de,
  es: es,
  nl: nl,
};

export const format = (date: Date | number, formatStr: string): string => {
  // Dynamically import i18n to avoid circular dependencies and ensure it's initialized
  let currentLanguage = 'en';
  try {
    const i18n = require('@/i18n').i18n;
    currentLanguage = i18n?.language || 'en';
  } catch (error) {
    // If i18n is not ready, use default language
    currentLanguage = 'en';
  }
  
  const locale = locales[currentLanguage as keyof typeof locales] || enUS;
  
  return dateFnsFormat(date, formatStr, { locale });
};

// Common date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
};