import { CreateLentItemUseCase } from '@/domain/usecases/CreateLentItemUseCase';
import { ILentItemRepository, CreateLentItemDto } from '@/domain/repositories/ILentItemRepository';
import { LentItem } from '@/domain/entities/LentItem';

describe('CreateLentItemUseCase', () => {
  let mockRepository: jest.Mocked<ILentItemRepository>;
  let useCase: CreateLentItemUseCase;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByBorrower: jest.fn(),
      getOverdueItems: jest.fn(),
      getActiveItems: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      markAsReturned: jest.fn(),
    };

    useCase = new CreateLentItemUseCase(mockRepository);
  });

  const createValidDto = (): CreateLentItemDto => ({
    itemName: 'Test Book',
    borrowerName: 'John Doe',
    lentDate: new Date(),
    expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: 'Test note',
  });

  it('should create a lent item with valid data', async () => {
    const dto = createValidDto();
    const expectedItem = new LentItem(
      '1',
      dto.itemName,
      dto.borrowerName,
      dto.lentDate,
      dto.expectedReturnDate,
      false,
      new Date(),
      new Date()
    );

    mockRepository.create.mockResolvedValue(expectedItem);

    const result = await useCase.execute(dto);

    expect(mockRepository.create).toHaveBeenCalledWith({
      ...dto,
      itemName: dto.itemName.trim(),
      borrowerName: dto.borrowerName.trim(),
      notes: dto.notes?.trim(),
    });
    expect(result).toEqual(expectedItem);
  });

  it('should trim whitespace from string fields', async () => {
    const dto: CreateLentItemDto = {
      itemName: '  Test Book  ',
      borrowerName: '  John Doe  ',
      borrowerContact: '  john@example.com  ',
      notes: '  Test note  ',
      lentDate: new Date(),
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const expectedItem = new LentItem(
      '1',
      'Test Book',
      'John Doe',
      dto.lentDate,
      dto.expectedReturnDate,
      false,
      new Date(),
      new Date()
    );

    mockRepository.create.mockResolvedValue(expectedItem);

    await useCase.execute(dto);

    expect(mockRepository.create).toHaveBeenCalledWith({
      ...dto,
      itemName: 'Test Book',
      borrowerName: 'John Doe',
      borrowerContact: 'john@example.com',
      notes: 'Test note',
    });
  });

  it('should throw error if item name is empty', async () => {
    const dto = createValidDto();
    dto.itemName = '';

    await expect(useCase.execute(dto)).rejects.toThrow('Item name is required');
  });

  it('should throw error if borrower name is empty', async () => {
    const dto = createValidDto();
    dto.borrowerName = '';

    await expect(useCase.execute(dto)).rejects.toThrow('Borrower name is required');
  });

  it('should throw error if lent date is missing', async () => {
    const dto = createValidDto();
    (dto as any).lentDate = undefined;

    await expect(useCase.execute(dto)).rejects.toThrow('Lent date is required');
  });

  it('should throw error if expected return date is missing', async () => {
    const dto = createValidDto();
    (dto as any).expectedReturnDate = undefined;

    await expect(useCase.execute(dto)).rejects.toThrow('Expected return date is required');
  });

  it('should throw error if expected return date is before lent date', async () => {
    const dto = createValidDto();
    dto.expectedReturnDate = new Date(dto.lentDate.getTime() - 24 * 60 * 60 * 1000);

    await expect(useCase.execute(dto)).rejects.toThrow('Expected return date must be after lent date');
  });
});