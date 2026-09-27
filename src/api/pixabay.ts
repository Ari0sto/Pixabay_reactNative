import { PixabayResponse } from '../types';
import MOCK_DATA from './mockData.json';

const API_KEY = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;
const BASE_URL = 'https://pixabay.com/api/';

// ТУМБЛЕР API/ MOCK DATA
const USE_MOCK_DATA = false;

export const fetchImages = async (
  query: string = '',
  page: number = 1,
  category: string = ''
): Promise<PixabayResponse> => {
  try {
    if (USE_MOCK_DATA) {
      console.log(`[MOCK] Запит: пошук="${query}", сторінка=${page}, категорія="${category}"`);
      
      // Имитация задержки сети (800мс)
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredHits = MOCK_DATA.hits;

      // 1. Фильтрация по текстовому запросу из поля ввода
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredHits = filteredHits.filter(hit => 
          hit.tags.toLowerCase().includes(lowerQuery)
        );
      }

      // 2. Фильтрация по выбранной категории
      if (category) {
        const lowerCategory = category.toLowerCase();
        filteredHits = filteredHits.filter(hit => 
          hit.tags.toLowerCase().includes(lowerCategory)
        );
      }
      
      // 3. Применение пагинации к уже отфильтрованному массиву
      const limit = 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHits = filteredHits.slice(startIndex, endIndex);
      

      // Возврат данных в правильном формате
      return { 
        total: filteredHits.length, 
        totalHits: filteredHits.length, 
        hits: paginatedHits 
      };
    }

    // Запрос к реальному API Pixabay
    let url = `${BASE_URL}?key=${API_KEY}&image_type=photo&per_page=20&page=${page}`;

    // Костыль для категории "Space"
    if (category === 'space') {
      // Если есть еще и текстовый запрос, объединяем их
      const combinedQuery = query ? `${query} space` : 'space';
      url += `&q=${encodeURIComponent(combinedQuery)}`;
    } else {
      // Стандартная обработка
      if (query) url += `&q=${encodeURIComponent(query)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Помилка завантаження даних з сервера');
    }
    const data: PixabayResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Помилка API:', error);
    throw error;
  }
};