# StockPilot Frontend

React 18 + Vite frontend for the inventory backend in `../backend/src`.

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend API base URL (for example `http://localhost:5000/api/v1`).
2. From this directory, run `npm install`, then `npm run dev`.
3. Run `npm run build` to create the production bundle in `dist/`.

The backend must allow the frontend origin through `FRONTEND_URL` and CORS credentials. Authentication uses the backend's HTTP-only `accessToken` and `refreshToken` cookies. The client does not persist tokens in browser storage.

## API contract audit

Every success response uses `{ statusCode, success, message, data }`. Errors use `{ success: false, message, error? }`; Express Validator entries use `msg` and `path`, while Mongoose validation uses `field` and `message`. Paginated lists return a resource object and `pagination` with `page`, `limit`, a resource-specific `totalDocument`/`totalDocumnet`, and `totalPages`.

| Resource | Method and path | Access | Request / query | `data` payload |
|---|---|---|---|---|
| Auth | `POST /auth/register` | Public | `{ name, email, password }` | `{ user }` |
| Auth | `POST /auth/login` | Public | `{ email, password }` | `{ user }` |
| Auth | `POST /auth/refresh-token` | Refresh cookie | No body | `{ user }` |
| Auth | `POST /auth/logout` | Authenticated | No body | `null` |
| Dashboard | `GET /dashboard` | Admin, employee | No query | `{ dashboard: { inventory, totalSuppliers, totalCategories, pendingPurchaseOrders, partiallyReceivedPurchaseOrders, recentTransactions, recentPurchaseOrders } }` |
| Products | `GET /products` | Authenticated | `page, limit, search, sortBy, sortOrder`; search matches name only | `{ products: { product, pagination } }` |
| Products | `GET /products/:id` | Authenticated | Mongo ID | `{ product }` |
| Products | `POST /products` | Admin | `name, sku, description?, price, quantity, minimumStock?, unit?, category, supplier` | `{ product }` |
| Products | `PATCH /products/:id` | Admin | Any editable product fields | `{ product }` |
| Products | `PATCH /products/:id/status` | Admin | `{ isActive }` | `{ product }` |
| Categories | `GET /categories` | Authenticated | `page, limit, search, sortBy, sortOrder`; search by name | `{ categories: { categories, pagination } }` |
| Categories | `GET /categories/:id` | Authenticated | Mongo ID | `{ category }` |
| Categories | `POST /categories` | Admin | `{ name, description? }` | `{ category }` |
| Categories | `PATCH /categories/:id` | Admin | `{ name?, description? }` | `{ category }` |
| Categories | `PATCH /categories/:id/status` | Admin | `{ isActive }` | `{ category }` |
| Suppliers | `GET /suppliers` | Authenticated | `page, limit, search, sortBy, sortOrder`; search by company name | `{ suppliers: { suppliers, pagination } }` |
| Suppliers | `GET /suppliers/:id` | Authenticated | Mongo ID | `{ supplier }` |
| Suppliers | `POST /suppliers` | Admin | `companyName, contactPerson, email, phoneNo, address` | `{ supplier }` |
| Suppliers | `PATCH /suppliers/:id` | Admin | Editable supplier fields | `{ supplier }` |
| Suppliers | `PATCH /suppliers/:id/status` | Admin | `{ isActive }` | `{ supplier }` |
| Purchase orders | `GET /purchase-orders` | Admin | `page, limit, search` (PO number), `sortBy, sortOrder` | `{ purchaseOrders: { purchaseOrder, pagination } }` |
| Purchase orders | `GET /purchase-orders/:id` | Admin | Mongo ID | `{ purchaseOrder }` (supplier and ordered product references populated) |
| Purchase orders | `POST /purchase-orders` | Admin | `{ supplier: id, orderedItems: [{ product: id, orderedQuantity, unitCost }], expectedDeliveryDate?, notes? }` | `{ purchaseOrder }` |
| Purchase orders | `PATCH /purchase-orders/:id` | Admin | Supplier, ordered items, expected date and/or notes | `{ purchaseOrder }` (only pending orders) |
| Purchase orders | `PATCH /purchase-orders/:id/status` | Admin | `{ status: "CANCELLED" }` | `{ purchaseOrder }` (only pending orders) |
| Inventory | `POST /inventory-transactions/purchase-order/:id/receive` | Admin | `{ items: [{ product: id, receivedQuantity }], remarks? }` | `{ purchaseOrder }` |
| Inventory | `POST /inventory-transactions/sale` | Admin | `{ product: id, quantity, remarks }` | `{ result: { product, transaction } }` |
| Inventory | `POST /inventory-transactions/return` | Admin | `{ product: id, quantity, remarks }` | `{ result: { product, transaction } }` |
| Inventory | `POST /inventory-transactions/damage` | Admin | `{ product: id, quantity, remarks }` | `{ result: { product, transaction } }` |
| Inventory | `POST /inventory-transactions/adjust` | Admin | `{ product: id, quantity, adjustmentType: "INCREASE" | "DECREASE", remarks }` | `{ result: { product, transaction } }` |
| Transactions | `GET /inventory-transactions` | Admin | `page, limit, product?, purchaseOrder?, type?, sortOrder?` | `{ transactions: { transactions, pagination } }` |

## Verified mismatches and unavailable features

- Product relation handling conflicts with the general ID rule in the supplied prompt: `product.service.js` looks up category and supplier by their names, even though update validation says those fields must be Mongo IDs. Product create/update forms send names to match the service. Product detail and product-list responses do not populate these references.
- Categories, suppliers, and products have no delete endpoints. The UI uses the supported `PATCH .../:id/status` deactivation action.
- Product search is name-only. The API has no category/supplier/stock filters. Alerts show authoritative dashboard counts and explain that a complete low-stock product list cannot be fetched.
- The transaction list is paginated and has no date filter or detail endpoint. Movement charts, date filtering, and a standalone transaction detail route are therefore omitted; transaction rows open their returned detail data in a dialog.
- Dashboard stock counts are disjoint: low stock is active products where `quantity > 0 && quantity <= minimumStock`; out of stock is active products where `quantity === 0`. The donut derives in-stock count from `activeProducts - lowStockProducts - outOfStockProducts`.
- Registration validators do not allow a role field, and the UI does not send one. However, the backend registration service currently accepts a `role` property from the raw request body. Role assignment should be restricted in the backend before public registration is considered safe.
- Backend role constants include `manager`, but dashboard authorization allows only `admin` and `employee`; the frontend exposes admin tools only to `admin`.

## Structure

`src/api` centralizes Axios and API functions; `src/auth` handles cookie-backed session state; `src/components` is reserved for reusable page components as the app grows; `src/constants` contains status/navigation mappings; `src/styles/index.css` defines theme tokens; `src/utils` contains formatting helpers.
