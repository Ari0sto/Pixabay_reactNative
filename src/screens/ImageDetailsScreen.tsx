import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen({ route }: Props) {
  const { image } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const theme = useTheme();

  const favorite = isFavorite(image.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      bounces={false}
    >
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: theme.surface },
        ]}
      >
        <Image
          source={{
            uri:
              image.webformatURL ||
              image.largeImageURL ||
              image.previewURL,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.authorLabel, { color: theme.muted }]}>
              Автор фотографії
            </Text>
            <Text style={[styles.authorName, { color: theme.text }]}>
              {image.user}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.favoriteBtn,
              { backgroundColor: theme.surface },
              favorite && styles.favoriteBtnActive,
            ]}
            onPress={() => toggleFavorite(image)}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={20}
              color={favorite ? theme.like : theme.text}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.favoriteBtnText,
                { color: theme.text },
                favorite && styles.favoriteBtnTextActive,
                favorite && { color: theme.like },
              ]}
            >
              {favorite ? 'Збережено' : 'В обране'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.surface },
          ]}
        />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Статистика
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons
              name="eye-outline"
              size={28}
              color={theme.muted}
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {image.views}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>
              Переглядів
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="heart-outline"
              size={28}
              color={theme.muted}
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {image.likes}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>
              Лайків
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="download-outline"
              size={28}
              color={theme.muted}
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {image.downloads || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>
              Завантажень
            </Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {image.tags.split(',').map((tag, index) => (
            <View
              key={index}
              style={[
                styles.tagBadge,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.surface,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.muted }]}>
                #{tag.trim()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    width: width,
    height: width,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoriteBtnActive: {
    backgroundColor: '#ffeef0',
  },
  favoriteBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteBtnTextActive: {
    color: '#e0245e',
  },
  divider: {
    height: 1,
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
  statIcon: { marginBottom: 8 },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: { fontSize: 12 },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  tagText: { fontSize: 14 },
});