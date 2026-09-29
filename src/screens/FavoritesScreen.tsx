import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, PixabayImage } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useFavorites } from '../context/FavoritesContext';
import ImageCard from '../components/ImageCard';
import { useTheme } from '../theme';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

export default function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();
  const theme = useTheme();

  const handleImagePress = (image: PixabayImage) => {
    // @ts-ignore
    navigation.navigate('ImageDetails', { image });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.surface }]}>
        <Ionicons name="heart" size={24} color={theme.like} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Обране</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="heart-dislike-outline" size={50} color={theme.muted} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            Список обраного порожній
          </Text>
          <Text style={[styles.subText, { color: theme.muted }]}>
            Збережені зображення з'являться тут
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={handleImagePress} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: '600',
  },
  subText: { fontSize: 14, marginTop: 5 },
  listContent: { paddingHorizontal: 10, paddingBottom: 20, paddingTop: 10 },
});