import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'web' 
  ? 'http://127.0.0.1:8000' 
  : 'http://10.66.51.77:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Expenses
export const getExpenses = (userId) =>
  api.get(`/expenses?user_id=${userId}`);

export const addExpense = (expense) =>
  api.post('/expenses', expense);

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`);

// Categories
export const getCategories = () =>
  api.get('/categories');

export const addCategory = (category) =>
  api.post('/categories', category);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);

// Budgets
export const getBudgets = (userId) =>
  api.get(`/budgets?user_id=${userId}`);

export const addBudget = (budget) =>
  api.post('/budgets', budget);