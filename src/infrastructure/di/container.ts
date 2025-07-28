import { LentItemRepository } from '@/data/repositories/LentItemRepository';
import { CreateLentItemUseCase } from '@/domain/usecases/CreateLentItemUseCase';
import { GetLentItemsUseCase } from '@/domain/usecases/GetLentItemsUseCase';
import { MarkItemReturnedUseCase } from '@/domain/usecases/MarkItemReturnedUseCase';
import { NotificationService } from '@/infrastructure/notifications/NotificationService';

class DIContainer {
  private static instance: DIContainer;
  
  private lentItemRepository: LentItemRepository;
  private createLentItemUseCase: CreateLentItemUseCase;
  private getLentItemsUseCase: GetLentItemsUseCase;
  private markItemReturnedUseCase: MarkItemReturnedUseCase;
  private notificationService: NotificationService;

  private constructor() {
    // Initialize repositories
    this.lentItemRepository = new LentItemRepository();

    // Initialize services
    this.notificationService = new NotificationService();

    // Initialize use cases
    this.createLentItemUseCase = new CreateLentItemUseCase(this.lentItemRepository);
    this.getLentItemsUseCase = new GetLentItemsUseCase(this.lentItemRepository);
    this.markItemReturnedUseCase = new MarkItemReturnedUseCase(this.lentItemRepository);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repository getters
  getLentItemRepository(): LentItemRepository {
    return this.lentItemRepository;
  }

  // Use case getters
  getCreateLentItemUseCase(): CreateLentItemUseCase {
    return this.createLentItemUseCase;
  }

  getGetLentItemsUseCase(): GetLentItemsUseCase {
    return this.getLentItemsUseCase;
  }

  getMarkItemReturnedUseCase(): MarkItemReturnedUseCase {
    return this.markItemReturnedUseCase;
  }

  // Service getters
  getNotificationService(): NotificationService {
    return this.notificationService;
  }
}

export const container = DIContainer.getInstance();