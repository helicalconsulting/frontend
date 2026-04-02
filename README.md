# 🏢 Helical Workflow Approval System — Frontend

> Enterprise-grade React frontend for workflow governance and approval — integrated with **SYSPRO ERP** via Helical Backend.

A scalable, production-ready frontend that communicates with REST APIs via a clean service layer. Designed to work seamlessly with the Helical Backend for SYSPRO ERP integration.

---

## 📌 What This Does

This frontend provides a complete workflow approval interface for:

| Module | Description |
|--------|-------------|
| **Purchase Orders** | Review & approve PO requisitions from SYSPRO |
| **Accounts Payable** | Invoice approval with GRN matching |
| **Payments** | Internal payment request management |
| **Sales Orders** | Credit limit overrides & sales approvals |
| **Master Data** | Supplier/Customer onboarding workflow |
| **Reports** | Analytics, trends, CSV exports |
| **Audit Trail** | Complete activity history |

---

## ⚡ Tech Stack

| Layer              | Technology                               |
| ------------------ | ---------------------------------------- |
| **Framework**      | React 19 + TypeScript 6                  |
| **Bundler**        | Vite 8                                   |
| **Styling**        | Tailwind CSS v4                          |
| **UI Components**  | Radix UI + shadcn/ui pattern             |
| **Data Fetching**  | TanStack Query (React Query) v5          |
| **HTTP Client**    | Axios (with interceptors)                |
| **Charts**         | Recharts v3                              |
| **Icons**          | Lucide React                             |
| **Routing**        | React Router v7                          |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running at `http://localhost:3001` (see `helicalbacckend/`)

### Installation

```bash
# Clone the repository
cd helicalfrontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
# → http://localhost:5173
```

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Demo Credentials (After Backend Seeding)

| Username | Role | Password |
|----------|------|----------|
| `admin` | Super Admin | `password123` |
| `approver_l1` | L1 Approver | `approver123` |
| `approver_l2` | L2 Approver | `approver123` |
| `finance_manager` | Finance Manager | `finance123` |

---

## 🗺️ All Pages (11 Total)

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Authentication with company selection |
| `/dashboard` | DashboardPage | KPIs, charts, quick navigation |
| `/purchase-orders` | PurchaseOrdersPage | PO list with approve/reject |
| `/accounts-payable` | AccountsPayablePage | Invoice approval + GRN matching |
| `/payments` | PaymentsPage | Create/manage payment requests |
| `/sales-orders` | SalesOrdersPage | Credit status + override requests |
| `/master-data` | MasterDataPage | Supplier/Customer onboarding list |
| `/master-data/new` | MasterDataRequestPage | Create new onboarding request |
| `/reports` | ReportsPage | Analytics with filters + CSV export |
| `/signature` | SignaturePage | Digital signature management |
| `/audit-trail` | AuditTrailPage | Activity logs |

---

## 🎨 Page Details

### 1️⃣ Login Page (`/login`)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│              🔷 HELICAL                           │
│            Workflow System                         │
│                                                    │
│         ┌────────────────────────┐                │
│         │ Username               │                │
│         └────────────────────────┘                │
│         ┌────────────────────────┐                │
│         │ Password          👁️  │                │
│         └────────────────────────┘                │
│         ┌────────────────────────┐                │
│         │ Company (e.g. EDU1)    │                │
│         └────────────────────────┘                │
│                                                    │
│         ┌────────────────────────┐                │
│         │       🔐 Sign In       │                │
│         └────────────────────────┘                │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Features:**
- Username/Password/Company fields (SYSPRO-style)
- Animated gradient background with glassmorphism
- Password visibility toggle
- JWT token storage in localStorage
- Auto-redirect to dashboard on success

---

### 2️⃣ Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ ⚠️ Pending  │ │ ✅ Approved │ │ ⏱️ Avg Time │ │ 💰 Value    │   │
│  │    35       │ │    12       │ │   2.4 hrs   │ │  $125,000   │   │
│  │  Approvals  │ │   Today     │ │ Processing  │ │  Exposure   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────┐ ┌──────────────────────┐   │
│  │     📊 APPROVAL TRENDS (7 Days)    │ │  🥧 REQUEST TYPES    │   │
│  │                                    │ │                      │   │
│  │     ▄                              │ │    ████████████      │   │
│  │   ▄ █ ▄     ▄                      │ │  ██  PO: 40%   ██    │   │
│  │   █ █ █ ▄   █                      │ │   █  AP: 28%    █    │   │
│  │ ▄ █ █ █ █ ▄ █                      │ │    ██         ██     │   │
│  │ Mon Tue Wed Thu Fri                │ │      ████████        │   │
│  └────────────────────────────────────┘ └──────────────────────┘   │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │🛒 PO     │ │📄 AP     │ │💳 Payment│ │📦 Sales  │               │
│  │  Open →  │ │  Open →  │ │  Open →  │ │  Open →  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- 4 KPI Cards with trend indicators (↑↓)
- 7-day Approval Trends Area Chart
- Request Type Donut Chart
- Quick navigation cards to all modules
- Skeleton loading states

**Backend API:**
```
GET /api/dashboard/kpis
GET /api/dashboard/trends
GET /api/dashboard/breakdown
```

---

### 3️⃣ Purchase Orders (`/purchase-orders`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: "Purchase Order Approval"                                  │
│  Subtitle: "Review and authorize pending purchase requests"         │
│                                                                     │
│  🔍 Search...          [All Status ▼]    Pending: 15 | $125,000    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │☐│▶│Actions │ Supplier     │ Date    │ Due    │ Value  │Status │ │
│  ├─┼─┼────────┼──────────────┼─────────┼────────┼────────┼───────┤ │
│  │☐│▶│ ✅ ❌  │ ABC Supplies │ Jan 15  │ Jan 30 │ $15,000│Pending│ │
│  │☐│▼│ ✅ ❌  │ XYZ Corp     │ Jan 16  │ Jan 31 │ $8,500 │Pending│ │
│  │ │ │                                                            │ │
│  │ │ │  ┌─────────────────────────────────────────────────────┐  │ │
│  │ │ │  │ Line Items:                                         │  │ │
│  │ │ │  │ 1. Office Chairs (10) × $500 = $5,000              │  │ │
│  │ │ │  │ 2. Office Desks (5) × $700 = $3,500                │  │ │
│  │ │ │  └─────────────────────────────────────────────────────┘  │ │
│  │ │ │                                                            │ │
│  └─┴─┴────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [✅ Bulk Approve]  [❌ Bulk Reject]  [↩️ Return Request]           │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Search by PO number or supplier
- Status filter (All/Pending/Approved/Rejected)
- Expandable rows with line item details
- Per-row Approve/Reject buttons
- Bulk actions for selected items
- Multi-currency support (USD, EUR, GBP, KES)
- Priority badges (Low, Medium, High, Critical)

**Backend API:**
```
GET /api/po/pending
POST /api/po/:poNumber/approve
POST /api/po/:poNumber/reject
```

---

### 4️⃣ Accounts Payable (`/accounts-payable`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: "Supplier Invoices Due"                                    │
│                                                                     │
│  [Home] [Payment Reports] [Exception] [Release Payment]            │
│                                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│  │ 📄 Total  │ │ ⚠️ Pending│ │ 🔴 Overdue│ │ 💰 Value  │           │
│  │    45     │ │    28     │ │     5     │ │  $250,000 │           │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │
│                                                                     │
│  Expandable Table with GRN Details:                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ GRN#     │ Stock Code │ Description  │ Qty │ Matched Value   │  │
│  │ GRN-001  │ ITEM-001   │ Office Chair │ 10  │ $5,000          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Tab navigation (Home, Payment Reports, Exception, Release Payment)
- Summary cards with totals
- Expandable rows showing GRN (Goods Received Note) details
- 3-way matching info (PO ↔ GRN ↔ Invoice)
- Aging days with color coding
- File attachment modal

---

### 5️⃣ Payments (`/payments`)

**Features:**
- Create new payment requests
- Multi-line items with tax calculation
- Save as Draft / Submit workflow
- L1 → L2 multi-level approval
- Edit draft requests
- Category selection (OPEX/CAPEX)

---

### 6️⃣ Sales Orders (`/sales-orders`)

**Features:**
- Credit status indicators (OK ✅, Warning ⚠️, Exceeded ❌)
- Credit limit override requests
- WhatsApp integration for communication
- Sub-tabs: Lines, Overdue Invoices, Aging Analysis
- Bulk approve/reject/return

---

### 7️⃣ Master Data (`/master-data`)

**Features:**
- Distribution chart (Suppliers vs Customers)
- Filter by workflow level
- Bulk approve/reject
- Document attachment indicators
- Navigate to create new request

---

### 8️⃣ Reports (`/reports`)

**Features:**
- Filter by module, action, date range
- Approval history table
- Summary statistics
- CSV export
- Pagination

---

### 9️⃣ Signature (`/signature`)

**Features:**
- View current signature
- Draw new signature (canvas-based)
- Clear and re-draw
- Save signature to profile

---

### 🔟 Audit Trail (`/audit-trail`)

**Features:**
- Filter by user, module, date range
- Complete activity log
- IP address tracking
- Timestamp details

---

## 📁 Project Structure

```
helicalfrontend/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Main layout (sidebar + content)
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar navigation
│   │   │   └── Header.tsx         # Page header component
│   │   ├── ui/
│   │   │   ├── Button.tsx         # CVA variants (default, success, destructive)
│   │   │   ├── Input.tsx          # Text input with styling
│   │   │   ├── Card.tsx           # Card container
│   │   │   ├── Badge.tsx          # Status badges
│   │   │   ├── Skeleton.tsx       # Loading placeholder
│   │   │   └── Toast.tsx          # Notifications
│   │   ├── KPICard.tsx            # Dashboard metric card
│   │   ├── ApprovalTrendChart.tsx # Area chart (Recharts)
│   │   ├── RequestTypeChart.tsx   # Pie/Donut chart
│   │   ├── SignaturePad.tsx       # Canvas drawing
│   │   └── FileAttachmentModal.tsx # Document viewer
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PurchaseOrdersPage.tsx
│   │   ├── AccountsPayablePage.tsx
│   │   ├── PaymentsPage.tsx
│   │   ├── SalesOrdersPage.tsx
│   │   ├── MasterDataPage.tsx
│   │   ├── MasterDataRequestPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SignaturePage.tsx
│   │   └── AuditTrailPage.tsx
│   │
│   ├── services/                  # ⭐ API SERVICE LAYER
│   │   ├── apiClient.ts           # Axios instance + interceptors
│   │   ├── authService.ts         # Login/logout
│   │   ├── dashboardService.ts    # Dashboard data
│   │   ├── purchaseService.ts     # PO operations
│   │   └── paymentService.ts      # Payment operations
│   │
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth context + hook
│   │   ├── useDashboard.ts        # Dashboard React Query
│   │   └── usePurchaseOrders.ts   # PO React Query + mutations
│   │
│   ├── types/
│   │   └── index.ts               # All TypeScript interfaces (330+ lines)
│   │
│   ├── mocks/
│   │   └── data.ts                # Mock data for development
│   │
│   ├── lib/
│   │   └── utils.ts               # cn(), formatCurrency(), formatDate()
│   │
│   ├── App.tsx                    # Routes + providers
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind
│
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite configuration
└── vercel.json                    # Vercel deployment config
```

---

## 📡 API Service Layer

All API calls go through the service layer — components never call APIs directly.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    React     │────▶│   Custom     │────▶│   Service    │────▶│   Backend    │
│  Components  │     │   Hooks      │     │   Layer      │     │   REST API   │
│              │     │(React Query) │     │  /services/  │     │   :3001      │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                         Auto-attaches JWT
                                         Handles 401 → /login
```

### Service Files

| File | Purpose |
|------|---------|
| `apiClient.ts` | Axios instance, JWT interceptor, error handling |
| `authService.ts` | `POST /api/auth/login` |
| `dashboardService.ts` | `GET /api/dashboard/*` |
| `purchaseService.ts` | `GET/POST /api/po/*` |
| `paymentService.ts` | `GET/POST /api/payments/*` |

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User opens app                                                  │
│     │                                                               │
│     ▼                                                               │
│  2. Check localStorage for 'auth_token' + 'auth_user'               │
│     │                                                               │
│     ├─── Found ─────────▶ Go to /dashboard                         │
│     │                                                               │
│     └─── Not Found ─────▶ Redirect to /login                       │
│                                                                     │
│  3. User submits login form                                         │
│     │                                                               │
│     ▼                                                               │
│  4. POST /api/auth/login { username, password, company }            │
│     │                                                               │
│     ├─── 200 OK ────────▶ Store token + user → Navigate /dashboard │
│     │                                                               │
│     └─── 401/Error ─────▶ Show error message                       │
│                                                                     │
│  5. On 401 from any API → Clear storage → Redirect /login          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### localStorage Keys

| Key | Content |
|-----|---------|
| `auth_token` | JWT access token |
| `auth_user` | JSON user object with roles/permissions |

---

## 🧠 State Management

| Concern | Implementation |
|---------|----------------|
| **Auth State** | React Context (`AuthProvider`) + `localStorage` |
| **Server Data** | TanStack Query with `staleTime`, auto-refetch |
| **Loading** | Skeleton components in every data-fetching component |
| **Mutations** | `useMutation` → auto-invalidates queries on success |
| **Route Guard** | `ProtectedRoute` wrapper checks localStorage |

---

## 🧩 UI Components

### Layout Components

| Component | Description |
|-----------|-------------|
| `AppLayout` | Main shell with sidebar + content outlet |
| `Sidebar` | Collapsible navigation with sections |
| `Header` | Page title + subtitle |

### UI Primitives

| Component | Description |
|-----------|-------------|
| `Button` | CVA variants: default, success, destructive, warning |
| `Input` | Styled text input |
| `Badge` | Status badges (success, warning, danger, info) |
| `Card` | Container with shadow |
| `Skeleton` | Loading placeholder |
| `Toast` | Notification popups |

### Feature Components

| Component | Description |
|-----------|-------------|
| `KPICard` | Dashboard metric card with trend indicator |
| `ApprovalTrendChart` | Recharts AreaChart |
| `RequestTypeChart` | Recharts PieChart (donut) |
| `SignaturePad` | Canvas-based signature drawing |
| `FileAttachmentModal` | Document viewer modal |

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Sidebar collapses on mobile (hamburger menu)
- ✅ Tables scroll horizontally on small screens
- ✅ KPI cards stack vertically on mobile
- ✅ Touch-friendly buttons and inputs

---

## 🛠️ TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
// Auth Types
LoginCredentials, AuthResponse, User, ModulePermission

// Dashboard Types
DashboardKPI, ApprovalTrend, RequestTypeBreakdown, DashboardData

// Purchase Order Types
PurchaseOrder, PurchaseOrderLineItem, ApproveRejectRequest

// Accounts Payable Types
SupplierInvoice, GRNDetail

// Payment Types
PaymentRequest, PaymentRequestLineItem, PaymentApprovalItem

// Sales Order Types
SalesOrder, SalesOrderLineDetail, OverdueInvoice

// Master Data Types
MasterDataRequest

// Report Types
FinanceReportEntry, AuditTrailEntry

// Common Types
Attachment
```

---

## 📜 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (HMR) at :5173 |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` is already configured for SPA routing.

### Manual Build

```bash
# Build
npm run build

# Output in /dist folder
# Serve with any static file server
```

---

## 🔗 Backend Connection

The frontend connects to the Helical Backend at:

```
http://localhost:3001/api  (development)
```

See `helicalbacckend/` folder for backend setup.

### Required Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/me` | GET | Current user info |
| `/api/dashboard/kpis` | GET | Dashboard metrics |
| `/api/dashboard/trends` | GET | Approval trends |
| `/api/po/pending` | GET | Pending POs |
| `/api/po/:id/approve` | POST | Approve PO |
| `/api/po/:id/reject` | POST | Reject PO |
| `/api/ap/invoices` | GET | AP invoices |
| `/api/payments` | GET/POST | Payment requests |
| `/api/sales/orders` | GET | Sales orders |
| `/api/onboarding/requests` | GET/POST | Onboarding requests |
| `/api/reports/*` | GET | Reports data |

---

## 🎯 Design Decisions

1. **Service Layer Pattern** — All API calls in `/services/` for easy backend swap
2. **React Query** — No manual loading/error states, built-in caching
3. **TypeScript Strict** — Full type safety with `strict: true`
4. **Radix UI + CVA** — Accessible primitives with variant-based styling
5. **Mock-first Development** — UI testable without backend
6. **Interceptor Auth** — JWT auto-attached, 401 auto-handled

---

## 📚 Related Documentation

- [Backend Documentation](../helicalbacckend/doc/README.md) — Complete backend docs
- [Frontend Pages Guide](../helicalbacckend/doc/16-FRONTEND-PAGES-GUIDE.md) — Detailed page explanations
- [SYSPRO Integration](../helicalbacckend/doc/04-SYSPRO-INTEGRATION.md) — How SYSPRO connects
- [API Endpoints](../helicalbacckend/doc/05-API-ENDPOINTS.md) — Full API reference

---

## 🐛 Troubleshooting

### CORS Errors
```bash
# Backend must allow frontend origin
# Set in backend's CORS config:
origin: ['http://localhost:5173']
```

### 401 Unauthorized
- Check if backend is running
- Check if `auth_token` exists in localStorage
- Token might be expired → re-login

### API Not Responding
```bash
# Check if backend is running
curl http://localhost:3001/api/health
```

---

## 📝 License

MIT

---

Built with ❤️ by Helical Consulting

**React 19** • **TypeScript 6** • **Vite 8** • **Tailwind CSS v4**
