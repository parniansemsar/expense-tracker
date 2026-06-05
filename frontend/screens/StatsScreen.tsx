import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, getCategories } from '../services/api';
import Svg, { Polyline, Line, Circle, Text as SvgText, Rect } from 'react-native-svg';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const W = Math.min(Dimensions.get('window').width - 72, 340);

export default function StatsScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const fetchData = async () => {
    try {
      const [expRes, catRes] = await Promise.all([getExpenses(TEST_USER_ID), getCategories()]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (error) { console.error(error); }
  };

  const getDailyData = () => {
    const days: { [key: string]: number } = {};
    expenses.forEach(e => { const d = e.date || 'Unknown'; days[d] = (days[d] || 0) + e.amount; });
    return Object.entries(days).slice(-7).map(([date, amount]) => ({ x: date.slice(5), y: Number(amount.toFixed(2)) }));
  };

  const getCategoryData = () => {
    const totals: { [key: string]: number } = {};
    expenses.forEach(e => { const k = e.category_id || 'other'; totals[k] = (totals[k] || 0) + e.amount; });
    return Object.entries(totals).map(([id, amount]) => {
      const cat = categories.find(c => c.id === id);
      return { name: cat ? cat.name : 'Other', icon: cat ? cat.icon : '📦', amount: Number(amount.toFixed(2)) };
    }).sort((a, b) => b.amount - a.amount);
  };

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);
  const dailyData = getDailyData();
  const categoryData = getCategoryData();

  const H = 160;
  const pad = { t: 20, b: 30, l: 40, r: 10 };
  const maxY = Math.max(...dailyData.map(d => d.y), 1);
  const COLORS = ['#4caf7d', '#2e7d52', '#1a6b42', '#0f4d2e', '#063d20'];

  const pts = dailyData.map((d, i) => ({
    x: pad.l + (i / Math.max(dailyData.length - 1, 1)) * (W - pad.l - pad.r),
    y: pad.t + (1 - d.y / maxY) * (H - pad.t - pad.b),
    label: d.x, value: d.y
  }));

  const barData = dailyData.map((d, i) => ({
    x: pad.l + i * ((W - pad.l - pad.r) / Math.max(dailyData.length, 1)) + 4,
    w: ((W - pad.l - pad.r) / Math.max(dailyData.length, 1)) - 8,
    h: ((d.y / maxY) * (H - pad.t - pad.b)),
    y: pad.t + (1 - d.y / maxY) * (H - pad.t - pad.b),
    label: d.x, value: d.y
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.summaryRow}>
          {[
            { label: 'Total spent', value: `$${total.toFixed(2)}` },
            { label: 'Transactions', value: `${expenses.length}` },
            { label: 'Avg/day', value: `$${dailyData.length ? (total / dailyData.length).toFixed(0) : '0'}` },
          ].map((s, i) => (
            <View key={i} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{s.label}</Text>
              <Text style={styles.summaryValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending trend</Text>
          {dailyData.length > 1 ? (
            <Svg width={W} height={H}>
              <Line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <Line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <Polyline points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#4caf7d" strokeWidth="2.5" />
              {pts.map((p, i) => (
                <React.Fragment key={i}>
                  <Circle cx={p.x} cy={p.y} r={5} fill="#0d2d4f" stroke="#4caf7d" strokeWidth="2" />
                  <SvgText x={p.x} y={H - 8} fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle">{p.label}</SvgText>
                  <SvgText x={p.x} y={p.y - 10} fontSize="9" fill="#fff" textAnchor="middle">${p.value}</SvgText>
                </React.Fragment>
              ))}
            </Svg>
          ) : <Text style={styles.empty}>Add more expenses to see trends</Text>}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily bar chart</Text>
          {dailyData.length > 0 ? (
            <Svg width={W} height={H}>
              <Line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <Line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              {barData.map((b, i) => (
                <React.Fragment key={i}>
                  <Rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#2e7d52" rx={3} />
                  <SvgText x={b.x + b.w / 2} y={H - 8} fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle">{b.label}</SvgText>
                  <SvgText x={b.x + b.w / 2} y={b.y - 4} fontSize="8" fill="#fff" textAnchor="middle">${b.value}</SvgText>
                </React.Fragment>
              ))}
            </Svg>
          ) : <Text style={styles.empty}>No data yet</Text>}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>By category</Text>
          {categoryData.length > 0 ? categoryData.map((d, i) => (
            <View key={i} style={styles.catRow}>
              <Text style={styles.catIcon}>{d.icon}</Text>
              <Text style={styles.catName}>{d.name}</Text>
              <View style={styles.catBarTrack}>
                <View style={[styles.catBarFill, { width: `${(d.amount / total) * 100}%` as any, backgroundColor: COLORS[i % COLORS.length] }]} />
              </View>
              <Text style={styles.catAmount}>${d.amount}</Text>
            </View>
          )) : <Text style={styles.empty}>No category data yet</Text>}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d2d4f' },
  container: { padding: 20 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: '#163d63', borderRadius: 12, padding: 14, alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 },
  summaryValue: { color: '#fff', fontSize: 15, fontWeight: '700' },
  chartCard: { backgroundColor: '#163d63', borderRadius: 16, padding: 16, marginBottom: 20 },
  chartTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  empty: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 20, fontSize: 13 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  catIcon: { fontSize: 16, width: 24 },
  catName: { color: '#fff', fontSize: 12, width: 55 },
  catBarTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginHorizontal: 8 },
  catBarFill: { height: 6, borderRadius: 3 },
  catAmount: { color: '#4caf7d', fontSize: 12, fontWeight: '600', width: 48, textAlign: 'right' },
});