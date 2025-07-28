import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { format } from 'date-fns';
import { createStyles } from '@/utils/theme';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { ILentItem } from '@/domain/entities/LentItem';
import { Ionicons } from '@expo/vector-icons';

interface LentItemCardProps {
  item: ILentItem;
  onPress: () => void;
  onMarkReturned: (id: string) => void;
}

export const LentItemCard: React.FC<LentItemCardProps> = ({
  item,
  onPress,
  onMarkReturned,
}) => {
  const handleMarkReturned = (e?: any) => {
    // Prevent event bubbling to parent TouchableOpacity
    if (e) {
      e.stopPropagation();
    }
    console.log('handleMarkReturned called for item:', item.itemName);
    
    if (Platform.OS === 'web') {
      // Use window.confirm for web
      const confirmed = window.confirm(`Are you sure you want to mark "${item.itemName}" as returned?`);
      if (confirmed) {
        console.log('Confirming mark as returned for:', item.id);
        onMarkReturned(item.id);
      }
    } else {
      // Use Alert for mobile
      Alert.alert(
        'Mark as Returned',
        `Are you sure you want to mark "${item.itemName}" as returned?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Mark Returned',
            onPress: () => {
              console.log('Confirming mark as returned for:', item.id);
              onMarkReturned(item.id);
            },
          },
        ]
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, item.itemType === 'borrowed' && styles.borrowedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.itemHeader}>
            <Ionicons 
              name={item.itemType === 'lent' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={20} 
              color={item.itemType === 'lent' ? '#22C55E' : '#A855F7'} 
              style={styles.typeIcon}
            />
            <Text style={styles.itemName} numberOfLines={1}>
              {item.itemName}
            </Text>
          </View>
          <StatusBadge status={item.getStatus()} />
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#64748B" style={styles.detailIcon} />
          <Text style={styles.borrowerName}>
            {item.itemType === 'lent' ? `To: ${item.borrowerName}` : `From: ${item.borrowerName}`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748B" style={styles.detailIcon} />
          <Text style={styles.date}>
            {format(item.lentDate, 'MMM dd')} → {format(item.expectedReturnDate, 'MMM dd, yyyy')}
          </Text>
        </View>
        {item.actualReturnDate ? (
          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#22C55E" style={styles.detailIcon} />
            <Text style={styles.returnedDate}>
              Returned {format(item.actualReturnDate, 'MMM dd, yyyy')}
            </Text>
          </View>
        ) : null}
      </View>

      {item.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      ) : null}

      {!item.isReturned ? (
        <View 
          style={styles.actionContainer}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <Button
            variant="primary"
            size="small"
            onPress={handleMarkReturned}
          >
            Mark as Returned
          </Button>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = createStyles((theme: any) => ({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      },
    }),
  },
  borrowedContainer: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary.purple,
  },
  header: {
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    marginRight: theme.spacing.xs,
  },
  itemName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  details: {
    marginBottom: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailIcon: {
    marginRight: theme.spacing.xs,
  },
  borrowerName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  returnedDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.success,
    marginTop: theme.spacing.xs,
  },
  notes: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  actionContainer: {
    marginTop: theme.spacing.sm,
    alignItems: 'flex-start',
  },
}));