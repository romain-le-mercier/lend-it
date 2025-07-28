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
import { updateLentItemSchema } from '@/utils/validation';
import { Input } from '../components/common/Input';
import { DatePicker } from '../components/common/DatePicker';
import { Button } from '../components/common/Button';
import { createStyles } from '@/utils/theme';
import { container } from '@/infrastructure/di/container';
import { UpdateLentItemDto } from '@/domain/repositories/ILentItemRepository';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ILentItem } from '@/domain/entities/LentItem';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
  Home: undefined;
  ItemDetail: { item: ILentItem };
  EditItem: { item: ILentItem };
};

type EditItemScreenRouteProp = RouteProp<RootStackParamList, 'EditItem'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EditItemScreen: React.FC = () => {
  const route = useRoute<EditItemScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { item } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateLentItemUseCase = container.getUpdateLentItemUseCase();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLentItemDto>({
    resolver: yupResolver(updateLentItemSchema),
    defaultValues: {
      itemName: item.itemName,
      borrowerName: item.borrowerName,
      borrowerContact: item.borrowerContact || '',
      expectedReturnDate: item.expectedReturnDate,
      notes: item.notes || '',
    },
  });

  const onSubmit = async (data: UpdateLentItemDto) => {
    try {
      setIsSubmitting(true);
      // Remove empty strings
      const updateData: UpdateLentItemDto = {
        itemName: data.itemName,
        borrowerName: data.borrowerName,
        borrowerContact: data.borrowerContact || undefined,
        expectedReturnDate: data.expectedReturnDate,
        notes: data.notes || undefined,
      };
      
      await updateLentItemUseCase.execute(item.id, updateData);
      
      if (Platform.OS === 'web') {
        console.log(t('common.success') + ': ' + t('messages.itemUpdated'));
      } else {
        Alert.alert(t('common.success'), t('messages.itemUpdated'));
      }
      navigation.goBack();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('messages.errorGeneric');
      if (Platform.OS === 'web') {
        window.alert(`${t('common.error')}: ${errorMessage}`);
      } else {
        Alert.alert(t('common.error'), errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('itemForm.editTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.typeIndicator}>
            <Ionicons 
              name={item.itemType === 'lent' ? 'arrow-up-circle' : 'arrow-down-circle'} 
              size={24} 
              color={item.itemType === 'lent' ? '#22C55E' : '#A855F7'} 
            />
            <Text style={styles.typeText}>
              {item.itemType === 'lent' ? t('itemForm.itemLent') : t('itemForm.itemBorrowed')}
            </Text>
          </View>

          <Controller
            control={control}
            name="itemName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('itemForm.fields.itemName')}
                placeholder={t('itemForm.fields.itemNamePlaceholder', { action: item.itemType === 'lent' ? t('itemForm.lending').toLowerCase() : t('itemForm.borrowing').toLowerCase() })}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.itemName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="borrowerName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={item.itemType === 'lent' ? t('itemForm.fields.borrowerName') : t('itemForm.fields.lenderName')}
                placeholder={item.itemType === 'lent' ? t('itemForm.fields.borrowerPlaceholder') : t('itemForm.fields.lenderPlaceholder')}
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
                label={t('itemForm.fields.contact')}
                placeholder={t('itemForm.fields.contactPlaceholder')}
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
            name="expectedReturnDate"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label={t('itemForm.fields.expectedReturn')}
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
                label={t('itemForm.fields.notes')}
                placeholder={t('itemForm.fields.notesPlaceholder')}
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
              variant="secondary"
              onPress={handleCancel}
              style={styles.button}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              style={styles.button}
            >
              {t('itemForm.actions.saveChanges')}
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
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
  },
  typeText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
}));