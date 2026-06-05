import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('Parnian');
  const [budget, setBudget] = useState('2400');
  const [currency, setCurrency] = useState('$');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    if (Platform.OS === 'web') {
      window.alert('Profile saved!');
    } else {
      Alert.alert('Saved', 'Your profile has been updated!');
    }
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.avatarName}>{name}</Text>
          <Text style={styles.avatarSub}>Personal Finance Tracker</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Info</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={editing}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Monthly Budget</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={budget}
            onChangeText={setBudget}
            editable={editing}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Currency Symbol</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={currency}
            onChangeText={setCurrency}
            editable={editing}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overview</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Monthly budget</Text>
            <Text style={styles.statValue}>{currency}{parseFloat(budget || '0').toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Currency</Text>
            <Text style={styles.statValue}>{currency}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Account type</Text>
            <Text style={styles.statValue}>Personal</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d2d4f' },
  container: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2e7d52', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  avatarName: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 4 },
  avatarSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  card: { backgroundColor: '#163d63', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 16 },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#0d2d4f', borderRadius: 10, padding: 14, fontSize: 15, color: '#fff' },
  inputDisabled: { opacity: 0.7 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  editBtn: { backgroundColor: '#163d63', borderRadius: 14, padding: 16, alignItems: 'center' },
  editBtnText: { color: '#4caf7d', fontSize: 16, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 12 },
  saveBtn: { flex: 1, backgroundColor: '#2e7d52', borderRadius: 14, padding: 16, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelBtn: { flex: 1, backgroundColor: '#163d63', borderRadius: 14, padding: 16, alignItems: 'center' },
  cancelBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
});