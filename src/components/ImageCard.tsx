import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, View, Text } from 'react-native';
import { PixabayImage } from '../types';
import { FavoritesContext } from '../context/FavoritesContext';

interface ImageCardProps {
  image: PixabayImage;
  onPress: (image: PixabayImage) => void;
}

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const cardWidth = (screenWidth - 30) / numColumns; 

export default function ImageCard({ image, onPress }: ImageCardProps) {
  // Подключаем контекст
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(image.id);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(image)} activeOpacity={0.8}>
      <Image 
        source={{ uri: image.webformatURL || image.previewURL }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      {/* Кнопка лайка поверх картинки */}
      <TouchableOpacity 
        style={styles.likeButton} 
        onPress={() => toggleFavorite(image)}
      >
        <Text style={styles.likeIcon}>{favorite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      <View style={styles.statsOverlay}>
        <Text style={styles.statsText}>👁 {image.views}</Text>
        <Text style={styles.statsText}>❤️ {image.likes}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth, 
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e1e4e8',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  likeIcon: {
    fontSize: 16,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});