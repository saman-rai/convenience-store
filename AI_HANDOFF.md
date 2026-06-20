# CU Nepal — AI Agent Handoff

> Everything an AI agent needs to understand, build, and continue this project.

---

## Quick Start

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd packages/server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd packages/web && npm run dev

# Default login: admin@cu.com / admin123
```

---

## 1. Project Identity

**What this is:** A full-featured web-based convenience store management system (POS + inventory + admin) purpose-built for the Nepal market, inspired by CU, GS25, and Seven Eleven stores in South Korea. It replaces manual ledger-based store operations with a digital system.

**Current state:** Phases 1 and 2 are **complete**. Phases 3-6 are **pending**. See [Section 7](#7-roadmap--next-tasks) for the full roadmap.

**Vision:** Become the operating system for Nepal's 50,000+ small-format retail stores.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite 8 | SPA |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Server state** | TanStack Query 5 | API caching, mutations |
| **Client state** | Zustand 5 | Auth state, UI state |
| **HTTP client** | Axios 1.x | API calls |
| **Backend** | Node.js 24 + Express 4.21 | REST API |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Data storage |
| **ORM** | Prisma 6 | Type-safe DB access |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | Authentication |
| **Validation** | Zod 3.x | Request validation |
| **Payments (future)** | Khalti API / eSewa API | Nepal mobile wallets |
| **Receipt (future)** | ESC/POS protocol | Thermal printer |

---

## 3. Project Structure

```
CU/
├── package.json                     # Root: concurrently runs both packages
├── DEVELOPER.md                     # Full developer docs (715 lines)
├── IMPLEMENTATION_PLAN.md           # Complete business + tech plan (1100+ lines)
├── FUTURE_PLAN.md                   # Long-term product vision (550 lines)
├── README.md                        # Quick start guide
├── .gitignore
│
├── packages/
│   ├── server/                      # Express backend (port 3000)
│   │   ├── .env                     # DATABASE_URL + JWT_SECRET
│   │   ├── .env.example            # Template for .env
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # 16 models (see Section 4)
│   │   │   └── seed.ts              # Admin user + sample data
│   │   └── src/
│   │       ├── index.ts             # Entry point + route registration
│   │       ├── lib/prisma.ts        # Prisma client singleton
│   │       ├── middleware/auth.ts   # JWT auth + role middleware
│   │       ├── services/stock.ts    # Stock movement business logic
│   │       └── routes/
│   │           ├── auth.ts          # POST login, register, GET me
│   │           ├── stores.ts        # CRUD stores
│   │           ├── categories.ts    # CRUD categories (bilingual)
│   │           ├── products.ts      # CRUD products + barcode search
│   │           ├── brands.ts        # CRUD brands
│   │           ├── stock.ts         # Levels, movements, transfers, expiry
│   │           ├── suppliers.ts     # CRUD suppliers
│   │           └── purchase-orders.ts # CRUD + receive + cancel
│   │
│   └── web/                         # React frontend (port 5173)
│       ├── vite.config.ts           # Proxy /api → localhost:3000
│       └── src/
│           ├── main.tsx             # Entry point
│           ├── App.tsx              # Router + QueryClientProvider
│           ├── index.css            # Tailwind import
│           ├── api/
│           │   ├── client.ts        # Axios + auth interceptor
│           │   └── auth.ts          # Login API
│           ├── stores/authStore.ts  # Zustand (user + token)
│           ├── components/Layout.tsx # Sidebar + Outlet
│           └── pages/
│               ├── Login.tsx        # Pre-filled admin login
│               ├── Dashboard.tsx    # Store stats + list
│               ├── Products.tsx     # Search, filter, CRUD
│               ├── Brands.tsx       # Brand management
│               ├── Stock.tsx        # Levels, movements, alerts, transfers, expiry
│               ├── Suppliers.tsx    # Supplier management
│               └── PurchaseOrders.tsx # PO create, receive, cancel
```

---

## 4. Database Schema (16 Models)

### Entity Relationships

```
Store ──1:N── User
Store ──1:N── Stock
Store ──1:N── Transaction
Store ──1:N── PurchaseOrder
Store ──1:N── Shift
Store ──1:N── Expense
Store ──1:N── Customer

Category ──1:N── Product
Brand ──1:N── Product
Category ──self── Category (parent/child)

Product ──1:N── Stock (per store + batch)
Product ──1:N── StockMovement
Product ──1:N── TransactionItem
Product ──1:N── PurchaseOrderItem

Supplier ──1:N── PurchaseOrder
PurchaseOrder ──1:N── PurchaseOrderItem

Transaction ──1:N── TransactionItem
Transaction ──1:N── Payment
Customer ──1:N── Transaction
User ──1:N── Transaction (cashier)
User ──1:N── StockMovement
User ──1:N── PurchaseOrder (creator)
```

### Key Models (fields you'll reference most)

**User** — id, name, email (unique), passwordHash, role (OWNER/MANAGER/CASHIER/INVENTORY_CLERK), storeId?, isActive
**Store** — id, name, address?, phone?, taxRate (default 13.0), currency (NPR), isActive
**Product** — id, barcode (unique), nameEn, nameNe?, sku?, categoryId?, brandId?, unit (pcs/kg/L/pack), price, costPrice?, taxRate (13.0), minStock, isActive
**Category** — id, nameEn, nameNe?, parentId?, isActive
**Brand** — id, name (unique), isActive
**Stock** — id, productId, storeId, quantity, batchNo?, expiryDate?, *unique(productId, storeId, batchNo)*
**StockMovement** — id, productId, storeId, type (IN/OUT/ADJUST/TRANSFER_IN/TRANSFER_OUT), quantity, note?, userId
**Supplier** — id, name, contactPerson?, phone?, email?, address?, panNo? (Nepal tax ID), isActive
**PurchaseOrder** — id, poNumber (unique), supplierId, storeId, status (PENDING/PARTIAL/RECEIVED/CANCELLED), totalAmount?, notes?, createdBy, receivedAt?
**PurchaseOrderItem** — id, purchaseOrderId, productId, qtyOrdered, qtyReceived, unitPrice, total

### Nepal-Specific Design Decisions

- **NPR currency** — default on Store (NPR), display everywhere as "NPR X"
- **13% VAT** — `taxRate` on Store and Product, auto-calculated
- **Bilingual** — `nameEn` + `nameNe` on Category and Product
- **PAN** — `panNo` on Supplier (Nepal's tax registration number)
- **Khalti/eSewa** — Payment model has KHALTI/ESEWA types (ready for integration)
- **Soft deletes** — `isActive` on User, Store, Category, Brand, Product, Supplier

---

## 5. API Reference (All Existing Endpoints)

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login → { token, user } |
| POST | `/api/auth/register` | No | Create user |
| GET | `/api/auth/me` | JWT | Current user |

### Stores
| Method | Endpoint | Role Required | Description |
|---|---|---|---|
| GET | `/api/stores` | Any | List stores |
| GET | `/api/stores/:id` | Any | Store detail |
| POST | `/api/stores` | OWNER/MANAGER | Create store |
| PUT | `/api/stores/:id` | OWNER/MANAGER | Update store |
| DELETE | `/api/stores/:id` | OWNER | Deactivate store |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | List (flat) |
| GET | `/api/categories/tree` | Nested hierarchy |
| POST | `/api/categories` | Create (nameEn, nameNe) |
| PUT | `/api/categories/:id` | Update |
| DELETE | `/api/categories/:id` | Deactivate |

### Products
| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/api/products` | search, categoryId, barcode, page, limit | Search/list |
| GET | `/api/products/barcode/:barcode` | — | Barcode lookup (for POS) |
| POST | `/api/products` | — | Create |
| PUT | `/api/products/:id` | — | Update |
| DELETE | `/api/products/:id` | — | Deactivate |

### Brands
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/brands` | List (with product count) |
| POST | `/api/brands` | Create |
| PUT | `/api/brands/:id` | Update |
| DELETE | `/api/brands/:id` | Deactivate |

### Stock & Inventory
| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/api/stock` | storeId | Stock levels |
| GET | `/api/stock/movements` | storeId, limit | Movement history |
| GET | `/api/stock/low-stock` | storeId | Low stock / out of stock |
| GET | `/api/stock/expiring` | storeId, withinDays | Expiring/expired items |
| POST | `/api/stock/movement` | — | Record IN/OUT/ADJUST |
| POST | `/api/stock/transfer` | — | Atomic store-to-store transfer |

### Suppliers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/suppliers` | List (with PO count) |
| GET | `/api/suppliers/:id` | Detail with purchase history |
| POST | `/api/suppliers` | Create (name, PAN, contact) |
| PUT | `/api/suppliers/:id` | Update |
| DELETE | `/api/suppliers/:id` | Deactivate |

### Purchase Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/purchase-orders` | List (filter by storeId) |
| GET | `/api/purchase-orders/:id` | Detail with items |
| POST | `/api/purchase-orders` | Create (with line items) |
| POST | `/api/purchase-orders/:id/receive` | Receive all items into stock |
| POST | `/api/purchase-orders/:id/cancel` | Cancel |

### Auth Header
```
Authorization: Bearer <jwt_token>
```

### Example: Full Sale Flow (when POS is built)
```
1. Scan barcode → GET /api/products/barcode/:barcode
2. Add to cart (frontend state)
3. Complete sale → POST /api/transactions { items, payments }
4. Stock auto-decremented (server-side)
5. Receipt printed (ESC/POS thermal)
```

---

## 6. Frontend Architecture

### Pattern: Every page follows this template

```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function PageName() {
  const queryClient = useQueryClient();

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ['entity', param],
    queryFn: async () => { const res = await api.get('/endpoint'); return res.data; },
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: async (data) => { const res = await api.post('/endpoint', data); return res.data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entity'] }),
  });

  return ( /* JSX */ );
}
```

### State Management Rules
- **Server data** → TanStack Query (always). Never manual `useEffect` fetching.
- **Client-only state** → Zustand (auth, UI preferences, cart in future).
- **Form state** → React `useState` (keep it simple until forms are complex enough for React Hook Form).

### Routing Structure (App.tsx)
```
/login          → Login (public)
/               → Dashboard (protected, Layout wrapper)
/products       → Product list
/brands         → Brand management
/stock          → Stock & inventory (levels, movements, alerts, transfers, expiry)
/suppliers      → Supplier management
/purchase-orders → Purchase orders
/pos            → [PLACEHOLDER] POS terminal coming soon
/categories     → [PLACEHOLDER]
/stores         → [PLACEHOLDER]
/customers      → [PLACEHOLDER]
```

### Layout
- Sidebar on the left with navigation items
- `Outlet` renders the active page
- Header shows store name, user name, logout button
- Currently hardcoded to store ID 1 (multi-store support is deferred)

### API Client (api/client.ts)
- Axios instance with base URL `/api`
- Auth token auto-attached from localStorage
- Auto-redirects to `/login` on 401 response

---

## 7. Roadmap & Next Tasks

### ✅ Phase 1 — Foundation (COMPLETE)
Monorepo scaffold, Prisma schema (16 models), JWT auth (4 roles), Store/Category/Product CRUD APIs, Login/Dashboard/Products pages, Sidebar layout.

### ✅ Phase 2 — Products & Inventory (COMPLETE)
Brands CRUD, Stock CRUD (in/out/adjust/transfer), stock levels display, low stock alerts, Supplier CRUD (with PAN), Purchase orders (create/receive/cancel), Stock transfers (atomic between stores), Expiry tracking (expiring/expired alerts).

### 🔜 Phase 3 — POS Core (NEXT — HIGHEST PRIORITY)

| Task | Files to Create/Modify | Key Details |
|---|---|---|
| Transaction model endpoints | `routes/transactions.ts`, register in `index.ts` | POST create, GET list, GET detail, POST refund. Auto-calculate VAT. Auto-decrement stock. Generate receipt number. |
| POS page layout | `pages/POS.tsx`, add route in `App.tsx` | Full-screen layout with cart (left) + product grid (right) + numeric keypad (bottom). Touch-optimized. No mouse needed. |
| Barcode scan input | `POS.tsx` | USB scanner in keyboard-wedge mode. Auto-focus search. Add product on enter. <500ms scan-to-cart. |
| Product search | `POS.tsx` | Search by barcode or name. Results in grid or list. Tap to add to cart. |
| Cart display | `POS.tsx` | Show items: name, qty, unit price, line total, discount. Change qty, remove item. |
| Tax & total calculation | `POS.tsx` | Subtotal → 13% VAT → Discount → Total. Line items show VAT-inclusive price. |
| Cash payment | `POS.tsx` | Amount tendered input + quick-amount buttons (NPR 100, 500, 1000). Calculate change due. |
| Card payment | `POS.tsx` | Record card payment (no PCI data — just type + amount). |
| Receipt generation | New util or `POS.tsx` | ESC/POS 80mm. Store name, PAN, date, items, subtotal, VAT, total, payment method. Bilingual header. |
| Hold/recall | `POS.tsx` | Hold transaction → stored in local state or API. Recall from held list. Complete or cancel. |
| Transaction history page | `pages/Transactions.tsx` or tab | Searchable list. Receipt reprint. Refund action. |

### 🔜 Phase 4 — Payments & Customers

| Task | Key Details |
|---|---|
| Khalti API integration | Payment initiation from POS → customer approves on Khalti app → server-side verification → complete. |
| eSewa API integration | Same flow as Khalti. eSewa has largest merchant network in Nepal. |
| NepalQR at POS | Static QR on counter. Dynamic QR for amount-specific payment from POS screen. |
| Split payment | Pay part cash, part Khalti/eSewa. Example: NPR 200 cash + NPR 1,300 Khalti. |
| Customer CRUD page | Register by phone number. Link transactions to customer. |
| Phone lookup on POS | Type phone number → auto-fill customer. Speeds up repeat customers. |
| Loyalty points | Earn 1 point per NPR 100. Redeem 100 points = NPR 100 off. Configurable. |
| Purchase history | Per-customer transaction list. Useful for returns, personalized offers. |

### 🔜 Phase 5 — Operations

| Task | Key Details |
|---|---|
| Shift management | Clock in/out with opening float. Cash reconciliation at shift end. |
| Z-Report | End-of-shift: sales by payment type, transaction count, discounts, discrepancies. Printable. |
| Employee CRUD | Add/edit staff. Assign role + store. Track sales per cashier. |
| Expense tracking | Record expenses per store (utilities, rent, salary, maintenance). Category-based. |
| Reports | Daily/Weekly/Monthly sales, P&L (with COGS), VAT summary, top products. |
| PDF/Excel export | Every report downloadable as PDF + Excel. |

### 🔜 Phase 6 — Polish & Deploy

| Task | Key Details |
|---|---|
| Bilingual UI toggle | English ↔ Nepali. All UI strings. react-i18next. |
| Offline mode | Service Worker caches static assets. App loads without internet. |
| Offline POS | Product catalog in IndexedDB. Transactions queued locally. Sync on reconnect. |
| Docker Compose | Single `docker compose up` for full stack. |
| PostgreSQL migration | Switch from SQLite. Migration script. Zero-downtime. |
| Seed data | 100+ Nepal-specific products. Real barcodes, real prices, Nepali names. |
| Backup automation | Daily DB dump → S3. 30-day retention. |
| Monitoring | Sentry (errors), PM2 (process), UptimeRobot (uptime). |

---

## 8. Coding Patterns & Conventions

### Backend Patterns

**Route file template:**
```typescript
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const schema = z.object({ /* fields */ });

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await prisma.entity.findMany({ /* ... */ });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = schema.parse(req.body);
    const result = await prisma.entity.create({ data });
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors }); return;
    }
    res.status(500).json({ error: 'Failed to create' });
  }
});

export default router;
```

**Rules:**
- Auth middleware on every route (except login/register/health)
- Zod validation on every POST/PUT body
- try/catch with ZodError handling (400) and generic (500)
- Soft delete via `isActive = false`, never hard delete
- Prisma queries in route handlers (service layer only when logic is complex, like stock.ts)

### Frontend Patterns

**File naming:** PascalCase for components (`Products.tsx`), camelCase for utilities (`authStore.ts`)
**Default exports** for page components
**API calls** through `api/client.ts` Axios instance (auth header auto-attached)
**TanStack Query** for all server data — query keys follow `['entity', ...params]` convention
**Zustand** for client-only state (auth only for now)
**No manual `useEffect` fetching** — always use useQuery/useMutation

### Database Conventions

- Soft deletes everywhere: `isActive: Boolean @default(true)`
- Timestamps on every model: `createdAt` + `updatedAt`
- Nepal-specific: bilingual fields, NPR currency, PAN, 13% VAT
- Composite unique keys where needed: `@@unique([productId, storeId, batchNo])` on Stock

---

## 9. Key Files to Read for Context

When starting a new session, read these files in order:

| # | File | What It Tells You |
|---|---|---|
| 1 | `packages/server/prisma/schema.prisma` | Complete data model. Read before adding any feature. |
| 2 | `packages/server/src/index.ts` | All registered routes. Add new routes here. |
| 3 | `packages/server/src/middleware/auth.ts` | JWT payload shape, role checking logic. |
| 4 | `packages/server/src/services/stock.ts` | Example of business logic in a service layer. |
| 5 | `packages/server/src/routes/stock.ts` | Example of a well-established route file with Zod schemas, multiple endpoints. |
| 6 | `packages/web/src/App.tsx` | All frontend routes. Add new page routes here. |
| 7 | `packages/web/src/api/client.ts` | Axios config, auth interceptor pattern. |
| 8 | `packages/web/src/stores/authStore.ts` | Zustand store pattern. |
| 9 | `packages/web/src/components/Layout.tsx` | Sidebar navigation pattern. |
| 10 | `packages/web/src/pages/PurchaseOrders.tsx` | Most complex page — shows modal forms, mutations, line items pattern. |

---

## 10. Commands Reference

### Setup
```bash
cd packages/server && npm install
cd packages/web && npm install
cd packages/server && npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts
```

### Development
```bash
# Backend (auto-restart on changes)
cd packages/server && npm run dev

# Frontend (HMR on changes)
cd packages/web && npm run dev
```

### Database
```bash
# View data in browser
cd packages/server && npx prisma studio

# Validate schema
cd packages/server && npx prisma validate

# Reset + reseed
cd packages/server && npx prisma db push --force-reset && npx tsx prisma/seed.ts
```

### Validation
```bash
# TypeScript check
cd packages/server && npx tsc --noEmit
cd packages/web && npx tsc --noEmit
```

---

## 11. Verification Checklist

After making any change, verify:

- [ ] TypeScript compiles (`npx tsc --noEmit` in both packages)
- [ ] Prisma schema validates (`npx prisma validate`)
- [ ] API endpoint works (test with browser/curl)
- [ ] Frontend renders without errors (check browser console)
- [ ] Auth protected (endpoint returns 401 without token)
- [ ] Role protected (endpoint returns 403 for wrong role)
- [ ] Seed data still works (or updated for new schema)
- [ ] Bilingual fields handled (if applicable)
- [ ] Nepal-specific: VAT / NPR considered (if applicable)
- [ ] Error states visible (loading, empty, error, success)

---

## 12. Tech Debt & Gotchas

- **No centralized error handler** — every route has its own try/catch. Don't introduce one mid-stream unless you refactor all routes.
- **No pagination component** — frontend uses basic offset/limit. A reusable pagination component would be valuable.
- **No input validation feedback** — forms submit but don't show inline field errors. Just a generic error banner.
- **Seed script uses hardcoded IDs** — may conflict if DB already has data. Reseed after reset.
- **Store ID hardcoded to 1** — all frontend pages use `const storeId = 1`. Multi-store support is a known gap.
- **No tests** — unit, integration, or E2E. Adding Vitest tests would be high value.
- **No logging** — console.log is the only logging. Consider winston or pino.
- **Receipt printing not implemented** — ESC/POS protocol awaits Phase 3.
- **Line endings** — repo has mixed LF/CRLF. `.gitattributes` would fix this. Warnings are harmless.

---

## 13. Business Context (Why This Exists)

**The problem:** Nepal's 40,000+ small retail stores (kirana pasal) still run on paper ledgers, manual inventory, and basic cash registers. They lose money to theft, expired products, stockouts, and inefficient operations. Existing POS solutions are expensive (NPR 10k+/mo), don't work offline, and aren't built for Nepal's specific needs (bilingual, Khalti/eSewa, 13% VAT).

**The opportunity:** Korean convenience store franchises (CU, GS25) are expanding in Nepal and need management systems. Mobile wallet adoption (Khalti, eSewa — 15M+ users) is exploding. The government is pushing digital VAT filing.

**The product:** A modern, offline-first, bilingual POS + inventory + admin platform at 1/3 the price of competitors. Built for Nepal, by developers who understand the constraints (load-shedding, unreliable internet, low tech literacy).

**Revenue model:** SaaS — NPR 1,500/mo (single store), NPR 5,000/mo (multi-store), NPR 15,000/mo (enterprise). Hardware markup on scanner + printer bundles (NPR 8k-15k).

**Key differentiators:** Offline-first architecture (works during internet outages), Korean convenience store workflows, true bilingual support, API-first design, 1/3 the price of competitors.

---

## 14. References

| Document | What It Contains |
|---|---|
| `DEVELOPER.md` | Full developer documentation (architecture, conventions, debugging) |
| `IMPLEMENTATION_PLAN.md` | Complete business plan (market analysis, financials, GTM strategy, 1100+ lines) |
| `FUTURE_PLAN.md` | Long-term vision (AI/ML, fintech, international expansion, 550 lines) |
| `README.md` | Quick start guide (3-minute setup) |
