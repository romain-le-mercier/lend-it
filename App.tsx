import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/presentation/screens/HomeScreen';
import { ItemDetailScreen } from '@/presentation/screens/ItemDetailScreen';
import { EditItemScreen } from '@/presentation/screens/EditItemScreen';
import { theme } from '@/constants/theme';
import { useNotifications } from '@/presentation/hooks/useNotifications';

export type RootStackParamList = {
  Home: undefined;
  ItemDetail: { item: any };
  EditItem: { item: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Initialize notifications
  useNotifications();

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.background.dark} />
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: theme.colors.primary.green,
            background: theme.colors.background.dark,
            card: theme.colors.background.card,
            text: theme.colors.text.primary,
            border: theme.colors.border.default,
            notification: theme.colors.primary.purple,
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background.dark,
            },
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen 
            name="ItemDetail" 
            component={ItemDetailScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="EditItem" 
            component={EditItemScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}