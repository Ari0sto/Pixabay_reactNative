import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// Кнопки = категории на Pixabay
const CATEGORIES = [
  { value: 'nature', label: 'Nature' },
  { value: 'transportation', label: 'Cars' },
  { value: 'animals', label: 'Animals' },
  { value: 'people', label: 'People' },
  { value: 'space', label: 'Space' },
  { value: 'places', label: 'City' }
];

interface CategoryListProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryList({ selectedCategory, onSelect }: CategoryListProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.badge,
              selectedCategory === cat.value && styles.badgeSelected
            ]}
            onPress={() => onSelect(selectedCategory === cat.value ? '' : cat.value)}
          >
            <Text style={[
              styles.text,
              selectedCategory === cat.value && styles.textSelected
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  badgeSelected: {
    backgroundColor: '#007BFF',
  },
  text: {
    color: '#333',
    fontWeight: '500',
  },
  textSelected: {
    color: '#fff',
  },
});