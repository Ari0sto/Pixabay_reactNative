import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PixabayImage } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ImageCard from '../components/ImageCard';
import { fetchImages } from '../api/pixabay';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [images, setImages] = useState<PixabayImage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Поиск по текстовому запросу
  const handleTextSearch = () => {
    setCategory(''); // Сброс
    setQuery(inputValue); // поиск
  };

  // выбор категории
  const handleCategorySelect = (newCategory: string) => {
    setInputValue(''); // очитска поля ввода
    setQuery(''); // сброс запрос для API
    setCategory(newCategory); // Запуск поиска по категории
  };

  const loadData = async (pageNumber: number, isNewSearch: boolean) => {
    if (!query && !category) {
      setImages([]);
      return;
    }

    if (isNewSearch) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const data = await fetchImages(query, pageNumber, category);
      if (isNewSearch) setImages(data.hits);
      else setImages(prev => [...prev, ...data.hits]);
    } catch (err) {
      setError('Не вдалося завантажити зображення.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadData(1, true);
  }, [query, category]);

  const handleImagePress = (image: PixabayImage) => {
    navigation.navigate('ImageDetails', { image });
  };

  const handleLoadMore = () => {
    if (loading || loadingMore || images.length === 0) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, false);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.bg },
      ]}
    >
      <SearchBar 
        value={inputValue} 
        onChangeText={setInputValue} 
        onSearch={handleTextSearch} 
      />
      
      <CategoryList 
        selectedCategory={category} 
        onSelect={handleCategorySelect} 
      />

      {loading && page === 1 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.like }]}>{error}</Text>
        </View>
      ) : (!query && !category) ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={50} color={theme.muted} />
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Введіть запит або виберіть категорію
          </Text>
        </View>
      ) : images.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Нічого не знайдено 😔
          </Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={handleImagePress} />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ margin: 20 }} color={theme.accent} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
  errorText: { fontSize: 16 },
  emptyText: { fontSize: 16, marginTop: 10, textAlign: 'center' },
});