import { Database } from '@nozbe/watermelondb';
import { schema } from '@/data/models/schema';
import models from '@/data/models';
import { Platform } from 'react-native';

let adapter;

if (Platform.OS === 'web') {
  // Use LokiJS adapter for web
  const LokiJSAdapter = require('@nozbe/watermelondb/adapters/lokijs').default;
  adapter = new LokiJSAdapter({
    dbName: 'lending_tracker',
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  });
} else {
  // Use SQLite adapter for mobile
  const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
  adapter = new SQLiteAdapter({
    dbName: 'lending_tracker',
    schema,
    jsi: Platform.OS === 'ios',
    onSetUpError: (error) => {
      console.error('Database setup error:', error);
    },
  });
}

export const database = new Database({
  adapter,
  modelClasses: models,
});