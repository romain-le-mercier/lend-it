import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class LentItemModel extends Model {
  static table = 'lent_items';

  @field('item_name') itemName!: string;
  @field('borrower_name') borrowerName!: string;
  @field('borrower_contact') borrowerContact?: string;
  @field('lent_date') lentDate!: number;
  @field('expected_return_date') expectedReturnDate!: number;
  @field('actual_return_date') actualReturnDate?: number;
  @field('notes') notes?: string;
  @field('is_returned') isReturned!: boolean;
  @field('item_type') itemType!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  async markAsReturned(returnDate: Date = new Date()) {
    await this.update((item) => {
      item.isReturned = true;
      item.actualReturnDate = returnDate.getTime();
    });
  }

  isOverdue(): boolean {
    if (this.isReturned) return false;
    return Date.now() > this.expectedReturnDate;
  }

  isDueSoon(daysThreshold: number = 3): boolean {
    if (this.isReturned) return false;
    const now = Date.now();
    const timeDiff = this.expectedReturnDate - now;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= daysThreshold && daysDiff >= 0;
  }

  getStatus(): 'returned' | 'overdue' | 'due_soon' | 'active' {
    if (this.isReturned) return 'returned';
    if (this.isOverdue()) return 'overdue';
    if (this.isDueSoon()) return 'due_soon';
    return 'active';
  }
}