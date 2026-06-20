# CU Nepal — Complete Implementation & Business Plan

> A full-featured convenience store management system for the Nepal market, inspired by CU, GS25, and Seven Eleven operations in South Korea.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Model & Entrepreneurial Perspective](#2-business-model--entrepreneurial-perspective)
3. [Nepal Market Analysis](#3-nepal-market-analysis)
4. [Regulatory & Compliance Framework](#4-regulatory--compliance-framework)
5. [Business System Architecture](#5-business-system-architecture)
6. [Logical Architecture](#6-logical-architecture)
7. [Physical Architecture](#7-physical-architecture)
8. [Developer Implementation Roadmap](#8-developer-implementation-roadmap)
9. [Risk Analysis & Mitigation](#9-risk-analysis--mitigation)
10. [Financial Projections](#10-financial-projections)
11. [Go-to-Market Strategy](#11-go-to-market-strategy)

---

## 1. Executive Summary

**CU Nepal** is a cloud-based, offline-capable POS + inventory + management platform purpose-built for convenience stores in Nepal. It replaces manual ledger-based operations with a digital system that handles bilingual transactions (English + Nepali), 13% VAT compliance, mobile wallet payments (Khalti, eSewa), and thermal receipt printing — all while working during internet outages.

**Vision:** Become the operating system for Nepal's 50,000+ small-format retail stores, digitizing the mom-and-pop shop economy that currently runs on paper registers.

**Target Market:**
- Independent convenience stores (kirana pasal) modernizing operations
- Korean-style franchise stores (CU, GS25, Seven Eleven franchisees in Nepal)
- Small retail chains (2-10 stores) needing centralized management
- Fuel station convenience stores

**Revenue Model:** SaaS subscription tiered by store count + transaction volume + premium features.

---

## 2. Business Model & Entrepreneurial Perspective

### 2.1 Value Proposition

| Stakeholder | Problem | Solution |
|---|---|---|
| Store Owner | Manual inventory tracking causes theft, expiry waste, stockouts | Real-time stock tracking with low-stock alerts and expiry warnings |
| Cashier | Slow checkout, no barcode scanning, manual receipt writing | Barcode scan + auto-VAT + thermal receipt in seconds |
| Chain Manager | No visibility into multi-store performance | Centralized dashboard with sales comparison across stores |
| Accountant | VAT filing requires manual calculation from paper records | Auto-calculated 13% VAT with quarterly report export |
| Customer | Can't pay with Khalti/eSewa at small stores | QR-based mobile wallet payments integrated at POS |

### 2.2 Revenue Streams

**Tier 1 — Single Store (NPR 1,500/month)**
- POS terminal with barcode scanning
- Basic inventory management
- Daily sales report
- Receipt printing

**Tier 2 — Multi-Store (NPR 5,000/month)**
- All Tier 1 features
- Centralized inventory across stores
- Stock transfer between stores
- Supplier & purchase order management
- Cross-store reporting

**Tier 3 — Enterprise (NPR 15,000/month)**
- All Tier 2 features
- API access for custom integrations
- Dedicated support
- Custom report builder
- Khalti/eSewa payment gateway integration
- Shift management & employee tracking

**Add-on Revenue:**
- Hardware markup (barcode scanner + thermal printer bundles: NPR 8,000–15,000)
- Payment gateway commission share (1–2% from Khalti/eSewa)
- Training & onboarding (NPR 5,000/store one-time)
- White-label mobile app for customer loyalty (NPR 50,000 setup)

### 2.3 Cost Structure

| Cost Category | Monthly (NPR) | Notes |
|---|---|---|
| Cloud hosting (AWS Lightsail / DigitalOcean) | 15,000 | 2–4 VPS instances + database |
| Domain & SSL | 500 | Annually ~NPR 6,000 |
| SMS/Notification API | 3,000 | Transactional SMS for receipts |
| Payment gateway fees | 2% of volume | Khalti/eSewa transaction fees |
| Developer salary | 80,000–150,000 | 1–2 developers initially |
| Marketing | 10,000–25,000 | Facebook, Google Ads, trade shows |
| Office/Co-working | 10,000 | Minimal until scale |
| **Total monthly burn** | **~NPR 120,000–200,000** | Pre-revenue |

### 2.4 Unit Economics

| Metric | Value |
|---|---|
| Customer Acquisition Cost (CAC) | ~NPR 5,000 (direct sales to store owners) |
| Average Revenue Per User (ARPU) | NPR 3,000/month (blended across tiers) |
| Gross Margin | 85%+ (SaaS — hosting is primary cost) |
| Payback Period | ~2 months |
| Monthly Churn Target | <3% |

### 2.5 Competitive Landscape

| Competitor | Strengths | Weaknesses |
|---|---|---|
| **NepaliPOS** | Local, established, VAT compliant | Expensive (NPR 10k+/mo), no offline mode |
| **Khata (by Khalti)** | Free, simple ledger | Not POS, no inventory, no barcode |
| **SofTech POS** | Hardware bundle available | Outdated UI, no API, no mobile wallet |
| **Tally / Busy** | Accounting depth | Not store-focused, no POS hardware support |
| **Spreadsheet + cash register** | Free, familiar | Manual, error-prone, no analytics |

**CU Nepal Differentiation:**
- First Nepal POS with true offline-first architecture
- Korean convenience store workflow (shift floats, hold/recall, receipt printing)
- Bilingual (English + Nepali) at every level
- Modern API-first design for integrations

---

## 3. Nepal Market Analysis

### 3.1 Market Size & Opportunity

Nepal's retail industry is projected to grow steadily through 2025-2031, driven by urbanization, rising disposable income, and tourism. Key segments:

| Segment | Estimated Stores | Tech Penetration | Opportunity |
|---|---|---|---|
| Kirana pasal (mom-and-pop) | 40,000+ | <5% digitized | Basic POS + inventory |
| Korean franchise stores (CU, GS25) | 50+ (growing) | ~30% digitized | Full system with Korean workflows |
| Fuel station convenience stores | 200+ | ~10% digitized | POS + fuel integration |
| Small retail chains (2-10 stores) | 500+ chains | ~15% digitized | Multi-store management |
| Pharmacies & medical stores | 5,000+ | ~20% digitized | Expiry tracking specialization |

**Total Addressable Market (TAM):** ~45,000 stores × NPR 3,000/mo ARPU = **NPR 1.6B/year**

**Serviceable Addressable Market (SAM):** ~10,000 tech-ready stores × NPR 3,000/mo = **NPR 360M/year**

**Serviceable Obtainable Market (SOM, Year 3):** 500 stores × NPR 3,000/mo = **NPR 18M/year**

### 3.2 Key Market Trends

- **Mobile wallet adoption exploding:** Khalti + eSewa + IME Pay have 15M+ active users combined. Nepal Rastra Bank's Retail Payment Strategy is pushing QR-based payments to every merchant.
- **Korean franchise boom:** CU and GS25 are expanding aggressively in Nepal. These stores need management systems that match their Korean parent company's operational standards.
- **Urbanization:** Kathmandu, Pokhara, Bharatpur are seeing modern retail format growth. New malls and commercial complexes need digital POS.
- **Internet penetration:** 40%+ of Nepal has internet access, concentrated in urban areas. Stores in main cities have reliable 4G, but suburban areas need offline capability.
- **VAT digitization:** Government is pushing electronic billing and digital VAT filing. Stores need systems that generate compliant receipts.

### 3.3 Customer Personas

**Persona 1: Kirana Store Owner (Bishnu, age 45)**
- Runs a 300 sq ft store in Kathmandu's Baneshwor area
- Currently uses a notebook for credit sales and manual inventory
- Has a smartphone but no computer
- Pain points: theft by staff, expired products, can't track who owes what
- Needs: Simple touch-based POS, basic inventory, Khalti QR
- Tech comfort: Low — needs training and simple UI

**Persona 2: Franchisee (Rajesh, age 32)**
- Owns 2 CU franchise stores in Pokhara
- Has 8 staff, does NPR 5M/month in combined revenue
- Currently using a basic electronic cash register
- Pain points: can't compare performance across stores, stock transfers are manual, end-of-day reconciliation takes 1 hour
- Needs: Multi-store dashboard, stock transfer, shift management

**Persona 3: Chain Operator (Sita, age 38)**
- Runs 5 stores across Kathmandu Valley under her own brand
- Has a warehouse and does centralized purchasing
- Pain points: suppliers deliver to wrong stores, no P&L per store, VAT filing is outsourced and costly
- Needs: Purchase orders, supplier management, P&L reports, VAT summary

---

## 4. Regulatory & Compliance Framework

### 4.1 Nepal-Specific Legal Requirements

| Regulation | Requirement | System Implementation |
|---|---|---|
| **VAT Act 2052 (1996)** | 13% VAT on most goods; registered dealers must issue VAT bills | Auto-calculate VAT at 13% (configurable per product/store); generate VAT-compliant receipts |
| **PAN Registration** | Every business must have Permanent Account Number | PAN field on Supplier model; store-level PAN for invoices |
| **NRB Payment Directive 2024** | Digital wallets must follow KYC, transaction limits | Payment model supports KHALTI/ESEWA with reference tracking; enforce NPR 200k/day wallet limit |
| **Franchise Regulation** | Foreign franchises must register with Department of Industry | System adaptable for franchise fee tracking, royalty calculations |
| **Income Tax Act 2058** | Annual tax filing requirement | Sales summary reports for tax filing |
| **Consumer Protection Act** | Receipt must show price, tax, date, business name | Thermal receipt includes all required fields in English + Nepali |
| **Local Municipal Tax** | Some municipalities charge additional local taxes | Configurable tax rate per store (store.taxRate field) |
| **Data Localization (draft)** | Nepal considering mandatory local data hosting | System designed for Nepal-based cloud hosting (Cloud Himalaya, NepalCloudHost) |

### 4.2 Fiscal Compliance Flow

```
Sale at POS
  → Receipt printed with:
    - Store name + PAN
    - Date/Time
    - Itemized list (name, qty, price)
    - Subtotal
    - 13% VAT (shown separately)
    - Total in NPR
    - Payment method
  → Transaction stored in database
  → Daily Z-report generated (end-of-day summary)
  → Monthly VAT summary report (for filing)
  → Annual sales report (for tax filing)
```

### 4.3 Payment Compliance

Nepal Rastra Bank's payment ecosystem structure (per 2026 regulation):

```
NRB (Nepal Rastra Bank)
  └── PSO (Payment System Operator) — Nepal Clearing House, F1Soft, SmartChoice
        ├── PSP (Payment Service Provider) — eSewa, Khalti, IME Pay, Prabhu Pay
        │     └── Merchants (CU Nepal users)
        └── Banks — NIC Asia, NMB, Citizens, etc.
              └── Merchants (direct bank integration)
```

Our system integrates at the **Merchant** level via:
- **NepalQR** — Single interoperable QR code accepted by all wallets (mandated by NRB)
- **Khalti API** — Direct merchant integration for payment initiation + verification
- **eSewa API** — Direct merchant integration for payment initiation + verification

---

## 5. Business System Architecture

### 5.1 High-Level Business Process Flow

```
                        ┌─────────────────────────────┐
                        │     Supplier Management      │
                        │  (Supplier CRUD, PAN, POs)   │
                        └──────────┬──────────────────┘
                                   │ Purchase Order
                                   ▼
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│  Product Master  │───▶│  Stock / Inventory   │───▶│   Store Sales    │
│  (Barcode, name, │    │  (In/Out/Adjust/     │    │   (POS + Cart)   │
│   price, minStock│    │   Transfer/Expiry)   │    │                  │
│   category/brand)│    └──────────────────────┘    └────────┬─────────┘
└─────────────────┘                                        │
                                                            ▼
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│  Customer Mgmt   │    │  Transaction + Payment│   │  Receipt +       │
│  (Phone, points, │◀───│  (Cash/Card/Khalti/  │◀───│  Thermal Print   │
│   purchase hist) │    │   eSewa + VAT calc)  │    │  (ESC/POS)       │
└─────────────────┘    └──────────────────────┘    └──────────────────┘
                               │
                               ▼
                        ┌─────────────────────────────┐
                        │   Reporting & Analytics      │
                        │  (Daily/Weekly/Monthly/P&L   │
                        │   VAT summary, top products) │
                        └─────────────────────────────┘
```

### 5.2 Operational Workflows

#### Daily Store Operations

```
OPEN SHIFT
  ↓
Cashier clocks in → Opening float recorded (NPR 5,000 / 10,000)
  ↓
Day begins:
  ├── Process sales (barcode scan / product search)
  │     ├── Add items to cart
  │     ├── Apply discount (if authorized)
  │     ├── Select payment method
  │     ├── Complete transaction → receipt printed
  │     └── Stock auto-decremented
  ├── Receive supplier delivery
  │     ├── Match against purchase order
  │     ├── Record stock IN with batch/expiry
  │     └── Update PO status to PARTIAL / RECEIVED
  ├── Handle returns/refunds
  │     ├── Find original transaction
  │     ├── Process refund → stock restored
  │     └── Receipt printed
  ├── Hold transaction (customer forgot wallet)
  │     └── Recall later from held transactions list
  └── Check low stock / expiring alerts
        └── Create purchase order if needed
  ↓
CLOSE SHIFT
  ↓
Cashier clocks out → Closing float recorded
  ↓
Z-Report generated (sales summary, payment breakdown, tax summary)
```

#### Weekly / Monthly Operations

```
WEEKLY:
  ├── Review low-stock alerts → reorder
  ├── Check expiring stock → discount / donate / dispose
  ├── Transfer slow-moving stock between stores
  └── Review supplier performance (delivery times, quality)

MONTHLY:
  ├── Run P&L per store (revenue - COGS - expenses)
  ├── Generate VAT summary for filing
  ├── Review top/bottom products
  ├── Customer purchase history review
  └── Employee performance (sales per cashier)
```

### 5.3 Supply Chain Flow

```
Supplier
  └── Purchase Order created (product, qty, unit price, expected date)
        └── PO status: PENDING
              │
              ▼
        Delivery received
              │
              ├── Items match PO? → RECEIVED (all) / PARTIAL (some)
              ├── Stock auto-added with batch/expiry
              └── PO total calculated
                    │
                    ▼
              Payment to supplier (manual, tracked in system)
                    │
                    ▼
              Supplier performance analytics
```

### 5.4 Multi-Store Operations

```
                    ┌─────────────────────────────┐
                    │   Central Admin Dashboard   │
                    │  (OWNER/MANAGER role)       │
                    └────┬──────┬──────┬─────────┘
                         │      │      │
              ┌──────────┘      │      └──────────┐
              ▼                 ▼                  ▼
        ┌──────────┐     ┌──────────┐      ┌──────────┐
        │ Store A  │     │ Store B  │      │ Store C  │
        │ KTM-1    │     │ KTM-2    │      │ POK-1    │
        └────┬─────┘     └────┬─────┘      └────┬─────┘
             │                │                  │
             └────────────────┼──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Stock Transfer  │
                    │  (A → B, B → C)  │
                    └───────────────────┘
```

### 5.5 Business Reporting Structure

| Report | Audience | Frequency | Key Metrics |
|---|---|---|---|
| Daily Sales Report | Store Manager | Daily | Revenue, transactions, items sold, payment split |
| Z-Report | Cashier/Manager | Per shift | Opening/closing float, cash sales, card sales, discrepancies |
| Low Stock Alert | Inventory Clerk | Real-time | Products below minStock, out-of-stock items |
| Expiry Alert | Inventory Clerk | Weekly | Items expiring in 7/30/90 days |
| Purchase Order Status | Manager | Weekly | PENDING / PARTIAL / RECEIVED / CANCELLED |
| P&L Statement | Owner | Monthly | Revenue, COGS, gross profit, expenses, net profit |
| VAT Summary | Accountant | Monthly | Total sales, VAT collected, VAT on purchases |
| Top Products | Manager | Monthly | Best/worst selling products by volume and revenue |
| Employee Performance | Owner | Monthly | Sales per cashier, transactions processed |
| Cross-Store Comparison | Chain Owner | Monthly | Revenue, margins, stock turnover per store |

---

## 6. Logical Architecture

### 6.1 System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │   React SPA (Web)   │  │  PWA (Mobile App)   │  (Phase 4+)      │
│  │   Tailwind CSS      │  │  Offline-capable     │                   │
│  │   TanStack Query    │  │  Camera (barcode)    │                   │
│  └─────────┬───────────┘  └──────────┬──────────┘                   │
│            │                         │                              │
│       ┌────┴─────────────────────────┴────┐                         │
│       │     Axios HTTP Client             │                         │
│       │     (auth interceptor, base URL)   │                         │
│       └────────────────┬──────────────────┘                         │
└────────────────────────┼────────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┼────────────────────────────────────────────┐
│                  API GATEWAY (Vite Proxy / Nginx)                   │
│                         │                                           │
│              ┌──────────┴──────────┐                                │
│              │  Express REST API   │                                │
│              │  Port 3000          │                                │
│              └──────────┬──────────┘                                │
│                         │                                           │
│              ┌──────────┴──────────┐                                │
│              │   Middleware Stack   │                                │
│              │  CORS → JSON → Auth │                                │
│              │  → Rate Limit → Zod │                                │
│              └──────────┬──────────┘                                │
│                         │                                           │
│     ┌───────────────────┼───────────────────┐                      │
│     ▼                   ▼                   ▼                      │
│ ┌────────┐    ┌──────────────┐    ┌────────────┐                    │
│ │ Routes │    │  Services    │    │  External  │                    │
│ │ Auth   │    │  Stock (mov) │    │  Khalti    │                    │
│ │ Stores │    │  (future)    │    │  eSewa API │                    │
│ │ Prods  │    │              │    │  SMS API   │                    │
│ │ Stock  │    │              │    │  Email     │                    │
│ │ POs    │    │              │    │            │                    │
│ └───┬────┘    └──────────────┘    └────────────┘                    │
│     │                                                              │
│     ▼                                                              │
│ ┌──────────┐                                                       │
│ │  Prisma  │  ← ORM layer (type-safe queries)                      │
│ └────┬─────┘                                                       │
│      │                                                             │
│      ▼                                                             │
│ ┌──────────┐  ┌──────────────┐                                     │
│ │ SQLite   │  │ PostgreSQL   │  ← Switch via env variable          │
│ │ (Dev)    │  │ (Production) │                                     │
│ └──────────┘  └──────────────┘                                     │
│                        SERVER LAYER                                │
└────────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow Diagrams

#### Sale Transaction Flow

```
1. Cashier scans barcode
     │
2. GET /api/products/barcode/:barcode
     │
3. Product displayed in cart
     │
4. Cashier adds more items / applies discount
     │
5. Customer selects payment method
     │
6. POST /api/transactions  ← { items, payments, totals }
     │
7. Server:
     ├── Validates stock availability
     ├── Calculates subtotal, tax (13%), total
     ├── Deducts stock quantities
     ├── Creates Transaction record
     ├── Creates TransactionItem records
     ├── Creates Payment record
     └── Returns { receiptNo, transaction }
     │
8. Frontend:
     ├── Displays success + receipt
     └── Triggers thermal print (ESC/POS)
```

#### Stock Transfer Flow (Multi-Store)

```
1. User selects: From Store A, To Store B, Product, Quantity
     │
2. POST /api/stock/transfer  ← { productId, fromStoreId, toStoreId, qty }
     │
3. Server:
     ├── Validates fromStore != toStore
     ├── Checks both stores exist and are active
     ├── Checks sufficient stock at Store A
     ├── Creates StockMovement: Store A, TRANSFER_OUT, -qty
     ├── Decrements Stock at Store A
     ├── Creates StockMovement: Store B, TRANSFER_IN, +qty
     ├── Upserts Stock at Store B (create or increment)
     └── Returns success
     │
4. Frontend invalidates stock queries for both stores
```

#### Purchase Order → Stock Receipt Flow

```
1. User creates PO: { supplier, store, items[] }
     │
2. POST /api/purchase-orders
     │
3. PO created (status: PENDING), items recorded
     │
     │   ...time passes, supplier delivers...
     │
4. User clicks "Receive All Items"
     │
5. POST /api/purchase-orders/:id/receive
     │
6. Server:
     ├── Validates PO is PENDING or PARTIAL (not RECEIVED/CANCELLED)
     ├── For each item:
     │     ├── Calculates remaining (qtyOrdered - qtyReceived)
     │     ├── Creates StockMovement: IN
     │     ├── Upserts Stock (increment quantity)
     │     └── Updates PurchaseOrderItem.qtyReceived
     ├── Updates PO status to RECEIVED
     ├── Sets receivedAt timestamp
     └── Returns updated PO
```

### 6.3 Database Schema (Logical Model)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          LOGICAL DATA MODEL                             │
│                                                                          │
│  Store ───1:N── User                                                     │
│  Store ───1:N── Stock                                                    │
│  Store ───1:N── Transaction                                              │
│  Store ───1:N── PurchaseOrder                                            │
│  Store ───1:N── Shift                                                    │
│  Store ───1:N── Expense                                                  │
│  Store ───1:N── Customer                                                 │
│                                                                          │
│  Category ───1:N── Product                                               │
│  Brand ───1:N── Product                                                  │
│  Category ───self── Category (parent/child hierarchy)                    │
│                                                                          │
│  Product ───1:N── Stock (per store + batch)                              │
│  Product ───1:N── StockMovement                                          │
│  Product ───1:N── TransactionItem                                        │
│  Product ───1:N── PurchaseOrderItem                                      │
│                                                                          │
│  Supplier ───1:N── PurchaseOrder                                         │
│  PurchaseOrder ───1:N── PurchaseOrderItem                                │
│                                                                          │
│  Transaction ───1:N── TransactionItem                                    │
│  Transaction ───1:N── Payment                                            │
│  Customer ───1:N── Transaction                                           │
│  User ───1:N── Transaction (as cashier)                                  │
│  User ───1:N── StockMovement                                             │
│  User ───1:N── PurchaseOrder (as creator)                                │
└──────────────────────────────────────────────────────────────────────────┘

Key Design Decisions:
- Composite unique [productId, storeId, batchNo] on Stock enables batch tracking
- Soft deletes (isActive) on all major entities — never hard-delete data
- Enum-like strings for status fields (PENDING/RECEIVED etc) for flexibility
- Monetary values stored as Float (NPR) — sufficient for 13 decimal places
- DateTime stored in UTC, converted to Nepal time (UTC+5:45) on display
- Bilingual fields (nameEn/nameNe) on Category and Product
- JSON-serializable receipt data can be stored for later re-printing
```

### 6.4 API Design

```
Base: /api/

Auth:
  POST   /auth/login         → { email, password } → { token, user }
  POST   /auth/register      → { user data } → { token, user }
  GET    /auth/me            → Current user profile

Stores:
  GET    /stores             → List stores
  GET    /stores/:id         → Store detail
  POST   /stores             → Create store
  PUT    /stores/:id         → Update store
  DELETE /stores/:id         → Deactivate store (isActive=false)

Categories:
  GET    /categories         → List (flat)
  GET    /categories/tree    → Nested hierarchy
  POST   /categories         → Create
  PUT    /categories/:id     → Update
  DELETE /categories/:id     → Deactivate

Products:
  GET    /products           → Search/list (search, categoryId, brandId, page, limit)
  GET    /products/barcode/:barcode → Barcode lookup
  POST   /products           → Create
  PUT    /products/:id       → Update
  DELETE /products/:id       → Deactivate

Brands:
  GET    /brands             → List (with product count)
  POST   /brands             → Create
  PUT    /brands/:id         → Update
  DELETE /brands/:id         → Deactivate

Stock:
  GET    /stock              → Stock levels (by store)
  GET    /stock/movements    → Movement history
  GET    /stock/low-stock    → Low stock alerts
  GET    /stock/expiring     → Expiring/expired items
  POST   /stock/movement     → Record IN/OUT/ADJUST
  POST   /stock/transfer     → Atomic store-to-store transfer

Suppliers:
  GET    /suppliers          → List (with PO count)
  GET    /suppliers/:id      → Detail with purchase history
  POST   /suppliers          → Create (name, PAN, contact)
  PUT    /suppliers/:id      → Update
  DELETE /suppliers/:id      → Deactivate

Purchase Orders:
  GET    /purchase-orders    → List (by store)
  GET    /purchase-orders/:id → Detail with items
  POST   /purchase-orders    → Create (supplier, items[])
  POST   /purchase-orders/:id/receive → Receive items into stock
  POST   /purchase-orders/:id/cancel  → Cancel

Transactions (Phase 3):
  GET    /transactions       → List (by store, date range)
  GET    /transactions/:id    → Detail with items + payments
  POST   /transactions       → Create sale
  POST   /transactions/:id/refund → Refund

Customers (Phase 4):
  GET    /customers          → List/search (by phone)
  POST   /customers          → Create
  PUT    /customers/:id      → Update

Payments (Phase 3-4):
  POST   /payments/khalti/initiate → Start Khalti payment
  POST   /payments/khalti/verify  → Verify Khalti payment
  POST   /payments/esewa/initiate → Start eSewa payment
  POST   /payments/esewa/verify   → Verify eSewa payment

Reports (Phase 5):
  GET    /reports/daily      → Daily sales summary
  GET    /reports/monthly    → Monthly P&L
  GET    /reports/vat        → VAT summary for filing
  GET    /reports/top-products → Best/worst sellers
```

### 6.5 Security Model

```
Authentication
  └── JWT (jsonwebtoken)
        ├── Payload: { userId, email, role, storeId }
        ├── Expiry: 24 hours (configurable)
        └── Stored: localStorage (web), SecureHttpOnly cookie (future)

Authorization
  └── Role-Based Access Control (RBAC)
        ├── OWNER: Full system access, all stores
        ├── MANAGER: Multi-store view, reports, no user management
        ├── CASHIER: POS only, own store, no reports
        └── INVENTORY_CLERK: Stock, suppliers, POs only

Data Security
  ├── Passwords: bcryptjs (salt rounds: 10)
  ├── API: Rate limiting (express-rate-limit)
  ├── DB: Parameterized queries via Prisma (no SQL injection)
  ├── Input: Zod schema validation on all endpoints
  └── Headers: CORS restricted to known origins

Payment Security
  ├── Khalti: Server-side verification (not client-side)
  ├── eSewa: Server-side verification with checksum
  └── No card data stored (PCI DSS scope avoided via 3rd-party gateways)
```

### 6.6 Offline Architecture (Phase 6)

```
                    ┌──────────────────────────────┐
                    │        Online Mode           │
                    │  React ←→ API ←→ Database    │
                    └────────────┬─────────────────┘
                                 │ connection lost
                                 ▼
                    ┌──────────────────────────────┐
                    │        Offline Mode           │
                    │  React ←→ IndexedDB (local)   │
                    │  Service Worker (cache)       │
                    │  Queue: pending transactions  │
                    └────────────┬─────────────────┘
                                 │ connection restored
                                 ▼
                    ┌──────────────────────────────┐
                    │        Sync Mode              │
                    │  IndexedDB → API (POST sync)  │
                    │  Server resolves conflicts    │
                    │  (last-write-wins for now)    │
                    └──────────────────────────────┘

Key Offline Capabilities:
- Product catalog cached in IndexedDB (auto-synced when online)
- POS transactions queued locally during outage
- Barcode scanning works without internet (local DB lookup)
- Receipt print from local queue
- Sync on reconnect with conflict resolution
```

---

## 7. Physical Architecture

### 7.1 Development Environment

```
┌─────────────────────────────────────────────────────┐
│              Developer Laptop (Windows)              │
│                                                      │
│  ┌──────────────┐     ┌──────────────────┐          │
│  │  Vite Dev     │     │  Express Dev     │          │
│  │  Server       │◀───▶│  Server          │          │
│  │  :5173        │     │  :3000           │          │
│  │  (HMR, proxy) │     │  (tsx watch)     │          │
│  └──────────────┘     └────────┬─────────┘          │
│                                │                     │
│                        ┌───────▼───────┐             │
│                        │   SQLite DB   │             │
│                        │  dev.db       │             │
│                        └───────────────┘             │
└─────────────────────────────────────────────────────┘
```

### 7.2 Production Environment (Initial — Phase 1-3)

```
┌──────────────────────────────────────────────────────────────────┐
│                     cloud.digitalocean.com / AWS                 │
│                                                                  │
│  ┌─────────────────────┐    ┌────────────────────┐               │
│  │   VPS 1 (App)       │    │   VPS 2 (DB)       │               │
│  │   Ubuntu 24.04      │    │   Ubuntu 24.04     │               │
│  │   Node.js 24        │    │   PostgreSQL 16    │               │
│  │   PM2 (process mgr) │    │   (managed or self) │               │
│  │   Nginx (reverse    │    │                    │               │
│  │     proxy + SSL)    │    │                    │               │
│  │   Express :3000     │    │   Port :5432       │               │
│  │   (private network) │◀──▶│   (private network)│               │
│  └─────────────────────┘    └────────────────────┘               │
│                            │                                     │
│                    ┌───────▼───────┐                             │
│                    │   Backups     │                             │
│                    │   Daily DB    │                             │
│                    │   + file snap │                             │
│                    └───────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

### 7.3 Production Environment (Scale — Phase 4+)

```
                         ┌───────────────────────┐
                         │   Cloudflare DNS + CDN │
                         │   (cunepal.com)        │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                 ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │   Vite Build  │ │  Admin SPA   │ │  POS Client  │
           │   (Static)    │ │  (CDN)       │ │  (CDN/PWA)   │
           └──────────────┘ └──────────────┘ └──────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
           ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
           │  API Server 1 │     │  API Server 2 │     │  API Server 3│
           │  (Load       │     │  (Load        │     │  (Load       │
           │   balanced)  │     │   balanced)   │     │   balanced)  │
           └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
                  └────────────────────┼────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │   Load Balancer │
                              │   (Nginx / HA)  │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                   ▼
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │ PostgreSQL   │  │   Redis      │  │   S3/MinIO   │
           │ Primary +   │  │   Cache      │  │   Receipt    │
           │ Read Replica │  │   Sessions   │  │   Backups    │
           └──────────────┘  └──────────────┘  └──────────────┘
```

### 7.4 Hardware Requirements (Store Level)

| Device | Specification | Estimated Cost (NPR) | Purpose |
|---|---|---|---|
| POS Computer / Tablet | Any Android/iPad/Windows with Wi-Fi | 15,000–30,000 | Runs web-based POS or PWA |
| Barcode Scanner | USB 2D scanner (scans QR + barcode) | 3,000–5,000 | Product lookup at checkout |
| Thermal Receipt Printer | ESC/POS compatible (80mm) | 5,000–10,000 | Customer receipts |
| Cash Drawer | RJ11/12 connected to printer | 3,000–5,000 | Cash storage |
| Label Printer (optional) | Thermal label printer | 8,000–12,000 | Shelf labels / price tags |
| UPS / Backup Battery | 600VA minimum | 4,000–8,000 | Keep POS running during load-shedding |
| **Total per store** | | **NPR 38,000–70,000** | |

**Load-shedding Note:** Nepal still experiences scheduled power cuts, especially outside Kathmandu Valley. Every POS setup MUST include a UPS. The system is designed to work offline, but the hardware needs power.

### 7.5 Network Topology (Store)

```
                         ┌─────────────┐
                         │  Internet   │
                         │  (4G/Fiber) │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │   Wi-Fi Router        │
                    │   (with UPS backup)   │
                    └───────────┬───────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                    ▼
     ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
     │  POS Tablet  │    │ Barcode      │    │  Thermal     │
     │  (PWA)       │    │ Scanner USB  │    │  Printer USB │
     └─────────────┘    └──────────────┘    └──────────────┘
                                                │
                                          ┌─────▼─────┐
                                          │ Cash      │
                                          │ Drawer    │
                                          └───────────┘
```

### 7.6 Deployment Pipeline

```
Developer pushes to GitHub (master)
        │
        ▼
GitHub Actions / GitLab CI
        │
        ├── Lint (ESLint + Prettier)
        ├── Type check (tsc --noEmit)
        ├── Build (Vite for web, tsc for server)
        └── Test (Vitest)
              │
              ▼
        Deploy to staging
              │
              ▼
        Integration tests pass?
              │
         ─────┼─────
        Yes   │   No → Rollback
              │
              ▼
        Deploy to production
              │
              ▼
        Health check + monitoring (PM2 / Sentry)
              │
              ▼
        Notify team (Slack / Discord webhook)
```

---

## 8. Developer Implementation Roadmap

### Phase 1 — Foundation ✅ COMPLETE

- [x] Monorepo scaffold (server + web packages via npm workspaces)
- [x] Prisma schema (16 models: User, Store, Category, Brand, Product, Stock, StockMovement, Supplier, PurchaseOrder, PurchaseOrderItem, Customer, Transaction, TransactionItem, Payment, Shift, Discount, Expense)
- [x] JWT auth system with 4 roles (OWNER, MANAGER, CASHIER, INVENTORY_CLERK)
- [x] Store CRUD API
- [x] Category CRUD API (bilingual English + Nepali)
- [x] Product CRUD API (bilingual, barcode search, pagination)
- [x] React frontend shell (Vite + Tailwind + React Router + TanStack Query)
- [x] Login page
- [x] Dashboard page
- [x] Products list page
- [x] Sidebar layout with navigation

### Phase 2 — Products & Inventory ✅ COMPLETE

- [x] Brands CRUD API + page
- [x] Stock CRUD (in/out/adjust/transfer)
- [x] Stock levels display with batch and expiry tracking
- [x] Low stock alerts
- [x] Supplier CRUD API + page (with PAN number)
- [x] Purchase order creation + receipt
- [x] Stock transfers between stores (atomic endpoint)
- [x] Expiry date tracking (expiring/expired stock alerts)

### Phase 3 — POS Core 🔜 NEXT

- [ ] POS page layout (cart + keypad + product grid)
- [ ] Barcode scan input (USB scanner — keyboard wedge mode)
- [ ] Manual product search and add to cart
- [ ] Cart display (qty, unit price, discount, line total)
- [ ] Subtotal → Tax (13%) → Total calculation
- [ ] Cash payment flow (amount tendered → change due)
- [ ] Card payment flow
- [ ] Receipt generation and thermal printer output (ESC/POS)
- [ ] Hold/recall transactions
- [ ] Transaction history with detail view
- [ ] Refunds (full and partial)
- [ ] Transaction API endpoints (CRUD + refund)

### Phase 4 — Payments & Customers

- [ ] Khalti API integration (payment initiation + server-side verification)
- [ ] eSewa API integration (payment initiation + checksum verification)
- [ ] NepalQR interoperable QR code at POS
- [ ] Split payment (cash + Khalti, etc.)
- [ ] Customer CRUD page
- [ ] Phone number search on POS for loyalty
- [ ] Loyalty points (earn rate: 1 point per NPR 100, redeem: 1 point = NPR 1)
- [ ] Customer purchase history display
- [ ] Customer API endpoints

### Phase 5 — Operations

- [ ] Shift management (clock in/out with opening float)
- [ ] Shift close with Z-report (sales summary, cash reconciliation)
- [ ] Employee CRUD and schedule
- [ ] Expense tracking (utilities, rent, salary, maintenance)
- [ ] Reporting dashboard (sales chart, top products, store comparison)
- [ ] Daily/Weekly/Monthly sales report
- [ ] Profit & Loss report (with COGS calculation)
- [ ] VAT summary report (for NRB filing)
- [ ] PDF/Excel export for all reports
- [ ] Report API endpoints with date filtering

### Phase 6 — Polish & Deploy

- [ ] Bilingual UI toggle (English ↔ Nepali, i18n library)
- [ ] Discounts & promotions CRUD (percentage, fixed, BOGO)
- [ ] Offline mode (Service Worker for static assets)
- [ ] Offline POS (IndexedDB for product catalog + transaction queue)
- [ ] Sync engine (reconcile offline transactions on reconnect)
- [ ] Docker Compose setup (app + db + redis)
- [ ] PostgreSQL migration guide
- [ ] Comprehensive seed data (100+ Nepal-specific products)
- [ ] Backup strategy (daily DB dump → S3)
- [ ] Monitoring (Sentry for errors, PM2 for process)
- [ ] Deployment guide (DigitalOcean / AWS / NepalCloudHost)

### Technical Stack Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Monorepo** | npm workspaces | Simpler than Nx/Turborepo for 2 packages |
| **Frontend framework** | React 19 + Vite 8 | Most devs know React, Vite is fastest build tool |
| **Styling** | Tailwind CSS 4 | Utility-first, no runtime, small bundles |
| **Server state** | TanStack Query 5 | Auto-caching, background refetch, mutations |
| **Client state** | Zustand 5 | Minimal boilerplate, no providers |
| **Backend** | Express 4.21 | Most widely known Node.js framework |
| **ORM** | Prisma 6 | Type-safe, auto-generated client, migrations |
| **Validation** | Zod 3 | TypeScript-first, composable schemas |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | Stateless, no session store needed initially |
| **Database (dev)** | SQLite | Zero config, file-based, portable |
| **Database (prod)** | PostgreSQL | Battle-tested, good for OLTP, free |
| **Cache (future)** | Redis | Session store, rate limiting, query cache |
| **Payment** | Khalti + eSewa APIs | Market leaders in Nepal mobile payments |
| **Receipt** | ESC/POS (thermalprinter lib) | Industry standard for thermal printers |

### Testing Strategy

```
Unit Tests (Vitest)
  ├── Service functions (stock movements, calculations)
  ├── Validation schemas (Zod edge cases)
  ├── Auth middleware (token verification, role checks)
  └── Utility functions (formatting, calculations)

Integration Tests (Supertest + Vitest)
  ├── API endpoints (happy path)
  ├── API endpoints (error cases, validation failures)
  ├── Auth flow (login → token → protected route)
  └── Database operations (CRUD via Prisma test DB)

E2E Tests (Playwright)
  ├── Login → Dashboard → Products flow
  ├── Full sale cycle (scan → cart → pay → receipt)
  └── Multi-store transfer flow

Manual Testing Checklist
  ├── Offline mode (disconnect WiFi, process sale, reconnect)
  ├── Barcode scanner (USB wedge mode)
  ├── Thermal printer (ESC/POS commands)
  ├── Khalti/eSewa sandbox payments
  └── Load-shedding simulation (UPS behavior)
```

---

## 9. Risk Analysis & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **Internet reliability** | High | High | Offline-first architecture; POS works without internet; sync when reconnected |
| **Power cuts (load-shedding)** | High | Medium | UPS at every POS station; mobile battery backup for tablets; auto-sync on power restore |
| **Low tech literacy** | High | Medium | Touch-based UI with large buttons; Nepali language support; in-person training; video tutorials in Nepali |
| **Customer data loss** | Low | Critical | Daily automated backups; redundant DB (primary + replica); transaction log for point-in-time recovery |
| **Payment integration failure** | Medium | High | Fallback to cash always available; payment verification retry logic; manual reconciliation mode |
| **Competitive response** | Medium | Medium | Focus on offline-first + Korean workflow differentiators; rapid feature iteration based on store feedback |
| **Staff fraud / theft** | Medium | High | Role-based access; shift-based cash reconciliation; transaction audit log; low-stock alerts catch shrinkage |
| **Regulatory change** | Low | Medium | Configurable tax rates; parameterized compliance settings; legal advisor on retainer |
| **Scaling too fast** | Low | Medium | Modular architecture; database indexing; caching layer added before needed |
| **Key person dependency** | Medium | High | Documentation-first development (DEVELOPER.md); clean code with TypeScript; CI/CD ensures no single point of failure |

---

## 10. Financial Projections

### Year 1 — Validation

| Month | Customers | Revenue (NPR) | Costs (NPR) | Net (NPR) |
|---|---|---|---|---|
| 1-3 | 0 (building) | 0 | 360,000 | -360,000 |
| 4-6 | 10 | 30,000 | 360,000 | -330,000 |
| 7-9 | 25 | 75,000 | 400,000 | -325,000 |
| 10-12 | 50 | 150,000 | 450,000 | -300,000 |
| **Year 1** | **50** | **255,000** | **1,570,000** | **-1,315,000** |

### Year 2 — Growth

| Quarter | Customers | Revenue (NPR) | Costs (NPR) | Net (NPR) |
|---|---|---|---|---|
| Q1 | 80 | 240,000 | 500,000 | -260,000 |
| Q2 | 120 | 360,000 | 550,000 | -190,000 |
| Q3 | 180 | 540,000 | 600,000 | -60,000 |
| Q4 | 250 | 750,000 | 650,000 | +100,000 |
| **Year 2** | **250** | **1,890,000** | **2,300,000** | **-410,000** |

### Year 3 — Profitability

| Quarter | Customers | Revenue (NPR) | Costs (NPR) | Net (NPR) |
|---|---|---|---|---|
| Q1 | 300 | 900,000 | 700,000 | +200,000 |
| Q2 | 350 | 1,050,000 | 750,000 | +300,000 |
| Q3 | 420 | 1,260,000 | 800,000 | +460,000 |
| Q4 | 500 | 1,500,000 | 850,000 | +650,000 |
| **Year 3** | **500** | **4,710,000** | **3,100,000** | **+1,610,000** |

**Break-even:** Month 15-18 (mid-Year 2)

**Unit Economics at Scale (500 stores):**
- ARPU: NPR 3,000/month (blended)
- Gross Revenue: NPR 1,500,000/month
- COGS (hosting + gateway): NPR 180,000/month (12%)
- Gross Profit: NPR 1,320,000/month (88%)
- Operating Expenses: NPR 670,000/month (salaries, office, marketing)
- Net Profit: NPR 650,000/month

---

## 11. Go-to-Market Strategy

### Phase 1 — Seed (Months 1-3)
**Goal:** 10 beta stores in Kathmandu Valley
**Tactics:**
- Personal network: Approach 20 kirana stores in Baneshwor, New Baneshwor, and Jawalakhel
- Offer: Free 3-month trial + free hardware setup (barcode scanner + printer on loan)
- Collect: Intensive feedback → iterate on UX
- Success metric: 8/10 beta users actively using POS daily after 1 month

### Phase 2 — Local Launch (Months 4-8)
**Goal:** 50 paying stores in Kathmandu Valley
**Tactics:**
- Facebook + Instagram ads targeting Kathmandu store owners (NPR 15,000/month)
- Partner with Khalti/eSewa for joint merchant onboarding
- Visit CU/GS25 franchise offices — pitch system as "Korean workflow compatible"
- Attend Business Summit Nepal / retail industry events
- Referral program: "Refer a store owner, get 1 month free"
- Success metric: <3% monthly churn

### Phase 3 — Expansion (Months 9-18)
**Goal:** 250 stores across Nepal's top 5 cities
**Tactics:**
- Expand to Pokhara, Bharatpur, Chitwan, Biratnagar
- Hire 2 field sales reps (commission-based: NPR 2,000 per signup + 5% of first 3 months revenue)
- Partner with hardware suppliers for bundled POS kits
- Launch "Kirana Digitalization" workshop series (free 2-hour training)
- Success metric: 50 new stores/month

### Phase 4 — Scale (Months 19-36)
**Goal:** 500 stores, profitable, enterprise tier launched
**Tactics:**
- Enterprise sales team for chain stores (5+ locations)
- White-label mobile app for customer loyalty
- API access for third-party developers
- Consider Nepal Rastra Bank PSP license for direct payment processing
- Explore IME Pay, Prabhu Pay, and ConnectIPS integrations
- Success metric: NPR 1.5M+ monthly recurring revenue

### Sales Channels

```
┌────────────────────────────────────────────────────────────────────┐
│                        SALES FUNNEL                                │
│                                                                    │
│  Awareness                                                     │
│  ├── Facebook/Instagram ads (target: store owners 25-55)          │
│  ├── YouTube tutorials in Nepali ("How to digitize your kirana")  │
│  └── Partner with Khalti merchant network                         │
│         │                                                         │
│         ▼                                                         │
│  Interest                                                        │
│  ├── Free trial signup (website)                                  │
│  ├── WhatsApp demo (send video + pricing)                         │
│  └── In-store demo (field rep visits with tablet)                 │
│         │                                                         │
│         ▼                                                         │
│  Decision                                                        │
│  ├── Pricing page (npr 1,500 / 5,000 / 15,000 per month)         │
│  ├── Compare table (CU Nepal vs spreadsheet vs other POS)        │
│  └── Testimonial videos from beta users                           │
│         │                                                         │
│         ▼                                                         │
│  Conversion                                                       │
│  ├── Online payment (Khalti, eSewa, bank transfer)                │
│  ├── Field rep handles hardware setup + training (1 day)          │
│  └── Go-live checklist completed                                  │
│         │                                                         │
│         ▼                                                         │
│  Retention                                                        │
│  ├── Monthly check-in call (first 3 months)                       │
│  ├── WhatsApp group for tips and updates                          │
│  └── Feature request board (public roadmap)                       │
└────────────────────────────────────────────────────────────────────┘
```

---

> **This plan is a living document.** As CU Nepal evolves — through user feedback, market changes, and technological shifts — this plan should be updated. The most important thing is to get the first 10 stores live and loving the product. Everything else follows from that.
