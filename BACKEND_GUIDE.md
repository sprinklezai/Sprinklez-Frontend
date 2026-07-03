# Python Backend API - Quick Start Guide

Your Python FastAPI backend is now ready! Here's how to get started:

## Installation & Running

### Local Development

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server**:
   ```bash
   python main.py
   ```

3. **Access the API**:
   - API Root: `http://localhost:8000`
   - Swagger Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Using Docker

Run both Streamlit and backend together:

```bash
docker-compose up
```

- Backend: `http://localhost:8000`
- Streamlit Dashboard: `http://localhost:8501`

## API Endpoints Reference

### Health Check
```bash
GET http://localhost:8000/health
```

### Stores
```bash
# Get all stores
GET http://localhost:8000/api/stores

# Get all stores from a specific company
GET http://localhost:8000/api/stores?company=COMPANY_NAME

# Get stores from country
GET http://localhost:8000/api/stores?country=COUNTRY_NAME

# Get stores of a brand
GET http://localhost:8000/api/stores?brand=BRAND_NAME

# Search stores
GET http://localhost:8000/api/stores?search=MALL_NAME

# Get specific store
GET http://localhost:8000/api/stores/{store_id}

# Create store
POST http://localhost:8000/api/stores
Content-Type: application/json

{
  "store_no": "S001",
  "store_name": "Store Name",
  "mall": "Mall Name",
  "brand": "BRAND",
  "country": "COUNTRY",
  "company": "COMPANY",
  "status": "ACTIVE"
}

# Update store
PUT http://localhost:8000/api/stores/{store_id}
Content-Type: application/json

{
  "status": "INACTIVE"
}

# Delete store
DELETE http://localhost:8000/api/stores/{store_id}
```

### Brands
```bash
GET http://localhost:8000/api/brands
```

### Companies
```bash
GET http://localhost:8000/api/companies
```

### Countries
```bash
GET http://localhost:8000/api/countries
```

### Statistics
```bash
# Get overall statistics
GET http://localhost:8000/api/stats

# Get statistics filtered by company
GET http://localhost:8000/api/stats?company=COMPANY_NAME

# Get statistics filtered by country
GET http://localhost:8000/api/stats?country=COUNTRY_NAME

# Get statistics for specific brand
GET http://localhost:8000/api/stats?brand=BRAND_NAME
```

## Example Usage with cURL

```bash
# Health check
curl http://localhost:8000/health

# Get all stores
curl http://localhost:8000/api/stores

# Get stores filtered by country
curl "http://localhost:8000/api/stores?country=USA"

# Get dashboard stats
curl http://localhost:8000/api/stats

# Create new store
curl -X POST http://localhost:8000/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "store_no": "NEW-001",
    "store_name": "New Store",
    "mall": "Shopping Mall",
    "brand": "XYZ",
    "country": "USA",
    "company": "Company A",
    "status": "ACTIVE"
  }'
```

## Example Usage with Python

```python
import requests

API_URL = "http://localhost:8000"

# Get all stores
stores = requests.get(f"{API_URL}/api/stores").json()
print(stores)

# Get stores from specific company
company_stores = requests.get(
    f"{API_URL}/api/stores",
    params={"company": "COMPANY_NAME"}
).json()

# Get dashboard stats
stats = requests.get(f"{API_URL}/api/stats").json()
print(f"Total Stores: {stats['total_stores']}")
print(f"Active Stores: {stats['active_stores']}")
print(f"Unique Brands: {stats['unique_brands']}")

# Create a new store
new_store = {
    "store_no": "NEW-001",
    "store_name": "New Store",
    "mall": "Shopping Mall",
    "brand": "XYZ",
    "country": "USA",
    "company": "Company A",
    "status": "ACTIVE"
}
response = requests.post(f"{API_URL}/api/stores", json=new_store)
created_store = response.json()
```

## Example Usage with JavaScript/Fetch

```javascript
const API_URL = "http://localhost:8000";

// Get all stores
async function getStores() {
  const response = await fetch(`${API_URL}/api/stores`);
  const stores = await response.json();
  console.log(stores);
}

// Get filtered stores
async function getStoresByCountry(country) {
  const response = await fetch(
    `${API_URL}/api/stores?country=${country}`
  );
  const stores = await response.json();
  console.log(stores);
}

// Get statistics
async function getStats() {
  const response = await fetch(`${API_URL}/api/stats`);
  const stats = await response.json();
  console.log(`Total Stores: ${stats.total_stores}`);
  console.log(`Active Stores: ${stats.active_stores}`);
}

// Create new store
async function createStore(storeData) {
  const response = await fetch(`${API_URL}/api/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storeData),
  });
  const newStore = await response.json();
  console.log(newStore);
}

// Run examples
getStores();
getStats();
```

## Connecting Your Next.js Frontend

In your Next.js application, configure the API client:

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchStores(filters?: {
  company?: string;
  country?: string;
  brand?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.company) params.append("company", filters.company);
  if (filters?.country) params.append("country", filters.country);
  if (filters?.brand) params.append("brand", filters.brand);
  if (filters?.search) params.append("search", filters.search);

  const response = await fetch(
    `${API_URL}/api/stores?${params.toString()}`
  );
  return response.json();
}

export async function fetchStats(filters?: {
  company?: string;
  country?: string;
  brand?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.company) params.append("company", filters.company);
  if (filters?.country) params.append("country", filters.country);
  if (filters?.brand) params.append("brand", filters.brand);

  const response = await fetch(
    `${API_URL}/api/stats?${params.toString()}`
  );
  return response.json();
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=https://aontozgncbcdtsygwmny.supabase.co
SUPABASE_KEY=your_anon_key_here
HOST=0.0.0.0
PORT=8000
```

For Next.js frontend, set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete stores  
✅ **Advanced Filtering** - Filter by company, country, brand  
✅ **Full-Text Search** - Search across all fields  
✅ **Statistical Endpoints** - Get aggregated metrics  
✅ **Data Validation** - Pydantic models ensure data integrity  
✅ **CORS Enabled** - Ready for frontend integration  
✅ **Interactive Documentation** - Built-in Swagger UI  
✅ **Docker Ready** - Containerized deployment  
✅ **Error Handling** - Comprehensive error responses  

## Deployment Options

### Option 1: Render (Recommended)
1. Push code to GitHub
2. Connect repository to Render
3. Deploy with `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Option 2: Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy (auto-detects FastAPI)

### Option 3: AWS Lambda + API Gateway
Use AWS Lambda adapter for FastAPI

### Option 4: DigitalOcean App Platform
1. Connect repository
2. Configure environment
3. Deploy

## Support

For issues or questions:
1. Check `backend/README.md` for detailed documentation
2. View API documentation at `http://localhost:8000/docs`
3. Check error logs from your deployment platform

Enjoy your backend API! 🚀
