import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

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
      return 'Returned';
    case 'overdue':
      return 'Overdue';
    case 'due_soon':
      return 'Due Soon';
    case 'active':
      return 'Active';
  }
};