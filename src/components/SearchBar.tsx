import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChangeText, onSearch }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Пошук зображень..."
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch} 
      />
      <TouchableOpacity style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>Пошук</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 10, backgroundColor: 'transparent' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginRight: 10 },
  button: { backgroundColor: '#007BFF', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});