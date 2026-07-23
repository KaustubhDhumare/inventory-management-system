# Authentication Flow

## Register

```text
Client
    │
    ▼
Validator
    │
    ▼
validateRequest
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Hash Password
    │
    ▼
MongoDB
    │
    ▼
Generate Access Token
    │
    ▼
Generate Refresh Token
    │
    ▼
Store Refresh Token
    │
    ▼
Controller
    │
    ▼
HttpOnly Cookies
    │
    ▼
Response
```

---

## Login

```text
Client
    │
    ▼
Validator
    │
    ▼
validateRequest
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Find User
    │
    ▼
Compare Password
    │
    ▼
Generate Tokens
    │
    ▼
Store Refresh Token
    │
    ▼
Controller
    │
    ▼
HttpOnly Cookies
    │
    ▼
Response
```

---

## JWT Lifecycle

```text
Login
    │
    ▼
Access Token (15 min)
    │
    ▼
Protected Routes
    │
Expired
    ▼
Refresh Token (30 days)
    │
    ▼
Generate New Access Token
    │
    ▼
Continue Session
    │
Logout
    ▼
Refresh Token Revoked
```