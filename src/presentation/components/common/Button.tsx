import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { createStyles } from '@/utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.base;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const fullWidthStyle = fullWidth ? styles.fullWidth : {};
    const disabledStyle = disabled ? styles.disabled : {};

    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...fullWidthStyle,
      ...disabledStyle,
      ...(style as ViewStyle),
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyle = textStyles[variant];
    const sizeTextStyle = textStyles[size];

    return {
      ...textStyles.base,
      ...variantTextStyle,
      ...sizeTextStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#A855F7' : '#FFFFFF'}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <Text style={getTextStyle()}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = createStyles((theme) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  primary: {
    backgroundColor: theme.colors.button.primary.background,
  },
  secondary: {
    backgroundColor: theme.colors.button.secondary.background,
    borderWidth: 2,
    borderColor: theme.colors.button.secondary.border,
  },
  danger: {
    backgroundColor: theme.colors.button.danger.background,
  },
  small: {
    paddingVertical: theme.spacing.xs + 2,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
}));

const textStyles = createStyles((theme) => ({
  base: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primary: {
    color: theme.colors.button.primary.text,
  },
  secondary: {
    color: theme.colors.button.secondary.text,
  },
  danger: {
    color: theme.colors.button.danger.text,
  },
  small: {
    fontSize: theme.typography.fontSize.sm,
  },
  medium: {
    fontSize: theme.typography.fontSize.md,
  },
  large: {
    fontSize: theme.typography.fontSize.lg,
  },
}));