import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, DATE_FORMATS } from '@/utils/dateFormat';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { createStyles } from '@/utils/theme';
import { Button } from '@/presentation/components/common/Button';
import { StatusBadge } from '@/presentation/components/common/StatusBadge';
import { ILentItem } from '@/domain/entities/LentItem';
import { container } from '@/infrastructure/di/container';

type RootStackParamList = {
  Home: undefined;
  ItemDetail: { item: ILentItem };
  EditItem: { item: ILentItem };
};

type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ItemDetailScreen: React.FC = () => {
  const route = useRoute<ItemDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const initialItem = route.params.item;
  const [item, setItem] = useState<ILentItem>(initialItem);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const markItemReturnedUseCase = container.getMarkItemReturnedUseCase();
  const lentItemRepository = container.getLentItemRepository();

  // Refresh item data
  const refreshItem = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedItem = await lentItemRepository.getById(item.id);
      if (updatedItem) {
        setItem(updatedItem);
      }
    } catch (error) {
      console.error('Failed to refresh item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [item.id]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshItem();
    }, [refreshItem])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditItem', { item });
  };

  const handleMarkReturned = async () => {
    const direction = item.itemType === 'lent' ? t('common.by') : t('common.to');
    const message = t('itemDetail.actions.returnMessage', {
      itemName: item.itemName,
      direction: direction || '',
      person: item.borrowerName
    });

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        await performMarkReturned();
      }
    } else {
      Alert.alert(t('itemDetail.actions.confirmReturn'), message, [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.yes') + ', ' + t('itemDetail.actions.markReturned'), onPress: performMarkReturned },
      ]);
    }
  };

  const performMarkReturned = async () => {
    try {
      setIsReturning(true);
      const updatedItem = await markItemReturnedUseCase.execute(item.id);
      setItem(updatedItem);
      // Optionally go back after marking as returned
      // navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('messages.errorGeneric');
      if (Platform.OS === 'web') {
        window.alert(`${t('common.error')}: ${errorMessage}`);
      } else {
        Alert.alert(t('common.error'), errorMessage);
      }
    } finally {
      setIsReturning(false);
    }
  };

  const handleDelete = () => {
    const message = t('itemDetail.actions.deleteMessage', { itemName: item.itemName });
    
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        performDelete();
      }
    } else {
      Alert.alert(t('itemDetail.actions.confirmDelete'), message, [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: performDelete },
      ]);
    }
  };

  const performDelete = async () => {
    try {
      setIsDeleting(true);
      await lentItemRepository.delete(item.id);
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('messages.errorGeneric');
      if (Platform.OS === 'web') {
        window.alert(`${t('common.error')}: ${errorMessage}`);
      } else {
        Alert.alert(t('common.error'), errorMessage);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('itemDetail.title')}</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="#E5E7EB" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.typeIndicator}>
            <Ionicons 
              name={item.itemType === 'lent' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={32} 
              color={item.itemType === 'lent' ? '#22C55E' : '#A855F7'} 
            />
            <Text style={styles.typeText}>
              {item.itemType === 'lent' ? t('itemDetail.itemLent') : t('itemDetail.itemBorrowed')}
            </Text>
          </View>
          
          <Text style={styles.itemName}>{item.itemName}</Text>
          <StatusBadge status={item.getStatus()} />
        </View>

        <View style={styles.section}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={20} color="#64748B" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {item.itemType === 'lent' ? t('itemDetail.borrower') : t('itemDetail.lender')}
              </Text>
              <Text style={styles.detailValue}>{item.borrowerName}</Text>
            </View>
          </View>

          {item.borrowerContact && (
            <View style={styles.detailRow}>
              <Ionicons name="call" size={20} color="#64748B" style={styles.detailIcon} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('itemDetail.contact')}</Text>
                <Text style={styles.detailValue}>{item.borrowerContact}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#64748B" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                {item.itemType === 'lent' ? t('itemDetail.lentDate') : t('itemDetail.borrowedDate')}
              </Text>
              <Text style={styles.detailValue}>
                {format(item.lentDate, DATE_FORMATS.LONG)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#64748B" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{t('itemDetail.expectedReturn')}</Text>
              <Text style={styles.detailValue}>
                {format(item.expectedReturnDate, DATE_FORMATS.LONG)}
              </Text>
            </View>
          </View>

          {item.actualReturnDate && (
            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle" size={20} color="#22C55E" style={styles.detailIcon} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('itemDetail.actualReturn')}</Text>
                <Text style={[styles.detailValue, styles.returnedValue]}>
                  {format(item.actualReturnDate, DATE_FORMATS.LONG)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {item.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('itemDetail.notes')}</Text>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!item.isReturned && (
            <Button
              variant="primary"
              onPress={handleMarkReturned}
              loading={isReturning}
              style={styles.actionButton}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              {'  '}{t('itemDetail.actions.markReturned')}
            </Button>
          )}
          
          <Button
            variant="danger"
            onPress={handleDelete}
            loading={isDeleting}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            {'  '}{t('itemDetail.actions.deleteItem')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  typeText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  itemName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  section: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  detailIcon: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  returnedValue: {
    color: theme.colors.status.success,
  },
  notes: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));