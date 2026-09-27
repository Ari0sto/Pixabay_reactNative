import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RootStackParamList, BottomTabParamList } from '../types';

import GalleryScreen from '../screens/GalleryScreen';
import ImageDetailsScreen from '../screens/ImageDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Компонент с нижним меню
function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007BFF' }}>
      <Tab.Screen 
        name="Gallery" 
        component={GalleryScreen} 
        options={{ 
          title: 'Галерея',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>
        }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ 
          title: 'Обране',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>❤️</Text>
        }} 
      />
    </Tab.Navigator>
  );
}

// Основной навигатор (Табы + Экран деталей поверх них)
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Прячем верхнюю шапку у MainTabs, так как у каждой вкладки будет своя */}
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ImageDetails" 
          component={ImageDetailsScreen} 
          options={{ title: 'Деталі зображення' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}