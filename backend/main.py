from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd

from database import db
from models import (
    Store, Brand, Company, Country, StoreStats, 
    FilterRequest, StoreCreate, StoreUpdate
)

app = FastAPI(
    title="WebApp Backend API",
    description="Python backend for Group Company Profile dashboard",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# HEALTH CHECK
# ============================================================================
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Backend is running"}

# ============================================================================
# STORES ENDPOINTS
# ============================================================================
@app.get("/api/stores", response_model=List[Store])
def get_stores(
    company: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get all stores with optional filtering"""
    try:
        stores = db.get_stores()
        
        # Convert to DataFrame for easier filtering
        if not stores:
            return []
        
        df = pd.DataFrame(stores)
        
        # Apply filters
        if company:
            df = df[df.get("company", "") == company]
        if country:
            df = df[df.get("country", "") == country]
        if brand:
            df = df[df.get("brand", "") == brand]
        if search:
            search_lower = search.lower()
            mask = df.astype(str).apply(lambda x: x.str.contains(search_lower, case=False, na=False)).any(axis=1)
            df = df[mask]
        
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stores/{store_id}", response_model=Store)
def get_store(store_id: str):
    """Get a specific store by ID"""
    try:
        store = db.get_store_by_id(store_id)
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
        return store
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stores", response_model=Store)
def create_store(store: StoreCreate):
    """Create a new store"""
    try:
        new_store = db.create_store(store.dict())
        if not new_store:
            raise HTTPException(status_code=400, detail="Failed to create store")
        return new_store
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/stores/{store_id}", response_model=Store)
def update_store(store_id: str, store: StoreUpdate):
    """Update a store"""
    try:
        updated_store = db.update_store(store_id, store.dict(exclude_unset=True))
        if not updated_store:
            raise HTTPException(status_code=404, detail="Store not found")
        return updated_store
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/stores/{store_id}")
def delete_store(store_id: str):
    """Delete a store"""
    try:
        if not db.delete_store(store_id):
            raise HTTPException(status_code=404, detail="Store not found")
        return {"message": "Store deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# BRANDS ENDPOINTS
# ============================================================================
@app.get("/api/brands", response_model=List[Brand])
def get_brands():
    """Get all brands"""
    try:
        brands = db.get_brands()
        return brands if brands else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# COMPANIES ENDPOINTS
# ============================================================================
@app.get("/api/companies", response_model=List[Company])
def get_companies():
    """Get all companies"""
    try:
        companies = db.get_companies()
        return companies if companies else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# COUNTRIES ENDPOINTS
# ============================================================================
@app.get("/api/countries", response_model=List[Country])
def get_countries():
    """Get all countries"""
    try:
        countries = db.get_countries()
        return countries if countries else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# STATISTICS ENDPOINTS
# ============================================================================
@app.get("/api/stats", response_model=StoreStats)
def get_statistics(
    company: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    brand: Optional[str] = Query(None)
):
    """Get dashboard statistics"""
    try:
        stores = db.get_stores()
        
        if not stores:
            return StoreStats(
                total_stores=0,
                active_stores=0,
                inactive_stores=0,
                unique_brands=0,
                unique_companies=0,
                unique_countries=0,
                countries_list=[]
            )
        
        df = pd.DataFrame(stores)
        
        # Apply filters
        if company:
            df = df[df.get("company", "") == company]
        if country:
            df = df[df.get("country", "") == country]
        if brand:
            df = df[df.get("brand", "") == brand]
        
        # Calculate statistics
        total = len(df)
        active = len(df[df.get("status", "") == "ACTIVE"]) if not df.empty else 0
        inactive = total - active
        
        return StoreStats(
            total_stores=total,
            active_stores=active,
            inactive_stores=inactive,
            unique_brands=df.get("brand", pd.Series()).nunique() if not df.empty else 0,
            unique_companies=df.get("company", pd.Series()).nunique() if not df.empty else 0,
            unique_countries=df.get("country", pd.Series()).nunique() if not df.empty else 0,
            countries_list=df.get("country", pd.Series()).unique().tolist() if not df.empty else []
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ROOT ENDPOINT
# ============================================================================
@app.get("/")
def root():
    """Root endpoint with API documentation link"""
    return {
        "message": "WebApp Backend API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
