import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createLentItemSchema } from '@/utils/validation';
import { Input } from '../common/Input';
import { DatePicker } from '../common/DatePicker';
import { Button } from '../common/Button';
import { createStyles } from '@/utils/theme';
import { container } from '@/infrastructure/di/container';
import { CreateLentItemDto } from '@/domain/repositories/ILentItemRepository';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createLentItemUseCase = container.getCreateLentItemUseCase();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateLentItemDto>({
    resolver: yupResolver(createLentItemSchema),
    defaultValues: {
      itemName: '',
      borrowerName: '',
      borrowerContact: '',
      lentDate: new Date(),
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes: '',
      itemType: 'lent',
    },
  });

  const onSubmit = async (data: CreateLentItemDto) => {
    try {
      setIsSubmitting(true);
      const newItem = await createLentItemUseCase.execute(data);
      
      // Schedule notification for the item
      try {
        const notificationService = container.getNotificationService();
        await notificationService.scheduleOverdueNotification(newItem);
      } catch (notifError) {
        console.error('Failed to schedule notification:', notifError);
        // Don't fail the whole operation if notification scheduling fails
      }
      
      if (Platform.OS === 'web') {
        console.log('Success: Item has been added successfully!');
      } else {
        Alert.alert('Success', 'Item has been added successfully!');
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
      if (Platform.OS === 'web') {
        window.alert(`Error: ${errorMessage}`);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();
  const itemType = watch('itemType');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Item</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Controller
            control={control}
            name="itemType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    value === 'lent' && styles.typeButtonActive,
                  ]}
                  onPress={() => onChange('lent')}
                >
                  <Ionicons 
                    name="arrow-up-circle-outline" 
                    size={24} 
                    color={value === 'lent' ? '#FFFFFF' : '#64748B'} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    value === 'lent' && styles.typeButtonTextActive,
                  ]}>
                    I'm Lending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    value === 'borrowed' && styles.typeButtonActive,
                  ]}
                  onPress={() => onChange('borrowed')}
                >
                  <Ionicons 
                    name="arrow-down-circle-outline" 
                    size={24} 
                    color={value === 'borrowed' ? '#FFFFFF' : '#64748B'} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    value === 'borrowed' && styles.typeButtonTextActive,
                  ]}>
                    I'm Borrowing
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Controller
            control={control}
            name="itemName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Item Name"
                placeholder={itemType === 'lent' ? "What are you lending?" : "What are you borrowing?"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.itemName?.message}
                autoFocus
              />
            )}
          />

          <Controller
            control={control}
            name="borrowerName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={itemType === 'lent' ? "Borrower Name" : "Lender Name"}
                placeholder={itemType === 'lent' ? "Who is borrowing?" : "Who are you borrowing from?"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.borrowerName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="borrowerContact"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contact (Optional)"
                placeholder="Email or phone number"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.borrowerContact?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="lentDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Lent Date"
                value={value}
                onChange={onChange}
                maximumDate={new Date()}
                error={errors.lentDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="expectedReturnDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Expected Return Date"
                value={value}
                onChange={onChange}
                minimumDate={new Date()}
                error={errors.expectedReturnDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Notes (Optional)"
                placeholder="Any additional details"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.notes?.message}
                multiline
                numberOfLines={3}
                style={styles.notesInput}
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              style={styles.submitButton}
            >
              Add Item
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: theme.spacing.lg,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  submitButton: {
    width: '100%',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.card,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    gap: theme.spacing.xs,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary.purple,
    borderColor: theme.colors.primary.purple,
  },
  typeButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
}));