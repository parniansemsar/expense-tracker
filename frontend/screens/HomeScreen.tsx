import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, deleteExpense } from '../services/api';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const MONTHLY_BUDGET = 2400;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getIcon = (description: string) => {
  const d = (description || '').toLowerCase();
  if (d.includes('coffee') || d.includes('cafe')) return '☕';
  if (d.includes('lunch') || d.includes('dinner') || d.includes('food') || d.includes('eat') || d.includes('restaurant') || d.includes('croissant')) return '🍽️';
  if (d.includes('uber') || d.includes('transport') || d.includes('gas') || d.includes('car')) return '🚗';
  if (d.includes('netflix') || d.includes('spotify') || d.includes('subscription')) return '📱';
  if (d.includes('grocery') || d.includes('supermarket')) return '🛒';
  if (d.includes('gym') || d.includes('fitness')) return '💪';
  if (d.includes('rent') || d.includes('bill') || d.includes('mobile') || d.includes('phone') || d.includes('t-mobile')) return '🏠';
  if (d.includes('amazon') || d.includes('shopping')) return '🛍️';
  return '💳';
};

const QUICK_ADD = [
  { label: '☕ Coffee', amount: 5, description: 'Coffee' },
  { label: '🍽️ Lunch', amount: 15, description: 'Lunch' },
  { label: '🚗 Uber', amount: 12, description: 'Uber' },
  { label: '🛒 Grocery', amount: 50, description: 'Grocery' },
];

const SORT_OPTIONS = ['Date ↓', 'Date ↑', 'Amount ↓', 'Amount ↑'];

export default function HomeScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortIndex, setSortIndex] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useFocusEffect(useCallback(() => { fetchExpenses(); }, []));

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses(TEST_USER_ID);
      setExpenses(response.data);
      const sum = response.data.reduce((acc: number, e: any) => acc + e.amount, 0);
      setTotal(sum);
    } catch (error) { console.error('Error fetching expenses:', error); }
  };

  const handleDelete = (id: string, description: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Delete "${description}"?`);
      if (confirmed) deleteExpense(id).then(() => fetchExpenses()).catch(() => window.alert('Could not delete'));
    } else {
      Alert.alert('Delete Expense', `Delete "${description}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => { await deleteExpense(id); fetchExpenses(); } }
      ]);
    }
  };

  const handleQuickAdd = async (item: typeof QUICK_ADD[0]) => {
    try {
      const { addExpense } = await import('../services/api');
      await addExpense({
        amount: item.amount,
        description: item.description,
        date: new Date().toISOString().split('T')[0],
        user_id: TEST_USER_ID,
        category_id: null,
      });
      fetchExpenses();
    } catch (error) {
      console.error('Quick add failed:', error);
    }
  };

  const getSortedFiltered = () => {
    let data = expenses.filter(e =>
      (e.description || '').toLowerCase().includes(search.toLowerCase())
    );
    switch (sortIndex) {
      case 0: return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 1: return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 2: return data.sort((a, b) => b.amount - a.amount);
      case 3: return data.sort((a, b) => a.amount - b.amount);
      default: return data;
    }
  };

  const budgetPct = Math.min((total / MONTHLY_BUDGET) * 100, 100);
  const budgetColor = budgetPct > 90 ? '#e57373' : budgetPct > 70 ? '#ffb74d' : '#4caf7d';
  const filtered = getSortedFiltered();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
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
            <Text style={styles.balanceStatLabel}>🟢 Budget</Text>
            <Text style={styles.balanceStatValue}>${MONTHLY_BUDGET}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>🔴 Spent</Text>
            <Text style={styles.balanceStatValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Left</Text>
            <Text style={[styles.balanceStatValue, { color: budgetColor }]}>${(MONTHLY_BUDGET - total).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${budgetPct}%` as any, backgroundColor: budgetColor }]} />
        </View>
        <Text style={styles.progressLabel}>{budgetPct.toFixed(0)}% of budget used</Text>
      </View>

      <View style={styles.quickAddRow}>
        <TouchableOpacity style={styles.quickAddToggle} onPress={() => setShowQuickAdd(!showQuickAdd)}>
          <Text style={styles.quickAddToggleText}>{showQuickAdd ? '✕ Close' : '⚡ Quick add'}</Text>
        </TouchableOpacity>
      </View>

      {showQuickAdd && (
        <View style={styles.quickAddContainer}>
          {QUICK_ADD.map((item, i) => (
            <TouchableOpacity key={i} style={styles.quickAddBtn} onPress={() => handleQuickAdd(item)}>
              <Text style={styles.quickAddLabel}>{item.label}</Text>
              <Text style={styles.quickAddAmount}>${item.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.controlsRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortIndex((sortIndex + 1) % SORT_OPTIONS.length)}>
          <Text style={styles.sortText}>{SORT_OPTIONS[sortIndex]}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>{getIcon(item.description)}</Text>
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
        ListEmptyComponent={<Text style={styles.empty}>{search ? 'No results found' : 'No expenses yet. Add one!'}</Text>}
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
  balanceCard: { backgroundColor: '#163d63', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 16 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: '700', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  balanceStatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 4 },
  balanceStatValue: { color: '#fff', fontSize: 12, fontWeight: '600' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'right' },
  quickAddRow: { paddingHorizontal: 20, marginBottom: 8 },
  quickAddToggle: { alignSelf: 'flex-start', backgroundColor: '#163d63', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  quickAddToggleText: { color: '#4caf7d', fontSize: 13, fontWeight: '600' },
  quickAddContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  quickAddBtn: { backgroundColor: '#163d63', borderRadius: 10, padding: 10, alignItems: 'center', minWidth: 80 },
  quickAddLabel: { color: '#fff', fontSize: 12, marginBottom: 2 },
  quickAddAmount: { color: '#4caf7d', fontSize: 12, fontWeight: '600' },
  controlsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  searchInput: { flex: 1, backgroundColor: '#163d63', borderRadius: 10, padding: 10, color: '#fff', fontSize: 14 },
  sortBtn: { backgroundColor: '#163d63', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center' },
  sortText: { color: '#4caf7d', fontSize: 12, fontWeight: '600' },
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