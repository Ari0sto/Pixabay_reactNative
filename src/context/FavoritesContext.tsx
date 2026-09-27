import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixabayImage } from '../types';

interface FavoritesContextType {
  favorites: PixabayImage[];
  toggleFavorite: (image: PixabayImage) => void;
  isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

const FAVORITES_KEY = '@favorites_images';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);

  // При запуске приложения загружаем сохраненные данные
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[Context] Помилка завантаження обраного:', error);
    }
  };

  const toggleFavorite = async (image: PixabayImage) => {
    try {
      let updatedFavorites;
      const exists = favorites.some((fav) => fav.id === image.id);

      if (exists) {
        // Удаление из избранного
        updatedFavorites = favorites.filter((fav) => fav.id !== image.id);
        console.log(`[Context] Зображення ${image.id} видалено з обраного`);
      } else {
        // Добавление в избранное (в начало списка)
        updatedFavorites = [image, ...favorites];
        console.log(`[Context] Зображення ${image.id} додано до обраного`);
      }

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('[Context] Помилка збереження:', error);
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};