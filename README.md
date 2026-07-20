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
server/
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── utils/
    ├── app.js
    └── server.js
```

---

## Future Enhancements

* Dashboard Analytics
* Barcode Scanner
* Export Reports (PDF/Excel)
* Activity Logs
* Multi-Warehouse Support
* Email Notifications
