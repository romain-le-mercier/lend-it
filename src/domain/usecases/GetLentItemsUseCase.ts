import { ILentItem } from '../entities/LentItem';
import { ILentItemRepository } from '../repositories/ILentItemRepository';

export type SortOption = 'dueDate' | 'borrowerName' | 'itemName' | 'status';
export type FilterOption = 'all' | 'active' | 'returned' | 'overdue';

export interface GetLentItemsParams {
  sortBy?: SortOption;
  filterBy?: FilterOption;
  searchQuery?: string;
}

export interface IGetLentItemsUseCase {
  execute(params?: GetLentItemsParams): Promise<ILentItem[]>;
}

export class GetLentItemsUseCase implements IGetLentItemsUseCase {
  constructor(private lentItemRepository: ILentItemRepository) {}

  async execute(params?: GetLentItemsParams): Promise<ILentItem[]> {
    let items: ILentItem[];

    // Get items based on filter
    switch (params?.filterBy) {
      case 'active':
        items = await this.lentItemRepository.getActiveItems();
        break;
      case 'overdue':
        items = await this.lentItemRepository.getOverdueItems();
        break;
      case 'returned':
        const allItems = await this.lentItemRepository.getAll();
        items = allItems.filter(item => item.isReturned);
        break;
      default:
        items = await this.lentItemRepository.getAll();
    }

    // Apply search filter
    if (params?.searchQuery) {
      const query = params.searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.itemName.toLowerCase().includes(query) ||
          item.borrowerName.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query)
      );
    }

    // Sort items
    switch (params?.sortBy) {
      case 'dueDate':
        items.sort((a, b) => a.expectedReturnDate.getTime() - b.expectedReturnDate.getTime());
        break;
      case 'borrowerName':
        items.sort((a, b) => a.borrowerName.localeCompare(b.borrowerName));
        break;
      case 'itemName':
        items.sort((a, b) => a.itemName.localeCompare(b.itemName));
        break;
      case 'status':
        const statusOrder = { 'overdue': 0, 'due_soon': 1, 'active': 2, 'returned': 3 };
        items.sort((a, b) => statusOrder[a.getStatus()] - statusOrder[b.getStatus()]);
        break;
      default:
        // Default sort by creation date (newest first)
        items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return items;
  }
}