from fastapi import APIRouter
from pydantic import BaseModel
from datetime import date
from typing import Optional

router = APIRouter()

class Expense(BaseModel):
    amount: float
    description: Optional[str] = None
    date: date
    category_id: Optional[str] = None
    user_id: str

@router.get("/expenses")
def get_expenses(user_id: str):
    from main import supabase
    response = supabase.table("expenses").select("*").eq("user_id", user_id).execute()
    return response.data

@router.post("/expenses")
def add_expense(expense: Expense):
    from main import supabase
    data = expense.dict()
    data["date"] = str(data["date"])
    response = supabase.table("expenses").insert(data).execute()
    return response.data

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str):
    from main import supabase
    response = supabase.table("expenses").delete().eq("id", expense_id).execute()
    return response.data