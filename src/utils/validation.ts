import * as yup from 'yup';

export const createLentItemSchema = yup.object({
  itemName: yup
    .string()
    .trim()
    .required('Item name is required')
    .min(2, 'Item name must be at least 2 characters'),
  borrowerName: yup
    .string()
    .trim()
    .required('Borrower name is required')
    .min(2, 'Borrower name must be at least 2 characters'),
  borrowerContact: yup.string().trim().optional(),
  lentDate: yup
    .date()
    .required('Lent date is required')
    .max(new Date(), 'Lent date cannot be in the future'),
  expectedReturnDate: yup
    .date()
    .required('Expected return date is required')
    .min(yup.ref('lentDate'), 'Return date must be after lent date'),
  notes: yup.string().trim().optional(),
  itemType: yup.string().oneOf(['lent', 'borrowed'] as const).required('Item type is required'),
});

export const updateLentItemSchema = yup.object({
  itemName: yup
    .string()
    .trim()
    .min(2, 'Item name must be at least 2 characters'),
  borrowerName: yup
    .string()
    .trim()
    .min(2, 'Borrower name must be at least 2 characters'),
  borrowerContact: yup.string().trim().optional(),
  expectedReturnDate: yup.date(),
  notes: yup.string().trim().optional(),
});