import React from 'react';
import { View, Image, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { createStyles } from '@/utils/theme';
import { Button } from './Button';

interface HeaderProps {
  onAddPress?: () => void;
  showAddButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAddPress, showAddButton = true }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('app.name')}</Text>
        </View>
        {showAddButton && (
          <Button
            variant="primary"
            size="small"
            onPress={onAddPress}
            style={styles.addButton}
          >
            {t('home.addItem')}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    height: 56,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  addButton: {
    paddingHorizontal: theme.spacing.md,
    minWidth: 80,
  },
}));