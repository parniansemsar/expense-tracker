from fastapi import APIRouter
from pydantic import BaseModel
from datetime import date
from typing import Optional

router = APIRouter()

class Budget(BaseModel):
    user_id: str
    category_id: Optional[str] = None
    amount: float
    month: date

@router.get("/budgets")
def get_budgets(user_id: str):
    from main import supabase
    response = supabase.table("budgets").select("*").eq("user_id", user_id).execute()
    return response.data

@router.post("/budgets")
def add_budget(budget: Budget):
    from main import supabase
    data = budget.dict()
    data["month"] = str(data["month"])
    response = supabase.table("budgets").insert(data).execute()
    return response.data