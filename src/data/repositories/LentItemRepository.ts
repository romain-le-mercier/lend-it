import { Q } from '@nozbe/watermelondb';
import { database } from '@/infrastructure/database/database';
import { ILentItem, LentItem, ItemType } from '@/domain/entities/LentItem';
import {
  ILentItemRepository,
  CreateLentItemDto,
  UpdateLentItemDto,
} from '@/domain/repositories/ILentItemRepository';
import LentItemModel from '../models/LentItemModel';
import { v4 as uuidv4 } from 'uuid';

export class LentItemRepository implements ILentItemRepository {
  private collection = database.get<LentItemModel>('lent_items');

  private modelToEntity(model: LentItemModel): ILentItem {
    return new LentItem(
      model.id,
      model.itemName,
      model.borrowerName,
      new Date(model.lentDate),
      new Date(model.expectedReturnDate),
      model.isReturned,
      model.itemType as ItemType,
      new Date(model.createdAt),
      new Date(model.updatedAt),
      model.borrowerContact,
      model.actualReturnDate ? new Date(model.actualReturnDate) : undefined,
      model.notes
    );
  }

  async getAll(): Promise<ILentItem[]> {
    const models = await this.collection.query().fetch();
    return models.map(this.modelToEntity);
  }

  async getById(id: string): Promise<ILentItem | null> {
    try {
      const model = await this.collection.find(id);
      return this.modelToEntity(model);
    } catch {
      return null;
    }
  }

  async getByBorrower(borrowerName: string): Promise<ILentItem[]> {
    const models = await this.collection
      .query(Q.where('borrower_name', borrowerName))
      .fetch();
    return models.map(this.modelToEntity);
  }

  async getOverdueItems(): Promise<ILentItem[]> {
    const now = Date.now();
    const models = await this.collection
      .query(
        Q.and(
          Q.where('is_returned', false),
          Q.where('expected_return_date', Q.lt(now))
        )
      )
      .fetch();
    return models.map(this.modelToEntity);
  }

  async getActiveItems(): Promise<ILentItem[]> {
    const models = await this.collection
      .query(Q.where('is_returned', false))
      .fetch();
    return models.map(this.modelToEntity);
  }

  async create(dto: CreateLentItemDto): Promise<ILentItem> {
    const model = await database.write(async () => {
      return await this.collection.create((item) => {
        item._raw.id = uuidv4();
        item.itemName = dto.itemName;
        item.borrowerName = dto.borrowerName;
        item.borrowerContact = dto.borrowerContact;
        item.lentDate = dto.lentDate.getTime();
        item.expectedReturnDate = dto.expectedReturnDate.getTime();
        item.itemType = dto.itemType;
        item.notes = dto.notes;
        item.isReturned = false;
      });
    });
    return this.modelToEntity(model);
  }

  async update(id: string, dto: UpdateLentItemDto): Promise<ILentItem> {
    const model = await database.write(async () => {
      const item = await this.collection.find(id);
      return await item.update((record) => {
        if (dto.itemName !== undefined) record.itemName = dto.itemName;
        if (dto.borrowerName !== undefined) record.borrowerName = dto.borrowerName;
        if (dto.borrowerContact !== undefined) record.borrowerContact = dto.borrowerContact;
        if (dto.expectedReturnDate !== undefined) {
          record.expectedReturnDate = dto.expectedReturnDate.getTime();
        }
        if (dto.notes !== undefined) record.notes = dto.notes;
        if (dto.isReturned !== undefined) record.isReturned = dto.isReturned;
        if (dto.actualReturnDate !== undefined) {
          record.actualReturnDate = dto.actualReturnDate.getTime();
        }
      });
    });
    return this.modelToEntity(model);
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const item = await this.collection.find(id);
      await item.destroyPermanently();
    });
  }

  async markAsReturned(id: string, returnDate?: Date): Promise<ILentItem> {
    console.log('Repository: markAsReturned called with id:', id);
    const model = await database.write(async () => {
      const item = await this.collection.find(id);
      console.log('Repository: Found item:', item.itemName, 'isReturned:', item.isReturned);
      return await item.update((record) => {
        record.isReturned = true;
        record.actualReturnDate = (returnDate || new Date()).getTime();
        console.log('Repository: Updated item, isReturned now:', record.isReturned);
      });
    });
    const entity = this.modelToEntity(model);
    console.log('Repository: Returning entity, isReturned:', entity.isReturned);
    return entity;
  }
}