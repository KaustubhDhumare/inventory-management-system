# Inventory Management System

## Project Overview

A full-stack MERN Inventory Management System that helps businesses manage products, categories, suppliers, and inventory efficiently. The application provides secure authentication, stock tracking, and a responsive dashboard for monitoring inventory operations.

---

## Features

* JWT Authentication & Authorization
* Role-Based Access Control (Admin, Employee)
* Product Management (CRUD)
* Category Management (CRUD)
* Supplier Management (CRUD)
* Stock In / Stock Out Management
* Stock History Tracking
* Search, Filter & Pagination
* Responsive Dashboard
* User Profile Management

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB
* Mongoose

---

## Database Models

* User
* Product
* Category
* Supplier
* StockHistory
* Transaction

---

## Project Structure

```text
inventory-management-system/
│
├── client/                 # React Frontend
├── server/                 # Express Backend
├── README.md
└── .gitignore
```

### Client

```text
client/
└── src/
    ├── assets/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── services/
    ├── routes/
    ├── hooks/
    ├── context/
    ├── utils/
    ├── App.jsx
    └── main.jsx
```

### Server

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── constants/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Future Enhancements

* Dashboard Analytics
* Barcode Scanner
* Export Reports (PDF/Excel)
* Activity Logs
* Multi-Warehouse Support
* Email Notifications




OBJECTIVES

☑ Objective 1: Project Planning
    - Finalize features
    - Decide user roles
    - Plan database collections

☑ Objective 2: Project Initialization
    - Create project structure
    - Initialize Node.js
    - Install dependencies
    - Configure ES Modules
    - Create .env and .gitignore

☑ Objective 3: Backend Foundation
    - Configure Express
    - Add middleware
    - Create app.js and server.js
    - Connect MongoDB Atlas
    - Verify server is running

☑ Objective 4: Database Architecture
    - Design all collections
    - Create Mongoose schemas
    - Define relationships
    - Add validations and indexes

□ Objective 5: Authentication & Authorization
    - Register
    - Login
    - Password hashing
    - JWT authentication
    - Protected routes
    - Role-based access

□ Objective 6: Core Business APIs
    - Category APIs
    - Supplier APIs
    - Product APIs
    - Inventory Transaction APIs
    - Dashboard APIs

□ Objective 7: Validation & Error Handling
    - Request validation
    - Global error handler
    - Standard API responses

□ Objective 8: Security & Optimization
    - Helmet
    - Rate limiting
    - CORS configuration
    - Cookie security
    - Performance improvements

□ Objective 9: Testing
    - Test all APIs in Postman
    - Fix bugs
    - Handle edge cases

□ Objective 10: Documentation & Deployment
    - README
    - Environment setup guide
    - Deploy backend


Database Relationships (ERD)

                                    User
                                      │
                   ┌──────────────────┼──────────────────┐
                   │                  │                  │
             createdBy          performedBy         performedBy
                   │                  │                  │
                   ▼                  ▼                  ▼
              Product       InventoryTransaction     AuditLog
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
     Category          Supplier
                              │
                              ▼
                      PurchaseOrder
                              │
                              ▼
                     orderedItems[]
                              │
                              ▼
                           Product


Objective 5
│
├── 5.1 User Registration
│      ├── Validate request
│      ├── Check duplicate email
│      ├── Hash password (already done)
│      ├── Save user
│      └── Return response
│
├── 5.2 User Login
│      ├── Validate request
│      ├── Find user
│      ├── Compare password
│      ├── Generate JWT
│      └── Send token
│
├── 5.3 JWT Authentication
│      ├── Generate Access Token
│      ├── Generate Refresh Token
│      ├── Store Refresh Token
│      └── Token Refresh API
│
├── 5.4 Authentication Middleware
│      ├── Verify JWT
│      ├── Get current user
│      └── Protect private routes
│
├── 5.5 Authorization Middleware
│      ├── Admin only
│      ├── Manager only
│      └── Employee permissions
│
└── 5.6 Logout
       ├── Clear Cookies
       ├── Invalidate Refresh Token
       └── Logout API