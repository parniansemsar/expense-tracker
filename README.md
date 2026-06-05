# Expense Tracker

A full-stack mobile and web expense tracking app.

## Tech Stack

**Backend:** Python, FastAPI, Supabase (PostgreSQL)
**Frontend:** React Native, Expo, TypeScript

## Features

- Add and view expenses
- Categorize spending
- Budget management
- Runs on iOS, Android, and web from a single codebase

## Project Structure

    expense-tracker/
    ├── backend/
    │   ├── main.py
    │   └── routers/
    └── frontend/
        ├── screens/
        └── services/

## Setup

### Backend
    cd backend
    python3 -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload

### Frontend
    cd frontend
    npm install
    npx expo start
