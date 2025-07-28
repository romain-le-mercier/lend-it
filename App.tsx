import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@/presentation/screens/HomeScreen';
import { ItemDetailScreen } from '@/presentation/screens/ItemDetailScreen';
import { EditItemScreen } from '@/presentation/screens/EditItemScreen';
import { SettingsScreen } from '@/presentation/screens/SettingsScreen';
import { theme } from '@/constants/theme';
import { useNotifications } from '@/presentation/hooks/useNotifications';
import { initI18n } from '@/i18n';
import { useTranslation } from 'react-i18next';

export type RootStackParamList = {
  HomeTabs: undefined;
  ItemDetail: { item: any };
  EditItem: { item: any };
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  
  // Initialize notifications
  useNotifications();
  
  // Initialize i18n
  useEffect(() => {
    initI18n().then(() => {
      setIsI18nInitialized(true);
    });
  }, []);
  
  if (!isI18nInitialized) {
    return null; // Or a loading screen
  }

  const HomeTabs = () => {
    const { t } = useTranslation();
    
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background.card,
            borderTopColor: theme.colors.border.default,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarActiveTintColor: theme.colors.primary.green,
          tabBarInactiveTintColor: theme.colors.text.secondary,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: t('home.title'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t('settings.title'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

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
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
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