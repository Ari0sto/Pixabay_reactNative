import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PixabayImage } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface ImageCardProps {
  image: PixabayImage;
  onPress: (image: PixabayImage) => void;
}

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const cardWidth = (screenWidth - 30) / numColumns; 

export default function ImageCard({ image, onPress }: ImageCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Проверка, есть ли эта картинка в избранном
  const favorite = isFavorite(image.id);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(image)} activeOpacity={0.8}>
      <Image 
        source={{ uri: image.webformatURL || image.previewURL }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      {/* Кнопка "В избранное" теперь вызывает функцию из Context */}
      <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(image)}>
        <Ionicons 
          name={favorite ? "heart" : "heart-outline"} 
          size={24} 
          color={favorite ? "#e0245e" : "#fff"} 
        />
      </TouchableOpacity>

      {/* Оверлей со статистикой */}
      <View style={styles.statsOverlay}>
        <View style={styles.statItem}>
          <Ionicons name="eye" size={14} color="#fff" />
          <Text style={styles.statsText}>{image.views}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={14} color="#fff" />
          <Text style={styles.statsText}>{image.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth, 
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e1e4e8',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, 
  },
  statsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});