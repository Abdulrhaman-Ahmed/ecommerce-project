# 🛒 ShopZone — Full E-Commerce Website
**Final Project | IT Department | Web Programming | Grade 3 | 2025-2026**

---

## 🗂️ Project Structure

```
ecommerce/
├── backend/               ← Node.js + Express + MySQL
│   ├── config/
│   │   └── db.js          ← MySQL connection pool
│   ├── middleware/
│   │   └── auth.js        ← JWT auth + admin guard
│   ├── routes/
│   │   ├── auth.js        ← Register / Login
│   │   ├── products.js    ← CRUD products
│   │   ├── categories.js  ← Get categories
│   │   └── orders.js      ← Place & manage orders
│   ├── database.sql       ← Full DB schema + seed data
│   ├── server.js          ← Main Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/              ← React + Bootstrap 5
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   ├── CartContext.js   ← Global cart state (useReducer)
        │   └── AuthContext.js   ← Auth state (JWT)
        ├── services/
        │   └── api.js           ← Axios API calls
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── ProductCard.js
        ├── pages/
        │   ├── Home.js          ← Hero + featured products
        │   ├── Products.js      ← Grid + search + filter + pagination
        │   ├── ProductDetails.js
        │   ├── Cart.js          ← Edit qty, remove, totals
        │   ├── Checkout.js      ← Shipping form + order
        │   ├── OrderSuccess.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── About.js
        │   ├── Contact.js
        │   ├── MyOrders.js
        │   ├── Admin.js         ← Dashboard (products + orders)
        │   └── ProductForm.js   ← Add / Edit product
        ├── styles/
        │   └── main.css
        ├── App.js               ← Router setup
        └── index.js
```

---

## ⚙️ Technologies Used

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6           |
| UI         | Bootstrap 5, Bootstrap Icons        |
| HTTP       | Axios                               |
| Alerts     | React-Toastify                      |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL 8                             |
| Auth       | JWT (jsonwebtoken), bcryptjs        |

---

## 🚀 Setup Instructions

### 1. MySQL Database

```sql
-- Open MySQL and run:
source /path/to/backend/database.sql
```

Or paste the contents of `database.sql` into MySQL Workbench / phpMyAdmin.

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev   # runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start     # runs on http://localhost:3000
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/register  | Register new user  |
| POST   | /api/auth/login     | Login user         |

### Products
| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | /api/products       | Get all (search, filter, page) |
| GET    | /api/products/featured | Featured products           |
| GET    | /api/products/:id   | Single product                 |
| POST   | /api/products       | Create (admin only)            |
| PUT    | /api/products/:id   | Update (admin only)            |
| DELETE | /api/products/:id   | Delete (admin only)            |

### Orders
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | /api/orders           | Place new order         |
| GET    | /api/orders/my        | My orders (auth)        |
| GET    | /api/orders           | All orders (admin only) |
| PUT    | /api/orders/:id/status| Update status (admin)   |

---

## 🔐 Demo Credentials

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@shop.com  | admin123 |

---

## ✅ Pages Checklist

- [x] Home Page (Navbar, Hero, Featured Products, Promo)
- [x] Products Page (Grid, Search, Category Filter, Pagination)
- [x] Product Details Page (Image, Description, Qty, Add to Cart)
- [x] Shopping Cart (Edit Qty, Remove, Dynamic Total, Free Shipping)
- [x] Checkout Page (Shipping Form, Order Summary, Place Order)
- [x] Order Success Page
- [x] About Us Page
- [x] Contact Us Page (Form)
- [x] Login / Register Pages
- [x] My Orders Page
- [x] Admin Dashboard (Products Table + Orders Table)
- [x] Admin Product Form (Create / Edit)
- [x] Fully Responsive (Mobile, Tablet, Desktop)
- [x] JWT Authentication
- [x] Cart Persisted in localStorage

---

## 🎨 Grading Criteria Coverage

| Criteria                        | Implementation                              |
|---------------------------------|---------------------------------------------|
| Functionality & Code Quality 40%| Full CRUD, JWT auth, MySQL, React Context   |
| Design & Responsiveness 30%     | Bootstrap 5, custom CSS, mobile-ready       |
| Presentation & Documentation 20%| This README, inline comments                |
| Creativity & Advanced Features 10%| Admin panel, pagination, toast alerts     |

---

**Good luck! 🚀**
