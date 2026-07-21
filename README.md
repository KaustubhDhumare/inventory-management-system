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

□ Objective 4: Database Architecture
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



Inventory Management System ERD (Version 1)

                                        ┌──────────────────┐
                                        │      User        │
                                        ├──────────────────┤
                                        │ _id              │
                                        │ name             │
                                        │ email            │
                                        │ password         │
                                        │ role             │
                                        │ isActive         │
                                        │ createdAt        │
                                        │ updatedAt        │
                                        └────────┬─────────┘
                                                 │
                              Created By         │ Performs
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │                             │                             │
                   ▼                             ▼                             ▼
          ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
          │   Product        │         │ PurchaseOrder    │         │    AuditLog      │
          ├──────────────────┤         ├──────────────────┤         ├──────────────────┤
          │ _id              │         │ _id              │         │ _id              │
          │ name             │         │ supplier         │         │ user             │
          │ sku              │         │ orderedItems[]   │         │ action           │
          │ category         │────────►│ status           │         │ module           │
          │ supplier         │         │ createdBy        │         │ description      │
          │ quantity         │         │ receivedAt       │         │ createdAt        │
          │ minQuantity      │         │ createdAt        │         └──────────────────┘
          │ price            │         └────────┬─────────┘
          │ status           │                  │
          │ createdBy        │                  │
          └────────┬─────────┘                  │
                   │                            │
                   │                            │ Creates Stock
                   ▼                            ▼
           ┌─────────────────────────────────────────────┐
           │         InventoryTransaction                │
           ├─────────────────────────────────────────────┤
           │ _id                                         │
           │ product                                     │
           │ type (IN / OUT / ADJUSTMENT / RETURN)       │
           │ quantity                                    │
           │ previousQuantity                            │
           │ newQuantity                                 │
           │ performedBy                                 │
           │ remarks                                     │
           │ createdAt                                   │
           └─────────────────────────────────────────────┘


          ┌──────────────────┐
          │    Category      │
          ├──────────────────┤
          │ _id              │
          │ name             │
          │ description      │
          └──────────────────┘


          ┌──────────────────┐
          │    Supplier      │
          ├──────────────────┤
          │ _id              │
          │ companyName      │
          │ contactPerson    │
          │ email            │
          │ phone            │
          │ address          │
          └──────────────────┘


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





Cardinality (Important for Interviews)

| Relationship                         | Type                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| User → Product                       | One-to-Many                                                  |
| User → InventoryTransaction          | One-to-Many                                                  |
| User → AuditLog                      | One-to-Many                                                  |
| Category → Product                   | One-to-Many                                                  |
| Supplier → Product                   | One-to-Many                                                  |
| Supplier → PurchaseOrder             | One-to-Many                                                  |
| Product → InventoryTransaction       | One-to-Many                                                  |
| PurchaseOrder → InventoryTransaction | One-to-Many (or One-to-One if each PO is received only once) |



The order I recommend is:

User (independent)
Category (independent)
Supplier (independent)
Product (depends on User, Category, Supplier)
PurchaseOrder (depends on User, Supplier, Product)
InventoryTransaction (depends on User, Product, PurchaseOrder)
AuditLog (depends on User)