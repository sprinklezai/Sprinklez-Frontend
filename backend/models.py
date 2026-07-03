from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StoreBase(BaseModel):
    store_no: str
    store_name: str
    mall: str
    brand: str
    country: str
    company: str
    status: str = "ACTIVE"

class StoreCreate(StoreBase):
    pass

class StoreUpdate(BaseModel):
    store_name: Optional[str] = None
    mall: Optional[str] = None
    brand: Optional[str] = None
    country: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None

class Store(StoreBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Brand(BaseModel):
    id: Optional[str] = None
    brand: str
    brand_name: Optional[str] = None

class Company(BaseModel):
    id: Optional[str] = None
    company: str

class Country(BaseModel):
    id: Optional[str] = None
    country: str
    stores_count: Optional[int] = None

class StoreStats(BaseModel):
    total_stores: int
    active_stores: int
    inactive_stores: int
    unique_brands: int
    unique_companies: int
    unique_countries: int
    countries_list: List[str]

class FilterRequest(BaseModel):
    companies: Optional[List[str]] = None
    countries: Optional[List[str]] = None
    brands: Optional[List[str]] = None
    search: Optional[str] = None
