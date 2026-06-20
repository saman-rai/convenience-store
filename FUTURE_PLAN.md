# CU Nepal — Future Plan

> Product vision, scale strategy, and long-term roadmap beyond the initial build.

---

## Table of Contents

1. [18-Month Horizon (Phase 3–6 Completion)](#1-18-month-horizon-phase-3-6-completion)
2. [Year 2–3: Platform Maturity](#2-year-2-3-platform-maturity)
3. [Year 3–5: Ecosystem & Scale](#3-year-3-5-ecosystem--scale)
4. [Beyond Year 5: Moonshots](#4-beyond-year-5-moonshots)
5. [Technology Evolution Roadmap](#5-technology-evolution-roadmap)
6. [Data Strategy & Analytics](#6-data-strategy--analytics)
7. [Platform Ecosystem](#7-platform-ecosystem)
8. [International Expansion](#8-international-expansion)
9. [Exit & Sustainability](#9-exit--sustainability)
10. [Success Metrics Dashboard](#10-success-metrics-dashboard)

---

## 1. 18-Month Horizon (Phase 3–6 Completion)

### Phase 3 — POS Core (Months 1–4)

The point-of-sale is the heart of the product. Every store that succeeds on CU Nepal succeeds because the POS is fast, reliable, and pleasant to use.

| Feature | Detail | Priority |
|---|---|---|
| **POS page layout** | Full-screen cart + product grid + numeric keypad. Optimized for touch. No mouse needed. | P0 |
| **Barcode scan input** | USB scanner in keyboard-wedge mode. Focus automatically on search field. Sub-500ms add-to-cart. | P0 |
| **Cart management** | Quantity change, remove item, inline discount per line, weight-based pricing (kg/L). | P0 |
| **Tax calculation** | 13% VAT auto-applied per item based on product.taxRate. Configurable per store. | P0 |
| **Cash payment flow** | Amount tendered → change due calculation. Quick-amount buttons (NPR 100, 500, 1000). | P0 |
| **Card payment flow** | Record card payment (no PCI — just track type + amount). | P1 |
| **Thermal receipt** | ESC/POS 80mm receipt with store name, PAN, date, items, VAT, total. Bilingual header. | P1 |
| **Hold/recall** | Hold a transaction (customer forgot wallet), recall from held list, complete later. | P1 |
| **Transaction history** | Searchable list with receipt reprint, refund action. Filter by date/payment method. | P1 |
| **Refunds** | Full refund finds original transaction, restores stock, prints refund receipt. | P1 |

**Success criteria:** A cashier can complete a 5-item sale in under 15 seconds from scan to receipt. Zero crashes during a full shift.

### Phase 4 — Payments & Customers (Months 3–7)

Nepal is a mobile-first payment market. 15M+ active wallet users. The POS that makes it seamless to pay with Khalti or eSewa wins.

| Feature | Detail | Priority |
|---|---|---|
| **Khalti API integration** | Payment initiation from POS → customer approves on phone → server-side verification → transaction complete. | P0 |
| **eSewa API integration** | Same flow as Khalti. eSewa has the largest merchant network in Nepal. | P0 |
| **NepalQR at POS** | Static QR on counter (works with any wallet). Dynamic QR for amount-specific payment from POS screen. | P1 |
| **Split payment** | Pay part cash, part Khalti. Example: NPR 200 cash + NPR 1,300 Khalti for NPR 1,500 total. | P1 |
| **Customer CRUD** | Register customer by phone number. Capture name, email (optional), address (optional). | P1 |
| **Phone lookup on POS** | Type phone number → auto-fill customer info. Speeds up repeat customers. | P1 |
| **Loyalty points** | Earn 1 point per NPR 100 spent. Redeem 100 points = NPR 100 off. Configurable rates per store. | P2 |
| **Purchase history** | Per-customer transaction list. Helps with returns, personalized offers. | P2 |

**Success criteria:** 40%+ of transactions use a digital wallet. 30%+ of customers are registered in the system.

### Phase 5 — Operations (Months 6–10)

Multi-store operators need visibility and control. This phase turns CU Nepal from a store tool into a management platform.

| Feature | Detail | Priority |
|---|---|---|
| **Shift management** | Clock in/out with opening float. Cash reconciliation at shift end (expected cash vs actual cash). | P0 |
| **Z-Report** | End-of-shift summary: sales by payment type, transaction count, discounts given, discrepancies. Printable. | P0 |
| **Employee CRUD** | Add/edit staff, assign role + store, track sales per cashier. | P1 |
| **Expense tracking** | Record expenses (rent, utilities, salary, maintenance) per store. Category-based. | P1 |
| **Sales report (daily)** | Date range picker. Line chart of sales over time. Breakdown by payment type. | P1 |
| **Sales report (monthly)** | Month-over-month comparison. Same-period-last-year when available. | P1 |
| **Top products report** | Best and worst sellers by volume and revenue. Helps with inventory decisions. | P1 |
| **P&L report** | Revenue — COGS (cost of goods sold) — expenses = net profit. Per-store and consolidated. | P1 |
| **VAT summary report** | Total sales, VAT collected, VAT on purchases. Ready for quarterly NRB filing. | P1 |
| **PDF/Excel export** | Every report downloadable as PDF (for printing) and Excel (for accountants). | P2 |

**Success criteria:** Store owners can make inventory decisions based on report data. Shift reconciliation takes <5 minutes.

### Phase 6 — Polish & Deploy (Months 8–14)

The difference between a prototype and a product. Offline mode, bilingual UI, and production infrastructure.

| Feature | Detail | Priority |
|---|---|---|
| **Bilingual UI toggle** | English ↔ Nepali toggle in sidebar. All UI strings translated. i18n library (react-i18next). | P0 |
| **Offline mode (Service Worker)** | Cache static assets. App loads and renders without internet. | P0 |
| **Offline POS** | Product catalog cached in IndexedDB. Transactions queued locally. Sync on reconnect. | P0 |
| **Sync engine** | FIFO queue for offline transactions. Server-side deduplication. Conflict: last-write-wins. | P0 |
| **Discounts & promotions CRUD** | Percentage, fixed amount, BOGO (buy one get one). Date-bound. | P1 |
| **Docker Compose** | Single `docker compose up` for full stack (app + db + cache). | P1 |
| **PostgreSQL migration** | Switch from SQLite to PostgreSQL. Migration script. Zero-downtime strategy. | P1 |
| **Seed data (Nepal)** | 100+ products across 10 categories. Real barcodes, real prices, Nepali names. | P1 |
| **Backup automation** | Daily DB dump → S3-compatible storage. 30-day retention. | P1 |
| **Monitoring** | Sentry (error tracking), PM2 (process manager), UptimeRobot (uptime monitoring). | P1 |
| **Deployment guide** | Step-by-step guide for DigitalOcean / AWS / NepalCloudHost. | P2 |

**Success criteria:** POS works fully offline for 8+ hours. Sync completes in <30 seconds when internet returns. Zero data loss in offline mode.

---

## 2. Year 2–3: Platform Maturity

### 2.1 Core Platform Hardening

| Initiative | Rationale | Effort |
|---|---|---|
| **Performance optimization** | POS page load <1s on 3G. Stock queries <100ms. Transaction creation <200ms. | 2 months |
| **Database indexing audit** | Index all foreign keys and frequently queried columns. EXPLAIN ANALYZE on slow queries. | 2 weeks |
| **API rate limiting** | Protect against abuse. 100 req/min per user for read endpoints. | 1 week |
| **Webhook system** | Notify external systems on transaction completion, low stock, PO receipt. | 1 month |
| **Audit log** | Every create/update/delete recorded with user, timestamp, old/new values. | 2 months |
| **Multi-language (i18n)** | Framework ready for Nepali + English. Easy to add Maithili, Bhojpuri, Newari. | 1 month maintenance |

### 2.2 Mobile App (Customer-Facing)

A lightweight mobile app that lets customers interact with the store without being at the counter.

```
CU Nepal Customer App
├── Loyalty card (digital — scan at POS)
├── Points balance + transaction history
├── Receive digital receipts (push notification / email)
├── Nearby store locator (map with directions)
├── Push notifications (offers, points expiry, receipt available)
└── QR code payment (pre-loaded wallet or Khalti/eSewa redirect)

Tech: React Native or Flutter
Platform: Android first (90%+ market share in Nepal)
Timeline: 4 months to MVP
```

### 2.3 Delivery Integration

Nepal's food delivery market (Foodmandu, Bhoj, Delivery Nepal) is growing. Convenience stores want in.

| Integration | How It Works |
|---|---|
| **Foodmandu API** | Menu sync → orders auto-imported to POS → inventory auto-deducted → order status updates |
| **Self-delivery** | In-app delivery toggle for stores that do their own delivery. Order management screen. |
| **Bhoj / Delivery Nepal** | Same pattern as Foodmandu. Each platform gets a dedicated integration module. |

### 2.4 B2B Supplier Marketplace

A network effect play: connect stores directly with suppliers.

```
Supplier Marketplace
├── Suppliers list products with wholesale prices
├── Stores browse and create POs directly
├── Auto-match: low-stock alerts → suggested POs from preferred suppliers
├── Rating system (delivery time, quality, price)
└── Payment: COD or digital settlement via Khalti/eSewa

Revenue: 2% commission on marketplace transactions
Timeline: 6 months after Phase 6
```

---

## 3. Year 3–5: Ecosystem & Scale

### 3.1 AI/ML Features

Once CU Nepal has transaction data from 500+ stores over 12+ months, AI becomes viable.

| Feature | Data Required | Value |
|---|---|---|
| **Demand forecasting** | 12mo sales per product per store | Predict next week's sales. Auto-generate POs. Reduce waste. |
| **Smart reorder suggestions** | Current stock + sales velocity + lead time + seasonality | "Reorder Wai Wai noodles: 48 units — 6 days until stockout" |
| **Anomaly detection** | Transaction patterns per cashier per shift | Flag unusual discounts, voided transactions, refund patterns (theft detection) |
| **Dynamic pricing** | Price elasticity data across stores | Suggest optimal price points. "NPR 18 → NPR 20: demand drops 5%, revenue +8%" |
| **Customer segmentation** | Purchase history across registered customers | "Your top 10% of customers buy instant noodles + Coke + cigarettes. Bundle them at NPR 150." |
| **Expiry prediction** | Expiry date + sell-through rate | "52 packs of biscuits expire in 14 days. At current rate, 18 will expire unsold. Suggest 15% discount." |

**Infrastructure needed:** Data warehouse (PostgreSQL analytics or ClickHouse), Python ML service (FastAPI), batch prediction pipeline (cron/airflow).

**Timeline:** Begin data collection now. First models live at 24 months.

### 3.2 Financial Services (Fintech Play)

The most lucrative direction. Store transaction data is a goldmine for credit scoring.

| Product | How It Works | Revenue Model |
|---|---|---|
| **Merchant cash advance** | Lend against future card/wallet revenue. Repayment as % of daily sales. | 15-25% APR equivalent |
| **Inventory financing** | "Buy now, pay later" for POs. CU Nepal pays supplier, store repays over 30/60/90 days. | 2-3% fee per PO |
| **Micro-loans to store owners** | Credit score based on transaction history, stock turnover, revenue consistency. | 18-24% APR |
| **Insurance** | Partner with Nepal insurance companies. Theft/fire insurance for store inventory. | Commission: 10-15% |

**Regulatory requirements:** Nepal Rastra Bank license for lending. Partnership with licensed financial institution for compliance.

**Timeline:** 24+ months. Partner with an NRB-licensed microfinance institution first.

### 3.3 Franchise Management Platform

Korean franchise brands (CU, GS25) are expanding in Nepal. They need a system that mirrors their Korean operations.

```
Franchise Module
├── Franchise fee tracking (monthly royalty %)
├── Central product catalog (franchisor controls pricing, promotions)
├── Brand compliance checklist (store audit form)
├── Multi-level reporting (franchisor sees all stores, franchisee sees own)
├── Marketing fund management (contribution tracking, promotion spend)
└── New store setup wizard (location, equipment, initial inventory)

Revenue: NPR 50,000–200,000/month per franchise brand
Timeline: 18+ months
```

### 3.4 White-Label & OEM

Larger retail chains want their own branded system.

```
White-Label Offering
├── Custom domain (mystore.cunepal.com or custom domain)
├── Custom logo, colors, branding
├── Custom receipt format (store-specific header/footer)
├── Custom report templates
├── Dedicated DB instance (data isolation)
└── SLA: 99.9% uptime, 4hr response time

Revenue: NPR 25,000–50,000/month per white-label instance
Timeline: 12+ months
```

---

## 4. Beyond Year 5: Moonshots

### 4.1 Self-Checkout Kiosk

Unattended checkout for small-format stores. A tablet + barcode scanner + payment terminal. Customer scans, pays, walks out.

**Tech stack:** Same POS backend + kiosk-specific UI (large buttons, no keyboard needed). Payment via Khalti/eSewa QR.

**Challenge:** Nepal market may not be ready for full self-checkout (trust, literacy). Introduce as "assisted checkout" first — customer scans, cashier approves on their tablet.

### 4.2 Inventory Drones / Automated Stock Count

Theft and inventory shrinkage is 2-5% of revenue in Nepal convenience stores. Regular stock counts are essential but manual.

**Near-term:** Mobile app with barcode scanning for stock count. "Scan all items on shelf → system compares with expected → report discrepancies."

**Long-term:** Computer vision shelf cameras that detect stock levels and trigger reorder. Partner with Hikvision / Dahua Nepal for camera hardware.

### 4.3 Buy Now, Pay Later (BNPL) for Consumers

Nepal's Khalti and eSewa are exploring BNPL. CU Nepal can integrate as a merchant.

**How it works:** Customer checks out → selects "Pay in 3" → Khalti/eSewa pays store upfront → customer repays Khalti/eSewa in installments.

**Revenue:** 3-5% merchant discount rate (higher than standard 2% for cards).

### 4.4 Smart Vending Machines

Integrate with vending machine telemetry. When a vending machine sells out, auto-create a P.O. for restock. Monitor machine health remotely.

**Target:** 200+ vending machines in Kathmandu malls, hospitals, colleges.

### 4.5 Export to India, Bangladesh, Sri Lanka

The South Asian retail market is massive and underserved by modern POS:

| Market | Stores | Opportunity |
|---|---|---|
| India (kirana stores) | 12M+ | Massive but crowded POS market. Differentiate on offline-first + bilingual. |
| Bangladesh | 1M+ | Similar to Nepal market. Mobile financial services (bKash, Nagad) widespread. |
| Sri Lanka | 500k+ | Smaller market, less competition. Economic recovery driving digitization. |

**Strategy:** Partner with local payment providers (India: Paytm/PhonePe, Bangladesh: bKash, Sri Lanka: Genie). Localize for each market's tax and language.

---

## 5. Technology Evolution Roadmap

### Phase 1-2 (Current) — Monolith with SQLite
```
React SPA → Express API → SQLite
Scale: 1-50 stores
```

### Phase 3-4 — Monolith with PostgreSQL
```
React SPA → Express API → PostgreSQL
Scale: 50-500 stores
```

### Phase 5-6 — Scaled Monolith + Cache
```
React SPA → Express API → Redis Cache → PostgreSQL Primary/Replica
Scale: 500-2,000 stores
```

### Year 2 — Microservices Breaking Point
```
React SPA → API Gateway
  ├── Auth Service (JWT, roles)
  ├── POS Service (transactions, cart)
  ├── Inventory Service (stock, movements, expiry)
  ├── Catalog Service (products, categories, brands)
  ├── Order Service (POs, suppliers)
  ├── Report Service (aggregations, exports)
  └── Payment Service (Khalti, eSewa, QR)
Scale: 2,000-10,000 stores
```

### Year 3+ — Event-Driven Architecture
```
React SPA → API Gateway
  ├── Services (same as above)
  └── Event Bus (RabbitMQ / Kafka)
        ├── Transaction completed → Update inventory, loyalty points, analytics
        ├── Stock low → Generate PO suggestion → Notify store manager
        ├── Payment received → Update ledger, send receipt
        └── Report generated → Cache, notify dashboard
Scale: 10,000+ stores
```

### Database Evolution

| Phase | Database | Why |
|---|---|---|
| Dev | SQLite | Zero setup, file-based |
| Initial prod | PostgreSQL on single VPS | Free, reliable, good for 500 stores |
| Scale | PostgreSQL primary + read replica | Read-heavy workload (reports, queries) |
| Growth | PostgreSQL + Redis cache | Sub-10ms reads for POS (critical for scan speed) |
| Enterprise | PostgreSQL sharded by store_id OR CockroachDB | Horizontal write scaling |
| Analytics | ClickHouse or TimescaleDB | Aggregation queries on millions of transactions |

---

## 6. Data Strategy & Analytics

### 6.1 Data Assets

CU Nepal will accumulate uniquely valuable data:

| Data Asset | Description | Value |
|---|---|---|
| **Transaction data** | What sells, when, at what price, with what payment method | Demand forecasting, pricing optimization |
| **Inventory data** | Stock levels, turnover, waste (expired), shrinkage | Working capital optimization |
| **Customer data** | Purchase frequency, basket size, preferred products | Loyalty programs, targeted offers |
| **Supplier data** | Delivery times, fill rates, pricing, quality | Supplier scoring, marketplace |
| **Multi-store data** | Performance variation by location, demographics | Site selection for new stores |

### 6.2 Data Monetization (With Consent)

| Product | Customer | Price | Timeline |
|---|---|---|---|
| **Nepal Convenience Store Report** (annual) | CPG companies (Coca-Cola, Unilever, noodles brands) | NPR 500,000 | Year 3 |
| **Category benchmark reports** | Suppliers, distributors | NPR 100,000/category | Year 3 |
| **Location intelligence** | Real estate developers, franchise brands | NPR 200,000/report | Year 4 |
| **Anonymized consumer insights** | Market research firms | Per-study pricing | Year 4 |

**Privacy:** All data monetization uses aggregated, anonymized data. No individual store data shared without explicit opt-in.

### 6.3 Analytics Infrastructure

```
┌──────────────┐    ┌──────────────────┐    ┌────────────────┐
│  PostgreSQL   │───▶│  ETL Pipeline    │───▶│  Data Warehouse│
│  (OLTP)       │    │  (cron or CDC)   │    │  (ClickHouse)  │
└──────────────┘    └──────────────────┘    └────────┬───────┘
                                                     │
                                      ┌──────────────┼──────────────┐
                                      ▼              ▼              ▼
                               ┌──────────┐  ┌──────────┐  ┌──────────┐
                               │ Metabase │  │ Superset │  │ ML       │
                               │ (reports)│  │ (dash-    │  │ Pipeline │
                               │          │  │  boards)  │  │ (Python) │
                               └──────────┘  └──────────┘  └──────────┘
```

---

## 7. Platform Ecosystem

### 7.1 API Marketplace

Open the API for third-party developers to build on top of CU Nepal.

```
API Marketplace
├── Public API documentation (OpenAPI/Swagger)
├── API key management (per-store or per-chain)
├── Rate limiting: 1,000 req/hour for free tier
├── Premium tier: 100,000 req/hour + dedicated support
└── Example integrations:
      ├── Accounting sync (Tally, Busy)
      ├── E-commerce sync (Daraz, HamroBazar)
      ├── Delivery platform integration (Foodmandu, Bhoj)
      └── Custom loyalty/rewards programs
```

**Revenue:** NPR 5,000/month for API access (enterprise tier). Transaction fee: NPR 0.50 per API call above free tier.

### 7.2 Hardware Partner Program

Certify and resell hardware through partners.

```
Hardware Partners
├── Barcode scanner vendors (Zebra, Honeywell, Chinese OEMs)
├── Thermal printer vendors (Epson, Star Micronics, local brands)
├── Tablet vendors (Samsung, Lenovo, Xiaomi)
├── UPS/battery vendors (Microtek, Luminous, APC)
└── POS terminal vendors (PAX, Ingenico — for card payments)

Partner benefits:
├── CU Nepal certification ("Works with CU Nepal" sticker)
├── Preferred pricing for CU Nepal customers
├── Joint marketing (co-branded flyers in store)
└── Technical integration support
```

### 7.3 Training & Certification

| Program | Audience | Price (NPR) | Duration |
|---|---|---|---|
| CU Nepal Basic Operator | Cashiers | Free (video) | 2 hours |
| CU Nepal Store Manager | Store owners | 2,000 | 1 day (in-person) |
| CU Nepal Chain Admin | Chain operators | 5,000 | 2 days |
| CU Nepal Developer Certification | Third-party devs | 10,000 | Online exam |

### 7.4 Community & Support

```
Support Tiers:
├── Free: Email support (48hr response), community forum, FAQ
├── Standard (Tier 1-2): WhatsApp support (4hr response), 9am-6pm NPT
├── Premium (Tier 3): Phone + WhatsApp + dedicated account manager, 24hr response
└── Enterprise (White-label): SLA-bound, 24/7 support, 1hr critical response

Community:
├── Facebook group: "CU Nepal Store Operators" (tips, Q&A, feature requests)
├── Annual user conference: "CU Nepal Conclave" (networking, training, roadmap)
├── Quarterly newsletter: Product updates, tips, store success stories
└── Feature voting: Public roadmap where users upvote features
```

---

## 8. International Expansion

### 8.1 Why Expand?

- Nepal's TAM caps at ~10,000 serviceable stores (NPR 360M/year ARR)
- Adjacent markets (India, Bangladesh) are 100x larger
- The offline-first architecture is uniquely suited for South Asia where internet reliability varies
- Competition in Nepal is weak; competition in India is fierce but fragmented

### 8.2 Expansion Logic

```
Year 1-2: Nepal → Validate product-market fit
Year 2-3: Nepal (deep) → 500 stores, profitable
Year 3: Indian border cities → Siliguri, Darjeeling, Dehradun
Year 4: India (North) → Uttar Pradesh, Bihar, Delhi NCR
Year 5: Bangladesh → Dhaka, Chittagong
Year 6: Sri Lanka → Colombo, Kandy
```

### 8.3 Localization Per Market

| Market | Payment | Tax | Language | Regulation |
|---|---|---|---|---|
| **India** | Paytm, PhonePe, GPay | GST (5/12/18/28%) | Hindi + regional | GST filing, state-specific |
| **Bangladesh** | bKash, Nagad, Rocket | 15% VAT | Bengali | BIDA registration |
| **Sri Lanka** | Genie, mCash | 8% VAT + 2% NBT | Sinhala, Tamil | SLAAS liability |

**Strategy:** Don't enter India directly. Find a local POS company struggling with technology and license CU Nepal as their platform (white-label + royalty). This avoids the distribution nightmare of 12M+ kirana stores.

---

## 9. Exit & Sustainability

### 9.1 Possible Exit Scenarios

| Scenario | Buyer | Rationale | Valuation |
|---|---|---|---|
| **Strategic acquisition** | Khalti / eSewa / IME Pay | Payment gateway needs POS integration for merchant network. CU Nepal = instant merchant POS network. | 5-8x ARR |
| **Vertical acquisition** | Coca-Cola / Unilever / CG Corp | CPG companies want retail data for distribution optimization. | 4-6x ARR |
| **Platform acquisition** | Toast / Square / Petpooja | International POS companies entering South Asia. CU Nepal = Nepal market + offline tech. | 8-12x ARR |
| **Management buyout** | Founders + PE firm | Company is profitable and growing. PE firm provides capital for expansion. | 3-5x ARR |
| **IPO** | Nepal Stock Exchange (NEPSE) | If reaching 5,000+ stores with NPR 200M+ ARR. | 10-15x ARR |

### 9.2 Defensibility Moats

| Moat | How CU Nepal Builds It | Time to Build |
|---|---|---|
| **Data network effect** | More stores → better demand forecasting → more value per store | 18+ months |
| **Switching cost** | Store's entire operation runs on the system. Inventory, pricing, customer history. Hard to migrate. | 6+ months per store |
| **Offline technology** | Competitors can't easily replicate offline-first architecture. It's hard. | 12+ months |
| **Payment integration** | Khalti/eSewa integrations take legal + technical work. Competitor must repeat it. | 3-6 months |
| **Localized workflow** | Korean convenience store workflow is niche but sticky for franchisees. | 6+ months |
| **Ecosystem** | Supplier marketplace, delivery integrations, API ecosystem → network effects. | 24+ months |

### 9.3 Sustainability Without Exit

CU Nepal is designed to be a sustainable, cash-flow-positive business without requiring an exit:

- **At 500 stores:** NPR 18M/year revenue, 80%+ gross margin, NPR 8M+/year net profit
- **At 2,000 stores:** NPR 72M/year revenue, scalable team, NPR 30M+/year net profit
- **At 5,000 stores:** NPR 180M/year, multiple revenue streams (SaaS + marketplace + fintech)

The business works at any scale. Exit is optional — the goal is to make Nepal's stores better.

---

## 10. Success Metrics Dashboard

### Product Metrics

| Metric | Current | 6 Months | 12 Months | 24 Months |
|---|---|---|---|---|
| Active stores | 0 | 25 | 100 | 500 |
| Daily transactions | 0 | 500 | 5,000 | 50,000 |
| Transaction success rate | — | 99% | 99.5% | 99.9% |
| POS page load time | — | <2s | <1s | <500ms |
| Offline sync time | — | <60s | <30s | <10s |
| Barcode scan → cart | — | <1s | <500ms | <200ms |

### Business Metrics

| Metric | Target (Year 1) | Target (Year 2) | Target (Year 3) |
|---|---|---|---|
| Monthly Recurring Revenue | NPR 150,000 | NPR 1,500,000 | NPR 4,500,000 |
| Gross Margin | 80% | 85% | 88% |
| Customer Acquisition Cost | NPR 5,000 | NPR 3,000 | NPR 2,000 |
| Lifetime Value | NPR 36,000 | NPR 72,000 | NPR 108,000 |
| LTV:CAC Ratio | 7:1 | 24:1 | 54:1 |
| Monthly Churn | <5% | <3% | <2% |
| Net Promoter Score | — | 40+ | 50+ |

### Quality Metrics

| Metric | Target |
|---|---|
| Uptime (API) | 99.9% |
| Uptime (offline POS) | 100% (by design) |
| API response time (p50) | <100ms |
| API response time (p99) | <500ms |
| Bug critical/severity fix time | <4 hours |
| Feature request → shipped (P0) | <2 weeks |

---

> **This future plan is ambitious by design.** Every item here is achievable, but not all at once. The priority order is: Phase 3 POS → Phase 4 Payments → Phase 5 Operations → Phase 6 Polish. Everything after that is icing on a cake that hasn't been baked yet. Get the first 10 stores live first. Then the first 100. Then think about AI and India.
