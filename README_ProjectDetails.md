# Inventory Management System

A full-stack MERN Inventory Management System designed to help businesses manage products, suppliers, categories, purchase orders, and inventory transactions securely and efficiently.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Express Validator
- Cookie Parser

### Frontend *(Coming Soon)*
- React.js
- React Router
- Tailwind CSS
- Axios

---

## Database Models

- User
- Category
- Supplier
- Product
- PurchaseOrder
- InventoryTransaction
- AuditLog

---

## Project Structure

```text
server/
│
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# Development Progress

## ✅ Objective 1 — Project Planning

- Finalized project features
- Defined user roles
- Designed database architecture

---

## ✅ Objective 2 — Project Initialization

- Node.js project setup
- ES Modules configuration
- Environment configuration
- Git setup
- Installed dependencies

---

## ✅ Objective 3 — Backend Foundation

- Express server
- MongoDB Atlas connection
- Application middleware
- Project structure
- Server configuration

---

## ✅ Objective 4 — Database Architecture

Implemented all database models with validations and relationships.

- User
- Category
- Supplier
- Product
- PurchaseOrder
- InventoryTransaction
- AuditLog

---

## 🚧 Objective 5 — Authentication & Authorization

### Completed

- User Registration API
- User Login API
- Password Hashing (bcrypt)
- JWT Access Token
- JWT Refresh Token
- HttpOnly Cookie Authentication
- Request Validation
- Authentication Services
- Standard API Responses
- Global Error Handling

### Remaining

- Logout API
- Refresh Token API
- Authentication Middleware
- Role-Based Authorization Middleware

---

## ⏳ Upcoming Objectives

### Objective 6 — Core Business APIs

- Category APIs
- Supplier APIs
- Product APIs
- Purchase Order APIs
- Inventory Transaction APIs
- Dashboard APIs

### Objective 7 — Validation & Error Handling

- Complete request validation
- Error handling improvements
- Response standardization

### Objective 8 — Security & Optimization

- Helmet
- Rate Limiting
- Secure Cookies
- CORS Configuration
- Performance Optimization

### Objective 9 — Testing

- Postman API Testing
- Edge Case Testing
- Bug Fixes

### Objective 10 — Documentation & Deployment

- API Documentation
- Environment Setup Guide
- Backend Deployment

---

## Current Status

Backend development is currently focused on completing the authentication and authorization module before implementing the business APIs.