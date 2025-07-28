import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'lent_items',
      columns: [
        { name: 'item_name', type: 'string' },
        { name: 'borrower_name', type: 'string' },
        { name: 'borrower_contact', type: 'string', isOptional: true },
        { name: 'lent_date', type: 'number' }, // Unix timestamp
        { name: 'expected_return_date', type: 'number' }, // Unix timestamp
        { name: 'actual_return_date', type: 'number', isOptional: true }, // Unix timestamp
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'is_returned', type: 'boolean' },
        { name: 'item_type', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});