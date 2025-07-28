export type ItemType = 'lent' | 'borrowed';

export interface ILentItem {
  id: string;
  itemName: string;
  borrowerName: string;
  borrowerContact?: string;
  lentDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  notes?: string;
  isReturned: boolean;
  itemType: ItemType;
  createdAt: Date;
  updatedAt: Date;
}

export class LentItem implements ILentItem {
  constructor(
    public id: string,
    public itemName: string,
    public borrowerName: string,
    public lentDate: Date,
    public expectedReturnDate: Date,
    public isReturned: boolean = false,
    public itemType: ItemType = 'lent',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public borrowerContact?: string,
    public actualReturnDate?: Date,
    public notes?: string
  ) {}

  markAsReturned(returnDate: Date = new Date()): void {
    this.isReturned = true;
    this.actualReturnDate = returnDate;
    this.updatedAt = new Date();
  }

  isOverdue(): boolean {
    if (this.isReturned) return false;
    return new Date() > this.expectedReturnDate;
  }

  isDueSoon(daysThreshold: number = 3): boolean {
    if (this.isReturned) return false;
    const now = new Date();
    const timeDiff = this.expectedReturnDate.getTime() - now.getTime();
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