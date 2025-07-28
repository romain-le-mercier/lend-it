import { ILentItem } from '../entities/LentItem';
import { ILentItemRepository, CreateLentItemDto } from '../repositories/ILentItemRepository';

export interface ICreateLentItemUseCase {
  execute(dto: CreateLentItemDto): Promise<ILentItem>;
}

export class CreateLentItemUseCase implements ICreateLentItemUseCase {
  constructor(private lentItemRepository: ILentItemRepository) {}

  async execute(dto: CreateLentItemDto): Promise<ILentItem> {
    // Validation
    if (!dto.itemName?.trim()) {
      throw new Error('Item name is required');
    }
    if (!dto.borrowerName?.trim()) {
      throw new Error('Borrower name is required');
    }
    if (!dto.lentDate) {
      throw new Error('Lent date is required');
    }
    if (!dto.expectedReturnDate) {
      throw new Error('Expected return date is required');
    }
    if (dto.expectedReturnDate < dto.lentDate) {
      throw new Error('Expected return date must be after lent date');
    }

    // Create the item
    return await this.lentItemRepository.create({
      ...dto,
      itemName: dto.itemName.trim(),
      borrowerName: dto.borrowerName.trim(),
      borrowerContact: dto.borrowerContact?.trim(),
      notes: dto.notes?.trim(),
    });
  }
}