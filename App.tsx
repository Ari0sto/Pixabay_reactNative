import React from 'react';
import AppNavigator from './src/navigation/AppNavigation';
import { FavoritesProvider } from './src/context/FavoritesContext';

export default function App() {
  return (
    // Оборачиваем навигатор в провайдер, чтобы данные были доступны на всех экранах
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  );
}