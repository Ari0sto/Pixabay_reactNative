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

// Типы для нижнего меню
export type BottomTabParamList = {
  Gallery: undefined;
  Favorites: undefined;
};

// export type RootStackParamList = {
//   Gallery: undefined;
//   ImageDetails: { image: PixabayImage };
// };

export type RootStackParamList = {
  MainTabs: undefined; // Здесь живут вкладки
  ImageDetails: { image: PixabayImage };
};