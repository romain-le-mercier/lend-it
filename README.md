# Lending Tracker

A cross-platform mobile and web application for tracking items you've lent to friends. Built with React Native, TypeScript, and following clean architecture principles.

## Features

- **Item Management**: Add items with borrower details and expected return dates
- **Smart Tracking**: Visual status indicators for returned, overdue, and due soon items
- **Search & Filter**: Find items quickly with search and filter options
- **Sort Options**: Sort by due date, borrower name, item name, or status
- **Return Management**: Mark items as returned with confirmation
- **Push Notifications**: Get reminded when items are overdue
- **Dark Theme**: Beautiful dark mode UI with green/purple accents
- **Cross-Platform**: Works on iOS, Android, and Web

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── presentation/     # UI Components, Screens, Hooks
├── domain/          # Business Logic, Entities, Use Cases
├── data/            # Data Sources, Repositories Implementation
└── infrastructure/  # External Services, Database, Notifications
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lending-tracker
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Option 1: Local Development

For Web:
```bash
npm run web
```

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

#### Option 2: Docker Development

The application includes automatic port detection starting from port 3847:

```bash
# Run with Docker Compose
npm run docker:dev

# Or manually
docker-compose -f docker/docker-compose.yml up
```

The port detector will automatically find an available port starting from 3847 and configure the application accordingly.

#### Option 3: Docker Production

Build and run the production container:

```bash
# Build the Docker image
npm run docker:build

# Run in production mode
npm run docker:prod
```

### Accessing the Application

- **Web**: Open http://localhost:3847 (or the port shown in console)
- **Mobile**: Use the Expo Go app and scan the QR code
- **Development**: The app will hot-reload on file changes

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run web` - Start the web version
- `npm run ios` - Start iOS simulator
- `npm run android` - Start Android emulator
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run build:web` - Build for web production

### Project Structure

```
lending-tracker/
├── src/
│   ├── presentation/         # UI Layer
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # Screen components
│   │   └── hooks/            # Custom React hooks
│   ├── domain/               # Business Logic Layer
│   │   ├── entities/         # Core business entities
│   │   ├── usecases/         # Application use cases
│   │   └── repositories/     # Repository interfaces
│   ├── data/                 # Data Layer
│   │   ├── models/           # Database models
│   │   └── repositories/     # Repository implementations
│   ├── infrastructure/       # External Services
│   │   ├── database/         # Database configuration
│   │   └── notifications/    # Push notification service
│   ├── constants/            # App constants and theme
│   └── utils/                # Utility functions
├── docker/                   # Docker configuration
│   ├── Dockerfile            # Multi-stage Dockerfile
│   ├── docker-compose.yml    # Development compose
│   └── port-detector.sh      # Port detection script
└── tests/                    # Test files
```

### Database

The app uses **WatermelonDB** for local data storage with the following schema:

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

### Notifications

Push notifications are implemented using Expo Notifications:
- Automatic reminders 1 day after due date
- Weekly reminders for overdue items
- In-app notification management

## Testing

Run the test suite:

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Troubleshooting

### Port Already in Use

The application automatically detects available ports starting from 3847. If you encounter port issues:

1. Check the console output for the assigned port
2. The port detector will find the next available port automatically
3. Check `.env` file for the PORT variable

### Database Issues

If you encounter database errors:

1. Clear the app data/cache
2. Reinstall the app
3. Check console for specific WatermelonDB errors

### Notification Permissions

For notifications to work:
- iOS: Accept notification permissions when prompted
- Android: Notifications are enabled by default
- Web: Not supported (notifications are mobile-only)

## Contributing

1. Follow the existing code structure and patterns
2. Maintain SOLID principles
3. Write tests for new features
4. Update documentation as needed
5. Use conventional commit messages

## License

This project is private and proprietary.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using React Native, TypeScript, and Clean Architecture