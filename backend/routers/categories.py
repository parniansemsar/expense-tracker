from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class Category(BaseModel):
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None

@router.get("/categories")
def get_categories():
    from main import supabase
    response = supabase.table("categories").select("*").execute()
    return response.data

@router.post("/categories")
def add_category(category: Category):
    from main import supabase
    response = supabase.table("categories").insert(category.dict()).execute()
    return response.data

@router.delete("/categories/{category_id}")
def delete_category(category_id: str):
    from main import supabase
    response = supabase.table("categories").delete().eq("id", category_id).execute()
    return response.data