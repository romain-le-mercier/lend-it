import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createStyles } from '@/utils/theme';
import { useLentItems } from '@/presentation/hooks/useLentItems';
import { LentItemCard } from '@/presentation/components/common/LentItemCard';
import { Button } from '@/presentation/components/common/Button';
import { FilterBar } from '@/presentation/components/common/FilterBar';
import { Header } from '@/presentation/components/common/Header';
import { AddItemForm } from '@/presentation/components/screens/AddItemForm';
import { ILentItem } from '@/domain/entities/LentItem';
import { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    items,
    loading,
    error,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    markAsReturned,
    refresh,
  } = useLentItems();

  const handleMarkReturned = async (itemId: string) => {
    try {
      await markAsReturned(itemId);
      if (Platform.OS === 'web') {
        // For web, we could show a toast or just log
        console.log('Success: Item marked as returned!');
      } else {
        Alert.alert('Success', 'Item marked as returned!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark item as returned';
      if (Platform.OS === 'web') {
        window.alert(`Error: ${errorMessage}`);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    refresh();
  };

  const renderItem = ({ item }: { item: ILentItem }) => (
    <LentItemCard
      item={item}
      onPress={() => {
        navigation.navigate('ItemDetail', { item });
      }}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No items found</Text>
      <Text style={styles.emptyMessage}>
        Start by adding your first item
      </Text>
      <Button
        variant="primary"
        onPress={() => setShowAddForm(true)}
        style={styles.emptyButton}
      >
        Add Your First Item
      </Button>
    </View>
  );

  if (error && !loading) {
    return (
      <View style={styles.container}>
        <Header showAddButton={false} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button variant="primary" onPress={refresh}>
            Try Again
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onAddPress={() => setShowAddForm(true)} />
      
      <View style={styles.content}>
        <FilterBar
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor="#A855F7"
            />
          }
          ListEmptyComponent={!loading ? renderEmpty : null}
        />
      </View>

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddItemForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>
    </View>
  );
};

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptyMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.status.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
}));