import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { createStyles } from '@/utils/theme';
import { FilterOption } from '@/domain/usecases/GetLentItemsUseCase';

interface FilterBarProps {
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'returned', label: 'Returned' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterBy,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.chip,
              filterBy === option.value && styles.chipActive,
            ]}
            onPress={() => onFilterChange(option.value)}
          >
            <Text
              style={[
                styles.chipText,
                filterBy === option.value && styles.chipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    marginRight: theme.spacing.sm,
  },
  chipActive: {
    backgroundColor: theme.colors.primary.purple,
    borderColor: theme.colors.primary.purple,
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}));