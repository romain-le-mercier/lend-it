import { ILentItem } from '../entities/LentItem';
import { ILentItemRepository } from '../repositories/ILentItemRepository';

export interface IMarkItemReturnedUseCase {
  execute(itemId: string, returnDate?: Date): Promise<ILentItem>;
}

export class MarkItemReturnedUseCase implements IMarkItemReturnedUseCase {
  constructor(private lentItemRepository: ILentItemRepository) {}

  async execute(itemId: string, returnDate?: Date): Promise<ILentItem> {
    const item = await this.lentItemRepository.getById(itemId);
    
    if (!item) {
      throw new Error('Item not found');
    }
    
    if (item.isReturned) {
      throw new Error('Item is already marked as returned');
    }

    return await this.lentItemRepository.markAsReturned(itemId, returnDate);
  }
}