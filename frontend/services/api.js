import axios from 'axios';

const API_URL = 'http://10.66.51.77:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Expenses
export const getExpenses = (userId) =>
  api.get(`/expenses?user_id=${userId}`);

export const addExpense = (expense) =>
  api.post('/expenses', expense);

// Categories
export const getCategories = () =>
  api.get('/categories');

export const addCategory = (category) =>
  api.post('/categories', category);

// Budgets
export const getBudgets = (userId) =>
  api.get(`/budgets?user_id=${userId}`);

export const addBudget = (budget) =>
  api.post('/budgets', budget);