import { ILentItem, ItemType } from '../entities/LentItem';

export interface CreateLentItemDto {
  itemName: string;
  borrowerName: string;
  borrowerContact?: string;
  lentDate: Date;
  expectedReturnDate: Date;
  notes?: string;
  itemType: ItemType;
}

export interface UpdateLentItemDto {
  itemName?: string;
  borrowerName?: string;
  borrowerContact?: string;
  expectedReturnDate?: Date;
  notes?: string;
  isReturned?: boolean;
  actualReturnDate?: Date;
}

export interface ILentItemRepository {
  getAll(): Promise<ILentItem[]>;
  getById(id: string): Promise<ILentItem | null>;
  getByBorrower(borrowerName: string): Promise<ILentItem[]>;
  getOverdueItems(): Promise<ILentItem[]>;
  getActiveItems(): Promise<ILentItem[]>;
  create(item: CreateLentItemDto): Promise<ILentItem>;
  update(id: string, item: UpdateLentItemDto): Promise<ILentItem>;
  delete(id: string): Promise<void>;
  markAsReturned(id: string, returnDate?: Date): Promise<ILentItem>;
}