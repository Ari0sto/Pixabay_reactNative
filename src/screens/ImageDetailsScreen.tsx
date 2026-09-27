import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { FavoritesContext } from '../context/FavoritesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen({ route }: Props) {
  // Получаем переданное изображение из параметров навигации
  const { image } = route.params;

  // LOG
  console.log('Дані зображення:', { 
    webformat: image.webformatURL, 
    large: image.largeImageURL, 
    preview: image.previewURL 
  });
  
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(image.id);

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image.webformatURL || image.largeImageURL || image.previewURL }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.authorLabel}>Автор фотографії</Text>
            <Text style={styles.authorName}>{image.user}</Text>
          </View>
          
          {/* Кнопка "В избранное" */}
          <TouchableOpacity 
            style={[styles.favoriteBtn, favorite && styles.favoriteBtnActive]} 
            onPress={() => toggleFavorite(image)}
          >
            <Text style={[styles.favoriteBtnText, favorite && styles.favoriteBtnTextActive]}>
              {favorite ? '❤️ Збережено' : '🤍 В обране'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Статистика */}
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👁</Text>
            <Text style={styles.statValue}>{image.views}</Text>
            <Text style={styles.statLabel}>Переглядів</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statValue}>{image.likes}</Text>
            <Text style={styles.statLabel}>Лайків</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⬇️</Text>
            <Text style={styles.statValue}>{image.downloads || 0}</Text>
            <Text style={styles.statLabel}>Завантажень</Text>
          </View>
        </View>

        {/* Теги */}
        <View style={styles.tagsContainer}>
          {image.tags.split(',').map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>#{tag.trim()}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  favoriteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  favoriteBtnActive: {
    backgroundColor: '#ffeef0',
  },
  favoriteBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  favoriteBtnTextActive: {
    color: '#e0245e',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tagText: {
    color: '#555',
    fontSize: 14,
  },
});