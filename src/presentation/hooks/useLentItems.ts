import { useState, useEffect, useCallback } from 'react';
import { ILentItem } from '@/domain/entities/LentItem';
import { container } from '@/infrastructure/di/container';
import { GetLentItemsParams, SortOption, FilterOption } from '@/domain/usecases/GetLentItemsUseCase';

export const useLentItems = () => {
  const [items, setItems] = useState<ILentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('active');

  const getLentItemsUseCase = container.getGetLentItemsUseCase();
  const markItemReturnedUseCase = container.getMarkItemReturnedUseCase();

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: GetLentItemsParams = {
        sortBy,
        filterBy,
      };
      const loadedItems = await getLentItemsUseCase.execute(params);
      setItems(loadedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [sortBy, filterBy]);

  const markAsReturned = async (itemId: string) => {
    try {
      console.log('markAsReturned called with itemId:', itemId);
      const updatedItem = await markItemReturnedUseCase.execute(itemId);
      console.log('Item marked as returned:', updatedItem);
      await loadItems(); // Reload items
      console.log('Items reloaded');
    } catch (err) {
      console.error('Error marking item as returned:', err);
      throw err;
    }
  };

  const refresh = useCallback(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    markAsReturned,
    refresh,
  };
};