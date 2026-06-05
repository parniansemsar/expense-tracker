import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, deleteExpense } from '../services/api';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function HomeScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses(TEST_USER_ID);
      setExpenses(response.data);
      const sum = response.data.reduce((acc: number, e: any) => acc + e.amount, 0);
      setTotal(sum);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = (id: string, description: string) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`Delete "${description}"?`);
    if (confirmed) {
      deleteExpense(id)
        .then(() => fetchExpenses())
        .catch(() => window.alert('Could not delete expense'));
    }
  } else {
    Alert.alert('Delete Expense', `Delete "${description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(id);
            fetchExpenses();
          } catch (error) {
            Alert.alert('Error', 'Could not delete expense');
          }
        }
      }
    ]);
  }
};
   

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>Parnian 👋</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>P</Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total spent this month</Text>
        <Text style={styles.balanceAmount}>${total.toFixed(2)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>🟢 Income</Text>
            <Text style={styles.balanceStatValue}>$2,400.00</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>🔴 Expenses</Text>
            <Text style={styles.balanceStatValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Remaining</Text>
            <Text style={[styles.balanceStatValue, { color: '#4caf7d' }]}>${(2400 - total).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent transactions</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>💳</Text>
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseName}>{item.description || 'No description'}</Text>
              <Text style={styles.expenseDate}>{item.date || 'Today'}</Text>
            </View>
            <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.description || 'this expense')} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses yet. Add one!</Text>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.fabText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d2d4f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  userName: { color: '#fff', fontSize: 20, fontWeight: '600' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a4a7a', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#4caf7d', fontSize: 16, fontWeight: '600' },
  balanceCard: { backgroundColor: '#163d63', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: '700', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  balanceStatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 4 },
  balanceStatValue: { color: '#fff', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12 },
  expenseItem: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  expenseIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#eaf3de', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  expenseIconText: { fontSize: 18 },
  expenseInfo: { flex: 1 },
  expenseName: { fontSize: 14, fontWeight: '600', color: '#0d2d4f' },
  expenseDate: { fontSize: 12, color: '#888', marginTop: 2 },
  expenseAmount: { fontSize: 14, fontWeight: '600', color: '#e57373', marginRight: 8 },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 16 },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 40, fontSize: 15 },
  fabContainer: { padding: 20 },
  fab: { backgroundColor: '#2e7d52', borderRadius: 14, padding: 16, alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});