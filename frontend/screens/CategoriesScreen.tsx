import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCategories, addCategory } from '../services/api';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#6C63FF');
  const [showForm, setShowForm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAdd = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    try {
      await addCategory({ name, icon, color });
      setName('');
      setIcon('');
      setColor('#6C63FF');
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      Alert.alert('Error', 'Could not add category');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.categoryItem, { borderLeftColor: item.color || '#6C63FF' }]}>
            <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No categories yet. Add one!</Text>
        }
      />
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Category name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Icon (emoji, e.g. 🍔)"
            value={icon}
            onChangeText={setIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Color (e.g. #FF6B6B)"
            value={color}
            onChangeText={setColor}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
            <Text style={styles.saveButtonText}>Save Category</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ Add Category'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  categoryItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4 },
  categoryIcon: { fontSize: 24, marginRight: 12 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  saveButton: { backgroundColor: '#6C63FF', borderRadius: 8, padding: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  addButton: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});