import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import i18n from 'i18next';

export const createStyles = <T extends StyleSheet.NamedStyles<T>>(
  styles: T | ((theme: typeof theme) => T)
): T => {
  if (typeof styles === 'function') {
    return StyleSheet.create(styles(theme));
  }
  return StyleSheet.create(styles);
};

export const getStatusColor = (status: 'returned' | 'overdue' | 'due_soon' | 'active') => {
  switch (status) {
    case 'returned':
      return theme.colors.status.success;
    case 'overdue':
      return theme.colors.status.error;
    case 'due_soon':
      return theme.colors.status.warning;
    case 'active':
      return theme.colors.primary.purple;
  }
};

export const getStatusLabel = (status: 'returned' | 'overdue' | 'due_soon' | 'active') => {
  switch (status) {
    case 'returned':
      return i18n.t('status.returned');
    case 'overdue':
      return i18n.t('status.overdue');
    case 'due_soon':
      return i18n.t('status.dueSoon');
    case 'active':
      return i18n.t('status.active');
  }
};