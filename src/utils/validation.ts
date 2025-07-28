import * as yup from 'yup';
import { i18n } from '@/i18n';

export const createLentItemSchema = yup.object({
  itemName: yup
    .string()
    .trim()
    .required(() => i18n.t('validation.required', { field: i18n.t('itemForm.fields.itemName') }))
    .min(2, () => i18n.t('validation.minLength', { field: i18n.t('itemForm.fields.itemName'), min: 2 })),
  borrowerName: yup
    .string()
    .trim()
    .required(() => i18n.t('validation.required', { field: i18n.t('itemForm.fields.borrowerName') }))
    .min(2, () => i18n.t('validation.minLength', { field: i18n.t('itemForm.fields.borrowerName'), min: 2 })),
  borrowerContact: yup.string().trim().optional(),
  lentDate: yup
    .date()
    .required(() => i18n.t('validation.required', { field: i18n.t('itemForm.fields.lentDate') }))
    .test(
      'not-future',
      () => i18n.t('validation.futureDate', { field: i18n.t('itemForm.fields.lentDate') }),
      function(value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return value <= today;
      }
    ),
  expectedReturnDate: yup
    .date()
    .required(() => i18n.t('validation.required', { field: i18n.t('itemForm.fields.expectedReturn') }))
    .min(yup.ref('lentDate'), () => i18n.t('validation.afterDate', { field: i18n.t('itemForm.fields.expectedReturn'), date: i18n.t('itemForm.fields.lentDate') })),
  notes: yup.string().trim().optional(),
  itemType: yup.string().oneOf(['lent', 'borrowed'] as const).required(() => i18n.t('validation.required', { field: 'Item type' })),
});

export const updateLentItemSchema = yup.object({
  itemName: yup
    .string()
    .trim()
    .min(2, () => i18n.t('validation.minLength', { field: i18n.t('itemForm.fields.itemName'), min: 2 })),
  borrowerName: yup
    .string()
    .trim()
    .min(2, () => i18n.t('validation.minLength', { field: i18n.t('itemForm.fields.borrowerName'), min: 2 })),
  borrowerContact: yup.string().trim().optional(),
  expectedReturnDate: yup.date(),
  notes: yup.string().trim().optional(),
});