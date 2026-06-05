import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCategories, addCategory, deleteCategory } from '../services/api';
import axios from 'axios';

const API_URL = 'http://10.66.51.77:8000';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#2e7d52');
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

  const handleDelete = (id: string, name: string) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`Delete "${name}"?`);
    if (confirmed) {
      deleteCategory(id)
        .then(() => fetchCategories())
        .catch(() => window.alert('Could not delete category'));
    }
  } else {
    Alert.alert('Delete Category', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
            fetchCategories();
          } catch (error) {
            Alert.alert('Error', 'Could not delete category');
          }
        }
      }
    ]);
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
      setColor('#2e7d52');
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      Alert.alert('Error', 'Could not add category');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <View style={[styles.iconBox, { backgroundColor: item.color ? item.color + '22' : '#2e7d5222' }]}>
              <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No categories yet. Add one!</Text>
        }
        ListFooterComponent={
          showForm ? (
            <View style={styles.form}>
              <Text style={styles.formTitle}>New Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Category name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Icon (emoji, e.g. 🍔)"
                placeholderTextColor="#aaa"
                value={icon}
                onChangeText={setIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Color (e.g. #FF6B6B)"
                placeholderTextColor="#aaa"
                value={color}
                onChangeText={setColor}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                <Text style={styles.saveButtonText}>Save Category</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.fabText}>{showForm ? 'Cancel' : '+ Add Category'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d2d4f' },
  categoryItem: { backgroundColor: '#163d63', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  categoryIcon: { fontSize: 22 },
  categoryName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#fff' },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 18 },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 40, fontSize: 15 },
  form: { backgroundColor: '#163d63', borderRadius: 16, padding: 20, marginTop: 10 },
  formTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  input: { backgroundColor: '#0d2d4f', borderRadius: 10, padding: 14, fontSize: 15, color: '#fff', marginBottom: 12 },
  saveButton: { backgroundColor: '#2e7d52', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  fabContainer: { padding: 20 },
  fab: { backgroundColor: '#2e7d52', borderRadius: 14, padding: 16, alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});