import { ILentItem } from '../entities/LentItem';
import { ILentItemRepository, UpdateLentItemDto } from '../repositories/ILentItemRepository';

export class UpdateLentItemUseCase {
  constructor(private lentItemRepository: ILentItemRepository) {}

  async execute(id: string, data: UpdateLentItemDto): Promise<ILentItem> {
    const updatedItem = await this.lentItemRepository.update(id, data);
    return updatedItem;
  }
}