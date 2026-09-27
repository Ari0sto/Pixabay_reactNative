import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FavoritesContext } from '../context/FavoritesContext';
import ImageCard from '../components/ImageCard';
import { RootStackParamList, PixabayImage } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export default function FavoritesScreen({ navigation }: Props) {
  // Получаем избранные картинки из глобального стейта
  const { favorites } = useContext(FavoritesContext);

  const handleImagePress = (image: PixabayImage) => {
    navigation.navigate('ImageDetails', { image });
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>У вас поки немає збережених фото 💔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ImageCard image={item} onPress={handleImagePress} />
        )}
      />
    </View>
  );
}

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
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
});