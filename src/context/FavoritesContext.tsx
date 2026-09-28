import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixabayImage } from '../types';

const FAVORITES_KEY = '@favorites_data';

interface FavoritesContextType {
  favorites: PixabayImage[];
  toggleFavorite: (image: PixabayImage) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);

  // Загрузка избранного из AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Помилка завантаження обраного', error);
      }
    };
    loadFavorites();
  }, []);

  // Сохранение избранного в AsyncStorage при изменении
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Помилка збереження обраного', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const toggleFavorite = (image: PixabayImage) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === image.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== image.id); // Удаляем
      } else {
        return [...prev, image]; // Добавляем
      }
    });
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

// Хук для использования контекста избранного
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites повинен використовуватися всередині FavoritesProvider');
  }
  return context;
};