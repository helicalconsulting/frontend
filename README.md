# 🏢 Workflow Approval System

> Enterprise-grade React frontend for workflow governance and approval — inspired by **SYSPRO ERP** dashboards.

A scalable, production-ready frontend that communicates with REST APIs via a clean service layer. Plug into **any backend** (.NET, Node.js, Go, Python) without refactoring UI code.

---

## ⚡ Tech Stack

| Layer              | Technology                               |
| ------------------ | ---------------------------------------- |
| **Framework**      | React 19 + TypeScript                    |
| **Bundler**        | Vite 8                                   |
| **Styling**        | Tailwind CSS v4                          |
| **UI Components**  | shadcn/ui pattern (custom-built)         |
| **Data Fetching**  | React Query (TanStack Query)             |
| **HTTP Client**    | Axios (with interceptors)                |
| **Charts**         | Recharts                                 |
| **Icons**          | Lucide React                             |
| **Routing**        | React Router v7                          |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

### Demo Credentials

| Field    | Value      |
| -------- | ---------- |
| Username | `ADMIN`    |
| Password | `admin123` |
| Company  | `EDU1`     |

---

## 🎨 Pages

### 1️⃣ Login Page

- Username, Password, Company fields (SYSPRO-style)
- Glassmorphism card with animated gradient background
- Password visibility toggle
- Mock authentication with token storage
- Auto-redirect to dashboard on success

### 2️⃣ Dashboard (Command Center)

- **4 KPI Cards** — Pending Approvals, Approved Today, Avg Processing Time, Total Financial Exposure
- **Area Chart** — 7-day approval vs rejection trends
- **Donut Chart** — Request type breakdown (PO, AP, Payments, Sales)
- **4 Section Cards** — Quick navigation to Purchase Orders, Accounts Payable, Payments, Sales Orders
- Trend indicators (↑↓ percentages vs last week)
- Skeleton loading states

### 3️⃣ Purchase Order Approval

- **Data Table** with columns: Select, Actions, Supplier, Order Date, Due Date, Exchange Rate, PO Value, Priority, Status
- **Search** — Filter by PO number or supplier name (real-time)
- **Status Filter** — All / Pending / Approved / Rejected
- **Row Expand** — Click chevron to view line item details (PO#, Line, Description, Qty, UOM, Price, Total)
- **Approve/Reject** — Per-row buttons with loading spinners
- **Bulk Actions** — Select multiple POs → Approve All / Return Request
- **Multi-currency support** — USD, EUR, GBP, KES with exchange rates
- **Summary badges** — Pending count + total value per currency
- **Empty state** — Clean illustration when no results match
- **Priority badges** — Low, Medium, High, Critical
- **Status badges** — Pending (yellow), Approved (green), Rejected (red)

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx          # Shell (sidebar + content outlet)
│   │   ├── Sidebar.tsx            # Collapsible sidebar navigation
│   │   └── Header.tsx             # Top bar with search & notifications
│   ├── ui/
│   │   ├── Button.tsx             # CVA variants (default, success, destructive, warning)
│   │   ├── Input.tsx              # Text input with focus styles
│   │   ├── Card.tsx               # Card container family
│   │   ├── Badge.tsx              # Status/priority badges
│   │   └── Skeleton.tsx           # Loading placeholder
│   ├── KPICard.tsx                # Dashboard KPI card with trends
│   ├── ApprovalTrendChart.tsx     # Area chart (Recharts)
│   └── RequestTypeChart.tsx       # Donut/pie chart (Recharts)
│
├── pages/
│   ├── LoginPage.tsx              # Authentication page
│   ├── DashboardPage.tsx          # Command center dashboard
│   └── PurchaseOrdersPage.tsx     # PO approval with data table
│
├── services/                      # ⭐ API SERVICE LAYER
│   ├── apiClient.ts               # Axios instance + auth interceptor
│   ├── authService.ts             # POST /auth/login
│   ├── dashboardService.ts        # GET /api/dashboard
│   └── purchaseService.ts         # GET/POST purchase orders
│
├── hooks/
│   ├── useAuth.ts                 # Auth context + hook
│   ├── useDashboard.ts            # React Query - dashboard data
│   └── usePurchaseOrders.ts       # React Query - POs + mutations
│
├── types/
│   └── index.ts                   # All TypeScript interfaces
│
├── mocks/
│   └── data.ts                    # Mock API response data
│
├── lib/
│   └── utils.ts                   # cn(), formatCurrency(), formatDate()
│
├── App.tsx                        # Routes, providers, auth guard
├── main.tsx                       # Entry point
└── index.css                      # Global styles + Tailwind config
```

---

## 📡 API Architecture

All data flows through a **service layer** — components **never** import mock data directly.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React      │────▶│  Custom      │────▶│  Service     │────▶│  Mock Data   │
│   Components │     │  Hooks       │     │  Layer       │     │  (for now)   │
│              │     │  (React      │     │  /services/  │     │  /mocks/     │
│              │     │   Query)     │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                │  (future)
                                                ▼
                                          ┌──────────────┐
                                          │  REST API    │
                                          │  via Axios   │
                                          └──────────────┘
```

### API Endpoints (Mock → Real)

| Method | Endpoint              | Service File            | Description             |
| ------ | --------------------- | ----------------------- | ----------------------- |
| POST   | `/auth/login`         | `authService.ts`        | User authentication     |
| GET    | `/api/dashboard`      | `dashboardService.ts`   | Dashboard KPIs & charts |
| GET    | `/api/purchase-orders`| `purchaseService.ts`    | List purchase orders    |
| POST   | `/api/approve-order`  | `purchaseService.ts`    | Approve a PO            |
| POST   | `/api/reject-order`   | `purchaseService.ts`    | Reject a PO             |

---

## 🔄 Switching to Real Backend

### Step 1: Set API Base URL

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-server.com/api
```

### Step 2: Update Service Functions

Each service file has comments showing the exact replacement. Example from `purchaseService.ts`:

```typescript
// BEFORE (mock):
export async function getPurchaseOrders(): Promise<PurchaseOrdersResponse> {
  await delay(900);
  return JSON.parse(JSON.stringify(mockPurchaseOrders));
}

// AFTER (real API):
export async function getPurchaseOrders(): Promise<PurchaseOrdersResponse> {
  return apiClient.get<PurchaseOrdersResponse>('/purchase-orders').then(r => r.data);
}
```

### Step 3: That's It

- ✅ No UI changes required
- ✅ No hook changes required
- ✅ Auth token is auto-attached via Axios interceptor
- ✅ 401 responses auto-redirect to login

---

## 🧠 State Management

| Concern           | Implementation                                          |
| ----------------- | ------------------------------------------------------- |
| **Auth State**    | React Context (`AuthProvider`) + `localStorage`         |
| **Server Data**   | React Query with `staleTime`, auto-refetch              |
| **Loading**       | Skeleton loaders in every component                     |
| **Mutations**     | `useMutation` → auto-invalidates queries on success     |
| **Route Guard**   | `ProtectedRoute` wrapper checks `localStorage`          |

---

## 🧩 Key Components

### KPI Card
- Accepts title, value, icon, trend data
- Auto-shows skeleton when `isLoading` is true
- Hover effects with gradient overlay

### Data Table (Purchase Orders)
- Built as a native HTML table (no heavy library)
- Row selection with checkboxes
- Expandable rows for line item drill-down
- Per-row approve/reject actions
- Bulk approve/reject for selected items

### Charts
- **ApprovalTrendChart** — Recharts AreaChart with gradient fills
- **RequestTypeChart** — Recharts PieChart (donut) with legends

### Layout
- **Sidebar** — Collapsible with toggle button, active state highlighting
- **Header** — Glassmorphism backdrop, search input, notification bell, user avatar

---

## 🎯 Design Decisions

1. **Service Layer Pattern** — All API calls centralized in `/services/` for easy backend swap
2. **React Query** — No manual loading/error states, built-in caching and refetch
3. **TypeScript Interfaces** — All data structures typed in `/types/index.ts`
4. **Shadcn/ui Pattern** — CVA-based component variants without the full shadcn CLI dependency
5. **Mock-first Development** — UI complete and testable before backend exists
6. **Interceptor-based Auth** — Token auto-attached to every request, 401 auto-handled

---

## 📜 Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server (HMR)         |
| `npm run build`   | Production build to `/dist`          |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint                           |

---

## 📝 License

MIT

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.
# frontend
