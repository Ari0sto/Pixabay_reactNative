import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROFILE_STORAGE_KEY = '@profile_data';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Загрузка данных профиля
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedData) {
          const { name, avatar } = JSON.parse(storedData);
          if (name) setNickname(name);
          if (avatar) setAvatarUri(avatar);
        }
      } catch (error) {
        console.error('Помилка завантаження профілю', error);
      }
    };
    loadProfile();
  }, []);

  // фото с галереи
  const pickImage = async () => {
    // пермит
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Помилка', 'Потрібен дозвіл на доступ до галереї для вибору аватара.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // квадратное соотношение
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // сохранение данных профиля
  const saveProfile = async () => {
    try {
      const dataToSave = JSON.stringify({ name: nickname, avatar: avatarUri });
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, dataToSave);
      Alert.alert('Успіх', 'Дані профілю збережено!');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти дані.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Профіль</Text>
      </View>

      <View style={styles.content}>
        {/* Аватар */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#ccc" />
            </View>
          )}
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Натисніть, щоб змінити фото</Text>

        {/* Форма */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ваше ім'я або нікнейм</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть ім'я..."
            value={nickname}
            onChangeText={setNickname}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Зберегти зміни</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007BFF', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  avatarHint: { fontSize: 13, color: '#666', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#fafafa' },
  saveButton: { width: '100%', height: 50, backgroundColor: '#007BFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});