import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format, DATE_FORMATS } from '@/utils/dateFormat';
import { createStyles } from '@/utils/theme';

interface WebDateInputProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
}

export const WebDateInput: React.FC<WebDateInputProps> = ({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.type = 'date';
      inputRef.current.value = format(value, DATE_FORMATS.INPUT);
      if (minimumDate) {
        inputRef.current.min = format(minimumDate, DATE_FORMATS.INPUT);
      }
      if (maximumDate) {
        inputRef.current.max = format(maximumDate, DATE_FORMATS.INPUT);
      }
    }
  }, [value, minimumDate, maximumDate]);

  const handlePress = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.click();
  };

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const date = new Date(target.value);
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener('change', handleChange);
      return () => input.removeEventListener('change', handleChange);
    }
  }, [onChange]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.dateText}>{format(value, DATE_FORMATS.MEDIUM)}</Text>
        <input
          ref={inputRef}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: 0,
            height: 0,
          }}
        />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    position: 'relative',
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  dateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  error: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },
}));