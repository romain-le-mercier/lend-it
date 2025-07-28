import { LentItem } from '@/domain/entities/LentItem';

describe('LentItem Entity', () => {
  const createTestItem = (overrides?: Partial<LentItem>) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return new LentItem(
      '1',
      'Test Book',
      'John Doe',
      now,
      tomorrow,
      false,
      now,
      now,
      undefined,
      undefined,
      undefined,
      ...overrides
    );
  };

  describe('markAsReturned', () => {
    it('should mark item as returned with current date', () => {
      const item = createTestItem();
      const returnDate = new Date();
      
      item.markAsReturned(returnDate);

      expect(item.isReturned).toBe(true);
      expect(item.actualReturnDate).toEqual(returnDate);
      expect(item.updatedAt.getTime()).toBeGreaterThanOrEqual(returnDate.getTime());
    });

    it('should use current date if no date provided', () => {
      const item = createTestItem();
      const beforeMark = new Date();
      
      item.markAsReturned();

      expect(item.isReturned).toBe(true);
      expect(item.actualReturnDate).toBeDefined();
      expect(item.actualReturnDate!.getTime()).toBeGreaterThanOrEqual(beforeMark.getTime());
    });
  });

  describe('isOverdue', () => {
    it('should return false for returned items', () => {
      const item = createTestItem();
      item.markAsReturned();

      expect(item.isOverdue()).toBe(false);
    });

    it('should return true for items past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = createTestItem();
      item.expectedReturnDate = yesterday;

      expect(item.isOverdue()).toBe(true);
    });

    it('should return false for items not yet due', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const item = createTestItem();
      item.expectedReturnDate = tomorrow;

      expect(item.isOverdue()).toBe(false);
    });
  });

  describe('isDueSoon', () => {
    it('should return false for returned items', () => {
      const item = createTestItem();
      item.markAsReturned();

      expect(item.isDueSoon()).toBe(false);
    });

    it('should return true for items due within threshold', () => {
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
      
      const item = createTestItem();
      item.expectedReturnDate = twoDaysFromNow;

      expect(item.isDueSoon(3)).toBe(true);
    });

    it('should return false for overdue items', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = createTestItem();
      item.expectedReturnDate = yesterday;

      expect(item.isDueSoon()).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should return "returned" for returned items', () => {
      const item = createTestItem();
      item.markAsReturned();

      expect(item.getStatus()).toBe('returned');
    });

    it('should return "overdue" for overdue items', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = createTestItem();
      item.expectedReturnDate = yesterday;

      expect(item.getStatus()).toBe('overdue');
    });

    it('should return "due_soon" for items due soon', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const item = createTestItem();
      item.expectedReturnDate = tomorrow;

      expect(item.getStatus()).toBe('due_soon');
    });

    it('should return "active" for other items', () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const item = createTestItem();
      item.expectedReturnDate = nextWeek;

      expect(item.getStatus()).toBe('active');
    });
  });
});