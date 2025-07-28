import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { format, DATE_FORMATS } from '@/utils/dateFormat';
import { createStyles } from '@/utils/theme';
import { WebDateInput } from './WebDateInput';

// Conditionally import DateTimePicker only for native platforms
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  // For web, use custom web date input
  if (Platform.OS === 'web') {
    return (
      <WebDateInput
        label={label}
        value={value}
        onChange={onChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        error={error}
      />
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={showDatePicker}
        activeOpacity={0.7}
      >
        <Text style={styles.dateText}>{format(value, DATE_FORMATS.MEDIUM)}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      
      {show && DateTimePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
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