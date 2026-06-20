# CU Nepal — Developer Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Coding Conventions](#8-coding-conventions)
9. [Nepal-Specific Features](#9-nepal-specific-features)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Debugging Guide](#11-debugging-guide)
12. [AI Agent Handoff Guide](#12-ai-agent-handoff-guide)

---

## 1. Project Overview

A full-featured web-based convenience store management system inspired by **CU**, **GS25**, and **Seven Eleven** in South Korea, built for the Nepal market.

**Core purpose:** Replace manual store operations with a digital POS + inventory + management system that works even with unreliable internet.

**Key differentiators from generic POS systems:**
- Nepal-specific: NPR currency, 13% VAT, Khalti/eSewa payments, PAN numbers, Devanagari script support
- Offline resilience: POS works without internet and syncs later
- Korean convenience store workflows: shift floats, receipt printing, hold/recall transactions
- Bilingual: English + Nepali throughout

---

## 2. Architecture & Tech Stack

### System Architecture

```
┌──────────────────────────────┐
│     Web Browser (React SPA)  │
│  Login │ POS │ Admin │ Reports│
└──────────────┬───────────────┘
               ↕ HTTP (REST)
┌──────────────┴───────────────┐
│    Express REST API Server   │
│  Auth → CRUD → POS → Reports │
└──────────────┬───────────────┘
               ↕ Prisma ORM
┌──────────────┴───────────────┐
│        Database (SQLite/     │
│        PostgreSQL)           │
└──────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React + TypeScript | 18 / 5.5 | UI framework |
| **Build Tool** | Vite | 8.x | Fast dev/build |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **State (client)** | Zustand | 5.x | Auth state, UI state |
| **Server State** | TanStack Query | 5.x | API caching, mutations |
| **HTTP Client** | Axios | 1.x | API calls |
| **Backend** | Node.js + Express | 24 / 4.21 | REST API |
| **Database** | SQLite (dev) / PostgreSQL (prod) | — | Data storage |
| **ORM** | Prisma | 6.x | Type-safe DB access |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | — | Authentication |
| **Validation** | Zod | 3.x | Schema validation (shared) |
| **Payment** | Khalti API / eSewa API | — | Nepal mobile payments |
| **Receipt** | ESC/POS protocol | — | Thermal printer output |

**Why SQLite for dev:** Zero setup, no separate database server needed. Prisma makes the switch to PostgreSQL a one-line config change (`provider = "postgresql"` + `DATABASE_URL` env var).

---

## 3. Project Structure

```
CU/
├── package.json                    # Root scripts (npm run dev:server, etc.)
├── DEVELOPER.md                    # ← You are here
├── README.md                       # Quick start guide
├── docker-compose.yml              # NOT YET CREATED
│
├── packages/
│   ├── server/                     # Express backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env                    # DATABASE_URL, JWT_SECRET
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Full database schema
│   │   │   ├── seed.ts             # Sample data seeder
│   │   │   └── dev.db              # SQLite database file (auto-generated)
│   │   └── src/
│   │       ├── index.ts            # Express app entry point
│   │       ├── lib/
│   │       │   └── prisma.ts       # Prisma client singleton
│   │       ├── middleware/
│   │       │   └── auth.ts         # JWT auth + role middleware
│   │       └── routes/
│   │           ├── auth.ts         # /api/auth (login, register, me)
│   │           ├── stores.ts       # /api/stores CRUD
│   │           ├── categories.ts   # /api/categories CRUD + tree
│   │           └── products.ts     # /api/products CRUD + search + barcode
│   │
│   └── web/                        # React frontend
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts          # Proxy /api → localhost:3000
│       ├── index.html
│       └── src/
│           ├── main.tsx            # React entry point
│           ├── App.tsx             # Routes + providers
│           ├── index.css           # Tailwind import
│           ├── api/
│           │   ├── client.ts       # Axios instance w/ auth interceptor
│           │   └── auth.ts         # Auth API functions + types
│           ├── stores/
│           │   └── authStore.ts    # Zustand auth store
│           ├── components/
│           │   └── Layout.tsx      # Sidebar + Outlet layout
│           └── pages/
│               ├── Login.tsx       # Login page
│               ├── Dashboard.tsx   # Dashboard with stats + stores
│               └── Products.tsx    # Product list with search/filter
```

### Pattern: New Route Files

When adding a new API route:
1. Create `src/routes/{entity}.ts` in server package
2. Define Zod schemas at the top of the file (import from shared if it grows)
3. Export the router
4. Register in `src/index.ts` with `app.use('/api/{entity}', router)`

### Pattern: New Pages

When adding a new page:
1. Create `src/pages/{PageName}.tsx` in web package
2. Use TanStack Query's `useQuery` for data fetching
3. Add route in `App.tsx` inside the protected `<Layout>` element

---

## 4. Getting Started

### Prerequisites

- Node.js v20+ (project uses v24)
- npm v9+

### Setup

```bash
# 1. Install all dependencies
cd packages/server && npm install
cd packages/web && npm install
cd ../..

# 2. Generate Prisma client and create database
cd packages/server
npx prisma generate
npx prisma db push      # Creates SQLite DB from schema
npx tsx prisma/seed.ts   # Seeds sample data
cd ../..
```

### Run Development

```bash
# Terminal 1 — Backend API (http://localhost:3000)
cd packages/server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd packages/web && npm run dev
```

### Default Credentials

| Email | Password | Role |
|---|---|---|
| admin@cu.com | admin123 | OWNER |

### Useful Commands

```bash
# Prisma Studio (GUI database browser)
cd packages/server && npx prisma studio

# Reset database and re-seed
cd packages/server
npx prisma db push --force-reset
npx tsx prisma/seed.ts

# TypeScript check (no build)
cd packages/web && npx tsc --noEmit
```

---

## 5. Database Schema

### Entity Relationship Overview

```
Store 1─* User
Store 1─* Stock
Store 1─* Transaction
Store 1─* Customer
Store 1─* Shift
Store 1─* Expense
Store 1─* PurchaseOrder

User 1─* Transaction (as cashier)
User 1─* StockMovement
User 1─* Shift
User 1─* PurchaseOrder (as creator)

Category 1─* Product
Brand 1─* Product
Category ── Category (self-referencing parent/child)

Product 1─* Stock
Product 1─* StockMovement
Product 1─* TransactionItem
Product 1─* PurchaseOrderItem

Supplier 1─* PurchaseOrder
PurchaseOrder 1─* PurchaseOrderItem

Customer 1─* Transaction
Transaction 1─* TransactionItem
Transaction 1─* Payment
```

### Complete Schema

See `packages/server/prisma/schema.prisma` for the full schema. Key models:

### `User`
| Field | Type | Notes |
|---|---|---|
| id | Int | PK, auto-increment |
| name | String | |
| email | String | Unique |
| phone | String? | |
| passwordHash | String | bcrypt hashed |
| role | Enum | OWNER / MANAGER / CASHIER / INVENTORY_CLERK |
| storeId | Int? | FK → Store |
| isActive | Boolean | Soft delete flag |

### `Store`
| Field | Type | Notes |
|---|---|---|
| id | Int | PK |
| name | String | |
| address | String? | |
| phone | String? | |
| taxRate | Float | Default 13.0 (Nepal VAT) |
| currency | String | Default "NPR" |

### `Product`
| Field | Type | Notes |
|---|---|---|
| id | Int | PK |
| barcode | String | Unique — scanned at POS |
| nameEn | String | English name |
| nameNe | String? | Nepali name (Devanagari) |
| sku | String? | Unique, optional |
| categoryId | Int? | FK → Category |
| brandId | Int? | FK → Brand |
| unit | String | pcs / kg / L / pack |
| price | Float | Selling price in NPR |
| costPrice | Float? | Cost for P&L calculation |
| taxRate | Float | Default 13.0 |
| minStock | Int | Low stock alert threshold |

### `Transaction`
| Field | Type | Notes |
|---|---|---|
| id | Int | PK |
| receiptNo | String | Unique, generated |
| storeId | Int | FK → Store |
| cashierId | Int | FK → User |
| customerId | Int? | FK → Customer |
| subtotal | Float | Before tax/discount |
| tax | Float | Calculated VAT |
| discount | Float | Total discount |
| total | Float | Final amount |
| status | Enum | COMPLETED / REFUNDED / VOID / HELD |

---

## 6. API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |

**POST /api/auth/login**
```json
// Request
{ "email": "admin@cu.com", "password": "admin123" }
// Response
{ "user": { "id": 1, "name": "...", "email": "...", "role": "OWNER", "storeId": 1 }, "token": "eyJ..." }
```

**POST /api/auth/register**
```json
// Request
{ "name": "New User", "email": "user@cu.com", "password": "pass123", "role": "CASHIER", "storeId": 1 }
```

### Stores

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/stores` | JWT | Any | List all stores |
| GET | `/api/stores/:id` | JWT | Any | Get store details |
| POST | `/api/stores` | JWT | OWNER/MANAGER | Create store |
| PUT | `/api/stores/:id` | JWT | OWNER/MANAGER | Update store |
| DELETE | `/api/stores/:id` | JWT | OWNER | Deactivate store |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | JWT | List all categories |
| GET | `/api/categories/tree` | JWT | Nested hierarchy |
| POST | `/api/categories` | JWT | Create category |
| PUT | `/api/categories/:id` | JWT | Update category |
| DELETE | `/api/categories/:id` | JWT | Deactivate category |

### Products

| Method | Endpoint | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | `/api/products` | JWT | search, categoryId, barcode, page, limit | Search/list products |
| GET | `/api/products/barcode/:barcode` | JWT | — | Lookup by barcode (for POS scan) |
| POST | `/api/products` | JWT | — | Create product |
| PUT | `/api/products/:id` | JWT | — | Update product |
| DELETE | `/api/products/:id` | JWT | — | Deactivate product |

**GET /api/products?search=wai&categoryId=4&page=1&limit=50**
```json
{
  "products": [
    {
      "id": 1,
      "barcode": "8901012345678",
      "nameEn": "Wai Wai Noodles",
      "nameNe": "वाइ वाइ चाउचाउ",
      "price": 20,
      "costPrice": 16,
      "unit": "pcs",
      "category": { "id": 4, "nameEn": "Instant Noodles" },
      "brand": null,
      "minStock": 20
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}

### Brands

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/brands` | JWT | List active brands (with product count) |
| POST | `/api/brands` | JWT | Create brand |
| PUT | `/api/brands/:id` | JWT | Update brand |
| DELETE | `/api/brands/:id` | JWT | Deactivate brand (soft delete) |

### Stock & Inventory

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/api/stock` | storeId | List stock levels for a store |
| GET | `/api/stock/movements` | storeId, limit | Stock movement history |
| GET | `/api/stock/low-stock` | storeId | Low stock / out of stock alerts |
| GET | `/api/stock/expiring` | storeId, withinDays | Expiring & expired stock items |
| POST | `/api/stock/movement` | — | Record stock in/out/adjust |
| POST | `/api/stock/transfer` | — | Atomic transfer between stores |

**POST /api/stock/movement**
```json
// Request
{ "productId": 1, "storeId": 1, "type": "IN", "quantity": 50, "batchNo": "B2024-01", "expiryDate": "2025-12-31" }
```

**POST /api/stock/transfer**
```json
// Request
{ "productId": 1, "fromStoreId": 1, "toStoreId": 2, "quantity": 10 }
// Response
{ "message": "Transfer completed", "movement": { ... } }
```

### Suppliers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/suppliers` | JWT | List active suppliers (with order count) |
| GET | `/api/suppliers/:id` | JWT | Supplier detail with purchase orders |
| POST | `/api/suppliers` | JWT | Create supplier (name, contact, PAN, etc.) |
| PUT | `/api/suppliers/:id` | JWT | Update supplier |
| DELETE | `/api/suppliers/:id` | JWT | Deactivate supplier |

### Purchase Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/purchase-orders` | JWT | List POs (filter by storeId) |
| GET | `/api/purchase-orders/:id` | JWT | PO detail with items |
| POST | `/api/purchase-orders` | JWT | Create PO (with line items) |
| POST | `/api/purchase-orders/:id/receive` | JWT | Receive all PO items into stock |
| POST | `/api/purchase-orders/:id/cancel` | JWT | Cancel PO |
```

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Returns `{ status: "ok", timestamp: "..." }` |

### Auth Header

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## 7. Frontend Architecture

### State Management Strategy

Two-layer approach:

1. **Server state** (TanStack Query / React Query) — API data (products, stores, transactions, etc.)
   - Auto-caching, background refetch, optimistic updates
   - Use `useQuery` for reads, `useMutation` for writes
   - Query keys follow convention: `['entity', ...params]`

2. **Client state** (Zustand) — UI state that doesn't come from server
   - Currently: `authStore` (user + token)
   - Future: cart state in POS, UI preferences

### Data Flow

```
User Action
  → React Component
    → TanStack Query (useMutation / queryClient.invalidateQueries)
      → Axios (api/client.ts)
        → Express API
          → Prisma
            → Database
```

### Routing Structure

```
/login          → Login page (public)
/               → Dashboard (protected, wrapped in Layout)
/products       → Product list
/categories     → Category management
/stores         → Store management
/customers      → Customer management
/pos            → POS terminal
```

The `Layout` component provides the sidebar navigation. All routes except `/login` are wrapped in `ProtectedRoute` which redirects to login if no token.

### API Client Configuration

`api/client.ts` configures Axios with:
- Base URL `/api` (proxied by Vite in dev)
- Auth token auto-attached from localStorage
- Auto-redirect to `/login` on 401

---

## 8. Coding Conventions

### General

- **TypeScript only** — no plain JS anywhere
- **ESModule imports** — `import` not `require`
- **Async/await** — avoid raw `.then()` chains
- **Zod for validation** — all API request bodies validated with Zod schemas

### Backend

- **File naming:** kebab-case (`auth.ts`, `purchase-orders.ts`)
- **Route files** export a `Router` instance
- **Route handlers** follow pattern:
  ```typescript
  router.post('/endpoint', authMiddleware, optionalRoleCheck, async (req, res) => {
    try {
      const data = schema.parse(req.body);
      // business logic
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors });
        return;
      }
      res.status(500).json({ error: 'Failed to do thing' });
    }
  });
  ```
- **Auth middleware** goes first, then role check, then handler
- **Prisma queries** in route handlers directly (no separate service layer yet — only add one when a route gets complex)

### Frontend

- **File naming:** PascalCase for components (`Products.tsx`), camelCase for utilities
- **Components** are default-exported functions
- **API types** defined alongside API functions in `api/` files
- **Zustand stores** in `stores/` — one store per domain
- **React Query** for all server data — no manual `useEffect` fetching
- **Props interface** defined inline unless shared

### Database

- **Soft deletes** via `isActive: Boolean` field — never hard-delete
- **Timestamps** — every model has `createdAt` and `updatedAt`
- **SQLite for dev**, PostgreSQL for production — switch via `schema.prisma` datasource

---

## 9. Nepal-Specific Features

These are critical to maintain:

| Feature | Implementation | Status |
|---|---|---|
| **NPR currency** | Default currency on Store model, display as "NPR 100" | ✅ Done |
| **13% VAT** | `taxRate` field on Store (default 13.0), auto-calculated on transactions | ✅ Schema ready |
| **Bilingual names** | `nameEn` + `nameNe` on Category and Product | ✅ Done |
| **Khalti payment** | Payment model has `KHALTI` type, API integration needed | 🔜 Planned |
| **eSewa payment** | Payment model has `ESEWA` type, API integration needed | 🔜 Planned |
| **PAN number** | `panNo` field on Supplier model | ✅ Schema ready |
| **Devanagari script** | Unicode support in `nameNe` fields, Nepali translations | ✅ Done |

When adding a new feature that has a Nepal-specific aspect (tax, currency, language, payment, regulation), always handle it.

---

## 10. Implementation Roadmap

### Phase 1 — Foundation ✅ DONE
- [x] Monorepo scaffold (server + web packages)
- [x] Prisma schema (14 models)
- [x] Auth system (JWT + roles)
- [x] Store CRUD API
- [x] Category CRUD API (bilingual)
- [x] Product CRUD API (bilingual, barcode search)
- [x] Login page
- [x] Dashboard page
- [x] Products list page
- [x] Sidebar layout with navigation

### Phase 2 — Products & Inventory ✅ DONE
- [x] Brands CRUD API + page
- [x] Stock CRUD (in/out/adjust)
- [x] Stock levels display on product page
- [x] Low stock alerts
- [x] Supplier CRUD API + page
- [x] Purchase order creation + receipt
- [x] Stock transfers between stores (atomic TRANSFER_OUT + TRANSFER_IN)
- [x] Expiry date tracking (expiring/expired stock alerts)
- [x] Stock transfer API (`POST /api/stock/transfer`)
- [x] Expiry tracking API (`GET /api/stock/expiring`)

### Phase 3 — POS Core
- [ ] POS page layout (cart + keypad + product grid)
- [ ] Barcode scan input (USB scanner)
- [ ] Manual product search/add to cart
- [ ] Cart display (qty, price, discount per item)
- [ ] Subtotal → Tax (13%) → Total calculation
- [ ] Cash payment flow (amount tendered → change due)
- [ ] Card payment flow
- [ ] Receipt generation (thermal printer via ESC/POS)
- [ ] Hold/recall transactions
- [ ] Transaction history + detail view
- [ ] Refunds

### Phase 4 — Payments & Customers
- [ ] Khalti API integration (payment initiation + verification)
- [ ] eSewa API integration
- [ ] Split payment support (cash + Khalti)
- [ ] Customer CRUD page
- [ ] Phone number search on POS
- [ ] Loyalty points (earn + redeem)
- [ ] Purchase history per customer

### Phase 5 — Operations
- [ ] Shift management (clock in/out, cash float)
- [ ] Employee CRUD page
- [ ] Shift schedule
- [ ] Reporting dashboard (sales chart, top products)
- [ ] Daily/Weekly/Monthly sales report
- [ ] Profit & Loss report (with COGS)
- [ ] VAT summary report
- [ ] PDF/Excel export

### Phase 6 — Polish & Deploy
- [ ] Bilingual UI toggle (English ↔ Nepali)
- [ ] Discounts & promotions CRUD
- [ ] Expenses tracking
- [ ] Offline mode (Service Worker + IndexedDB)
- [ ] Docker Compose setup
- [ ] PostgreSQL migration guide
- [ ] Seed data for Nepal (common products, categories)
- [ ] Backup strategy
- [ ] Deployment guide

---

## 11. Debugging Guide

### Common Issues

#### Prisma / Database

| Problem | Solution |
|---|---|
| `Environment variable not found: DATABASE_URL` | Create `packages/server/.env` with `DATABASE_URL="file:./dev.db"` |
| Prisma client errors after schema change | Run `npx prisma generate` then `npx prisma db push` |
| Database out of sync with schema | `npx prisma db push --force-reset` (⚠️ deletes data) |
| Relation field errors in schema | Check both sides of the relation exist with matching `@relation()` names |

#### Express Server

| Problem | Solution |
|---|---|
| Port 3000 already in use | Kill process: `npx kill-port 3000` or find PID with `netstat -ano \| findstr :3000` |
| Startup fails silently | Run `npx tsx src/index.ts` without background task to see errors |
| Routes not working | Check the route is registered in `src/index.ts` |

#### Frontend

| Problem | Solution |
|---|---|
| `Failed to fetch` on API calls | Is the Express server running on port 3000? Is the Vite proxy configured? |
| Tailwind classes not applying | Ensure `@import "tailwindcss"` is in `src/index.css` |
| TypeScript errors from node_modules | Run `npx tsc --noEmit` — ignore errors from node_modules usually |
| Blank page, no errors | Check React DevTools — component might be throwing during render |

### Debugging Workflow

```bash
# 1. Check server is up
curl http://localhost:3000/api/health

# 2. Check Prisma schema
cd packages/server && npx prisma validate

# 3. View database directly
cd packages/server && npx prisma studio

# 4. Check frontend compilation
cd packages/web && npx tsc --noEmit

# 5. Reset everything
cd packages/server
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

### Useful Scripts

To quickly reset and seed the database on Windows:
```cmd
cd packages/server
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

---

## 12. AI Agent Handoff Guide

This section is specifically for when an AI assistant (like Claude, ChatGPT, etc.) continues work on this project in a new session.

### Project Context (Read This First)

**What this project is:** A convenience store management system (POS + inventory + admin) for Nepal, inspired by Korean CU/GS25/Seven Eleven stores.

**Current state:** Phase 1 and Phase 2 complete — monorepo scaffolded, database modeled, auth working, full CRUD APIs built (auth, stores, categories, products, brands, stock/inventory, suppliers, purchase orders), React frontend with login/dashboard/products/brands/stock/suppliers/purchase-orders pages. Stock transfers and expiry date tracking implemented.

**Auth:** JWT-based. Token stored in localStorage. Every API call (except login/register) requires `Authorization: Bearer <token>` header.

**Database:** SQLite via Prisma for development. Switch to PostgreSQL by changing one line in `schema.prisma` and setting `DATABASE_URL` to a PostgreSQL connection string.

**Bilingual:** Categories and products have both `nameEn` (English) and `nameNe` (Nepali/Devanagari) fields.

**Currency:** NPR throughout. Tax rate defaults to 13% (Nepal VAT).

### Key Files an Agent Should Read First

| File | Why |
|---|---|
| `packages/server/prisma/schema.prisma` | Complete data model — read this before adding any feature |
| `packages/server/src/index.ts` | Route registration — add new routes here |
| `packages/server/src/middleware/auth.ts` | Auth logic, JWT payload shape, role guards |
| `packages/web/src/App.tsx` | All routes defined here |
| `packages/web/src/api/client.ts` | Axios config, auth interceptor pattern |
| `packages/web/src/stores/authStore.ts` | Zustand auth store pattern |

### Agent Action Patterns

**To add a new API endpoint:**
1. Add the route handler in `packages/server/src/routes/{name}.ts`
2. Register it in `packages/server/src/index.ts` with `app.use('/api/{name}', router)`
3. Create/update Prisma schema if new tables/fields needed
4. Create frontend API client in `packages/web/src/api/{name}.ts`
5. Create page component in `packages/web/src/pages/{Name}.tsx`
6. Add route in `packages/web/src/App.tsx`

**To add a new database model:**
1. Add model to `packages/server/prisma/schema.prisma`
2. Run `npx prisma generate && npx prisma db push`
3. Update seed file if needed

**To fix a bug:**
1. Check seed data exists (run `npx tsx prisma/seed.ts` if database is empty)
2. Test the endpoint with curl
3. Check Prisma Studio for data state
4. Check browser DevTools for frontend errors

### Environment Variables (Required)

Create `packages/server/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cu-system-secret-change-in-production"
```

### Verification Checklist for New Features

- [ ] TypeScript compiles (`npx tsc --noEmit` in both packages)
- [ ] Schema validates (`npx prisma validate`)
- [ ] API works with curl
- [ ] Frontend renders without errors
- [ ] Auth protected (endpoint returns 401 without valid token)
- [ ] Role protected (endpoint returns 403 for insufficient roles)
- [ ] Seed data still works (or updated)
- [ ] Bilingual fields handled (if applicable to feature)
- [ ] Nepal-specific: VAT / NPR considered (if applicable)

### Tech Debt & Known Issues

- No centralized error handling middleware — every route has its own try/catch
- No pagination component on frontend (basic offset/limit works but no UI pagination)
- No input validation feedback on frontend forms
- Seed script uses hardcoded IDs — may conflict if database already has data
- No logging system
- Receipt printing not yet implemented
- No tests yet (unit or integration)
- Store ID is hardcoded to 1 in frontend pages (multi-store support deferred)
