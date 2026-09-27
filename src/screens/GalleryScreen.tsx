import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
// Импорт типов для навигации
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PixabayImage } from '../types';

// Импорт компонентов и API
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ImageCard from '../components/ImageCard';
import { fetchImages } from '../api/pixabay';

type GalleryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;

interface Props {
  navigation: GalleryScreenNavigationProp;
}

export default function GalleryScreen({ navigation }: Props) {
  // Состояния для хранения данных и управления UI
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  
  // Состояния загрузки и ошибок
  const [loading, setLoading] = useState(true); // Для первой загрузки и при поиске
  const [loadingMore, setLoadingMore] = useState(false); // Для пагинации (скролла вниз)
  const [error, setError] = useState<string | null>(null);

  // Логика загрузки данных
  const loadData = async (pageNumber: number, isNewSearch: boolean) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchImages(query, pageNumber, category);
      
      if (isNewSearch) {
        setImages(data.hits); // Если новый поиск - перезаписываем массив
      } else {
        setImages(prev => [...prev, ...data.hits]); // Если пагинация - добавляем к существующим
      }
    } catch (err) {
      setError('Не вдалося завантажити зображення. Перевірте з\'єднання.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Вызов loadData каждый раз, когда меняется запрос (query) или категория
  useEffect(() => {
    setPage(1); // Сброс страницы на первую
    loadData(1, true); // true означает, что это новый поиск
  }, [query, category]);

  // Обработчики событий для поиска и выбора категории
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleImagePress = (image: PixabayImage) => {
    // Переходим на экран деталей и передаем объект картинки
    navigation.navigate('ImageDetails', { image });
  };

  // Функция для пагинации (вызывается, когда дошли до конца списка)
  const handleLoadMore = () => {
    // Если уже грузим данные или картинок нет (значит мы дошли до конца реального API) - ничего не делаем
    if (loading || loadingMore || images.length === 0) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, false); // false означает, что это дозагрузка (пагинация)
  };

  // Рендер
  
  // 1. Показ индикатора загрузки для первичного поиска
  if (loading && page === 1) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Завантаження зображень...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Поиск и категории остаются закрепленными сверху */}
      <SearchBar onSearch={handleSearch} />
      <CategoryList selectedCategory={category} onSelect={handleCategorySelect} />

      {/* 2. Обработка ошибки */}
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadData(1, true)}>
            <Text style={styles.retryButtonText}>Спробувати ще раз</Text>
          </TouchableOpacity>
        </View>
      ) : 
      /* 3. Обработка пустого результата */
      images.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>За вашим запитом нічого не знайдено 😔</Text>
        </View>
      ) : (
        /* 4. Отображение самой галереи */
        <FlatList
          data={images}
          // Ключ должен быть уникальным. При пагинации мок-данных могут совпасть ID, 
          // поэтому добавляем index для надежности ключа в React
          keyExtractor={(item, index) => `${item.id}-${index}`}
          // Сетка в 2 колонки
          numColumns={2}
          contentContainerStyle={styles.listContent}
          // Функция отрисовки одного элемента
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={handleImagePress} />
          )}
          // Настройки пагинации
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Вызывать, когда осталось 50% до конца списка
          // Спиннер внизу списка при дозагрузке новых страниц
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#007BFF" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});