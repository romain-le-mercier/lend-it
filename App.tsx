import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/presentation/screens/HomeScreen';
import { theme } from '@/constants/theme';
import { useNotifications } from '@/presentation/hooks/useNotifications';

const Stack = createNativeStackNavigator();

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
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}