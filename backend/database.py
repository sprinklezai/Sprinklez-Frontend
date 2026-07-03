import os
from supabase import create_client, Client
from typing import List, Dict, Any

class SupabaseDB:
    """Supabase database connection manager"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "https://aontozgncbcdtsygwmny.supabase.co")
        self.key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbnRvemduY2JjZHRzeWd3bW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTE4MDUsImV4cCI6MjA5ODU2NzgwNX0.jouo3rk8_mrcvwx5tlLRECOL0HnvpzLHWxm-xt1-VDk")
        self.client: Client = create_client(self.url, self.key)
    
    def get_stores(self, filters: Dict[str, Any] = None) -> List[Dict]:
        """Fetch stores with optional filters"""
        try:
            query = self.client.table("stores").select("*")
            
            if filters:
                if "company" in filters and filters["company"]:
                    query = query.eq("company", filters["company"])
                if "country" in filters and filters["country"]:
                    query = query.eq("country", filters["country"])
                if "brand" in filters and filters["brand"]:
                    query = query.eq("brand", filters["brand"])
            
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching stores: {str(e)}")
            return []
    
    def get_brands(self) -> List[Dict]:
        """Fetch all brands"""
        try:
            response = self.client.table("brands").select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching brands: {str(e)}")
            return []
    
    def get_companies(self) -> List[Dict]:
        """Fetch all companies"""
        try:
            response = self.client.table("companies").select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching companies: {str(e)}")
            return []
    
    def get_countries(self) -> List[Dict]:
        """Fetch all countries"""
        try:
            response = self.client.table("countries").select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching countries: {str(e)}")
            return []
    
    def get_store_by_id(self, store_id: str) -> Dict:
        """Fetch a single store by ID"""
        try:
            response = self.client.table("stores").select("*").eq("id", store_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching store: {str(e)}")
            return None
    
    def create_store(self, store_data: Dict) -> Dict:
        """Create a new store"""
        try:
            response = self.client.table("stores").insert(store_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating store: {str(e)}")
            return None
    
    def update_store(self, store_id: str, store_data: Dict) -> Dict:
        """Update a store"""
        try:
            response = self.client.table("stores").update(store_data).eq("id", store_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating store: {str(e)}")
            return None
    
    def delete_store(self, store_id: str) -> bool:
        """Delete a store"""
        try:
            self.client.table("stores").delete().eq("id", store_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting store: {str(e)}")
            return False

# Initialize database connection
db = SupabaseDB()
