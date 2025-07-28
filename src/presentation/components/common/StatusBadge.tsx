import React from 'react';
import { View, Text } from 'react-native';
import { createStyles } from '@/utils/theme';
import { getStatusColor, getStatusLabel } from '@/utils/theme';

interface StatusBadgeProps {
  status: 'returned' | 'overdue' | 'due_soon' | 'active';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <View style={[styles.container, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  text: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
  },
}));