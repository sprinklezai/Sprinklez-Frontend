# WebApp Backend API

Python FastAPI backend for the Group Company Profile dashboard.

## Setup

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and update with your Supabase credentials:
```bash
cp .env.example .env
```

### 3. Run the server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Endpoints

### Health Check
- `GET /health` - Server health status

### Stores
- `GET /api/stores` - Get all stores (with filters)
- `GET /api/stores/{store_id}` - Get specific store
- `POST /api/stores` - Create new store
- `PUT /api/stores/{store_id}` - Update store
- `DELETE /api/stores/{store_id}` - Delete store

### Brands
- `GET /api/brands` - Get all brands

### Companies
- `GET /api/companies` - Get all companies

### Countries
- `GET /api/countries` - Get all countries

### Statistics
- `GET /api/stats` - Get dashboard statistics with optional filters

## Query Parameters

### Stores Endpoint
- `company` (optional) - Filter by company
- `country` (optional) - Filter by country
- `brand` (optional) - Filter by brand
- `search` (optional) - Search across all fields

### Statistics Endpoint
- `company` (optional) - Filter by company
- `country` (optional) - Filter by country
- `brand` (optional) - Filter by brand

## Deployment

### Using Uvicorn directly
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Using Gunicorn + Uvicorn
```bash
pip install gunicorn
gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `HOST` | Server host (default: 0.0.0.0) | No |
| `PORT` | Server port (default: 8000) | No |

## Features

- ✅ Full CRUD operations for stores
- ✅ Advanced filtering and searching
- ✅ Statistical aggregations
- ✅ CORS enabled for frontend integration
- ✅ Pydantic validation
- ✅ Interactive API documentation
- ✅ Error handling and logging
