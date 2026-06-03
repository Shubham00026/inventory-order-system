# 📦 Inventory & Order Management System

A production-ready full-stack application for managing products, customers, and orders with real-time stock control.

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   React SPA  │─────▶│   FastAPI    │─────▶│  PostgreSQL  │
│  (Nginx :80) │ /api │  (:8000)     │ ORM  │   (:5432)    │
└──────────────┘      └──────────────┘      └──────────────┘
     frontend             backend                  db
```

## 🚀 Tech Stack
- **Backend:** FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- **Frontend:** React 18, React Router, Axios
- **Infra:** Docker, Docker Compose, Nginx

## ✨ Features
- Full CRUD for Products, Customers, and Orders
- Automatic stock deduction on order creation
- Stock restoration on order cancellation
- Stock validation (prevents overselling)
- Low-stock badges in the UI
- SKU & email uniqueness enforcement
- Health check endpoints

## 🏃 Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd inventory-order-system

# Start everything
docker compose up --build
```

| Service      | URL                          |
|--------------|------------------------------|
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:8000        |
| API Docs     | http://localhost:8000/docs   |

## 📚 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/products`           | List products        |
| POST   | `/products`           | Create product       |
| PUT    | `/products/{id}`      | Update product       |
| DELETE | `/products/{id}`      | Delete product       |
| GET    | `/customers`          | List customers       |
| POST   | `/customers`          | Create customer      |
| DELETE | `/customers/{id}`     | Delete customer      |
| GET    | `/orders`             | List orders          |
| POST   | `/orders`             | Create order         |
| DELETE | `/orders/{id}`        | Cancel order         |

## 🔧 Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

## 📝 License
MIT