# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lending Tracker is a cross-platform React Native application for tracking items lent to friends. It features a dark theme UI with green/purple accents, local data storage with WatermelonDB, push notifications, and follows clean architecture principles with SOLID patterns.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Run on web
npm run web

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Type checking
npm run typecheck

# Lint code
npm run lint
```

### Testing Commands
```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Architecture

### Clean Architecture Structure
```
src/
├── presentation/          # UI Layer
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Generic components (Button, Input, etc.)
│   │   └── screens/     # Screen-specific components
│   ├── screens/         # Main screen components
│   ├── hooks/           # Custom React hooks
│   └── navigation/      # Navigation configuration
├── domain/              # Business Logic Layer
│   ├── entities/        # Core business entities
│   ├── usecases/        # Application use cases
│   └── repositories/    # Repository interfaces
├── data/                # Data Layer
│   ├── models/          # WatermelonDB models
│   └── repositories/    # Repository implementations
├── infrastructure/      # External Services
│   ├── database/        # Database configuration
│   ├── notifications/   # Push notification service
│   └── di/             # Dependency injection container
├── constants/           # App constants and theme
└── utils/              # Utility functions
```

### Key Architectural Patterns
- **Repository Pattern**: All data access goes through repositories
- **Use Cases**: Business logic encapsulated in use cases
- **Dependency Injection**: DIContainer manages dependencies
- **Clean Architecture**: Strict layer separation (presentation → domain ← data)

## Database Schema

Using WatermelonDB with the following main entity:

```typescript
interface LentItem {
  id: string;
  itemName: string;
  borrowerName: string;
  borrowerContact?: string;
  lentDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
  notes?: string;
  isReturned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Core Features Implementation

### 1. Item Management (AddItemForm)
- Form validation using react-hook-form + yup
- Date pickers for lent and return dates
- Automatic notification scheduling on creation

### 2. Item Listing (HomeScreen)
- Search functionality
- Filter options: all, active, overdue, returned
- Sort options: due date, borrower, item name, status
- Pull-to-refresh
- Empty states

### 3. Return Management
- Confirmation dialog before marking returned
- Optimistic updates
- Notification cancellation on return

### 4. Notifications
- Automatic scheduling 1 day after due date
- Weekly reminders for overdue items
- Using Expo Notifications API

## Testing Strategy

### Test Structure
```
tests/
├── unit/           # Unit tests for business logic
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

### Running Tests
- Jest for unit testing
- React Native Testing Library for components
- Coverage target: 80% for critical paths

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Follow SOLID principles
- Use functional components with hooks
- Implement proper error boundaries

### Component Patterns
```typescript
// Standard component structure
interface Props {
  // Define all props with proper types
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks
  // 2. Event handlers
  // 3. Render helpers
  // 4. Return JSX
};
```

### State Management
- React Context for global state (if needed)
- Custom hooks for business logic
- useReducer for complex state
- Local state preferred when possible

### Error Handling
- Try/catch in async operations
- User-friendly error messages
- Proper error logging
- Graceful degradation

## Important Implementation Details

### Theme System
- Dark mode only
- Colors: Green (#22C55E) primary, Purple (#A855F7) accent
- Located in `src/constants/theme.ts`
- Use `createStyles` helper for consistent styling

### Navigation
- React Navigation v6
- Stack navigator for main flow
- Deep linking support for notifications

### Performance Considerations
- React.memo for expensive components
- FlatList for large lists
- Proper key props
- Image optimization

### Security
- No external API dependencies
- Local data storage only
- Input validation on all forms
- Sanitization of user inputs

## Troubleshooting Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **TypeScript errors**: Run `npm run typecheck`
3. **Database errors**: Check WatermelonDB migrations
4. **Notification permissions**: Check device settings
5. **Docker port conflicts**: Check port-detector.sh output

## Future Enhancements

When adding new features:
1. Follow the existing architecture patterns
2. Add proper TypeScript types
3. Write tests for business logic
4. Update this documentation
5. Consider performance impact