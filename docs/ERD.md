# Database Relationships

```text
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
```

---

## Models

### User

- Authentication
- Roles
- Refresh Token

---

### Product

- SKU
- Price
- Quantity
- Category
- Supplier

---

### Category

Product grouping.

---

### Supplier

Supplier information.

---

### Purchase Order

Tracks purchased inventory.

Embedded ordered items.

---

### Inventory Transaction

Tracks every stock movement.

---

### Audit Log

Tracks every database modification.