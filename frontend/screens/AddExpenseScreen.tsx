import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addExpense } from '../services/api';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function AddExpenseScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    try {
      await addExpense({
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0],
        user_id: TEST_USER_ID,
        category_id: null,
      });
      Alert.alert('Success', 'Expense added!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not add expense');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="What did you spend on?"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});