export interface PixabayImage {
  id: number;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  views: number;
  likes: number;
  downloads: number;
  user: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

// Типы для нижнего меню (Вкладки)
export type BottomTabParamList = {
  Gallery: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Типы для главного стека (Вкладки + Поверхностные экраны)
export type RootStackParamList = {
  MainTabs: undefined; // Загружает нижнее меню
  ImageDetails: { image: PixabayImage }; // Открывается поверх вкладок
};