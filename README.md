# CU Nepal — Convenience Store Management System

A full-featured web-based convenience store management system inspired by CU, GS25, and Seven Eleven in South Korea, built for Nepal.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (dev) / PostgreSQL (production)
- **ORM:** Prisma
- **Auth:** JWT (access tokens)

## Getting Started

### Prerequisites

- Node.js v20+
- npm v9+

### Setup

```bash
# Install dependencies
cd packages/server && npm install
cd packages/web && npm install
cd ../..

# Set up database and seed
cd packages/server
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
cd ../..
```

### Run Development

```bash
# Run both server and client
npm run dev

# Or run separately:
npm run dev:server   # API on http://localhost:3000
npm run dev:web      # UI on http://localhost:5173
```

### Default Login

- **Email:** admin@cu.com
- **Password:** admin123
- **Role:** OWNER

## Modules

| Module | Status |
|---|---|
| Auth & Roles | ✅ Done |
| Store Management | ✅ Done |
| Products & Categories | ✅ Done |
| POS Terminal | 🔜 In Progress |
| Inventory / Stock | 🔜 In Progress |
| Suppliers & Purchase Orders | 🔜 In Progress |
| Customer & Loyalty | 🔜 In Progress |
| Employee Management | 🔜 In Progress |
| Reporting | 🔜 In Progress |
| Discounts & Promotions | 🔜 In Progress |
| Expenses | 🔜 In Progress |
| Bilingual (Nepali/English) | ✅ Done |

## Nepal-Specific Features

- **NPR currency** formatting
- **13% VAT** auto-calculation
- **Bilingual** product names (English + Nepali/Devanagari)
- **PAN number** for suppliers
- **Khalti & eSewa** payment integration (planned)

## Project Structure

```
cu-system/
├── packages/
│   ├── server/          # Express + Prisma backend
│   │   ├── prisma/      # Schema, migrations, seed
│   │   └── src/         # Routes, controllers, middleware
│   └── web/             # React + Vite frontend
│       └── src/         # Pages, components, stores, API
├── docker-compose.yml
└── README.md
```
