import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PixabayImage } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ImageCard from '../components/ImageCard';
import { fetchImages } from '../api/pixabay';
import { useTheme } from '../theme'; // 1. Импорт темы

type GalleryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: GalleryScreenNavigationProp;
}

export default function GalleryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme(); // 2. Получение текущего цвета (светлый или темный)
  
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (pageNumber: number) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const data = await fetchImages('popular', pageNumber, '');
      if (pageNumber === 1) setImages(data.hits);
      else setImages(prev => [...prev, ...data.hits]);
    } catch (err) {
      setError('Не вдалося завантажити стрічку.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const handleImagePress = (image: PixabayImage) => {
    // @ts-ignore
    navigation.navigate('ImageDetails', { image });
  };

  const handleLoadMore = () => {
    if (loading || loadingMore || images.length === 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage);
  };

  return (
    // 3. Подмена статического фона на динамический theme.bg
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.surface }]}>
        <Ionicons name="image-outline" size={24} color={theme.text} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Стрічка</Text>
      </View>

      {loading && page === 1 ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={theme.accent} /></View>
      ) : error ? (
        <View style={styles.centered}><Text style={[styles.errorText, { color: theme.like }]}>{error}</Text></View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <ImageCard image={item} onPress={handleImagePress} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 20 }} color={theme.accent} /> : null}
        />
      )}
    </View>
  );
}

// Статические стили для размеров, отступов и шрифтов
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  listContent: { paddingHorizontal: 10, paddingBottom: 20, paddingTop: 10 },
  errorText: { fontSize: 16 },
});