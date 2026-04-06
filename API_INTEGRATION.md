# API Integration Guide

## Overview
The frontend is now fully integrated with the backend API using a clean, maintainable architecture.

## Architecture

### 1. Configuration Layer (`/src/config/`)
- **api.config.ts**: Central API configuration
  - Base URLs
  - Timeouts
  - Token keys
  - All API endpoints (typed)
  - Feature flags

### 2. HTTP Client (`/src/services/apiClient.ts`)
- Axios instance with interceptors
- **Request Interceptor**: Auto-attaches JWT tokens
- **Response Interceptor**: Handles token refresh on 401
- Automatic logout on authentication failures

### 3. Service Layer (`/src/services/`)
All services use the centralized config and apiClient:
- `authService.ts` - Authentication & user management
- `dashboardService.ts` - Dashboard data & KPIs
- `paymentService.ts` - Payment request operations
- `poService.ts` - Purchase order operations
- `salesService.ts` - Sales order operations
- `apService.ts` - Accounts payable operations
- `onboardingService.ts` - Employee onboarding
- `adminService.ts` - Admin & configuration
- `reportService.ts` - Reports & analytics

### 4. React Query Integration (`/src/lib/`)
- **queryClient.ts**: Configured query client with:
  - Smart caching (30s stale time, 5min cache)
  - Automatic retries with exponential backoff
  - Typed query keys for consistency
- **errorHandler.ts**: Centralized error handling

### 5. Custom Hooks (`/src/hooks/`)
React Query hooks for easy data fetching:
- `useAuth.ts` - Login, logout, profile
- `useDashboard.ts` - Dashboard data
- `usePayments.ts` - Payment CRUD operations
- etc.

## Usage Examples

### Authentication
\`\`\`typescript
import { useLogin, useProfile } from '@/hooks/useAuth';

function LoginForm() {
  const login = useLogin();
  const { data: user, isLoading } = useProfile();
  
  const handleLogin = async (credentials) => {
    await login.mutateAsync(credentials);
  };
  
  return (/* ... */);
}
\`\`\`

### Fetching Data
\`\`\`typescript
import { usePaymentRequests } from '@/hooks/usePayments';

function PaymentsList() {
  const { data, isLoading, error } = usePaymentRequests({
    status: 'PENDING',
    page: 1,
    limit: 20,
  });
  
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  
  return (/* render data.payments */);
}
\`\`\`

### Mutations
\`\`\`typescript
import { useApprovePayment } from '@/hooks/usePayments';

function ApproveButton({ paymentId }) {
  const approve = useApprovePayment();
  
  const handleApprove = async () => {
    await approve.mutateAsync({
      id: paymentId,
      data: { comment: 'Approved', signature: '...' }
    });
  };
  
  return <Button onClick={handleApprove} loading={approve.isPending} />;
}
\`\`\`

## Environment Variables

Create a `.env` file:
\`\`\`bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Use mock data (development only)
VITE_USE_MOCK=false
\`\`\`

## Key Features

### 1. Automatic Token Management
- JWT tokens auto-attached to requests
- Automatic token refresh on expiry
- Failed requests queued during refresh
- Auto-logout on auth failures

### 2. Smart Caching
- Data cached for 30 seconds (configurable per query)
- Automatic background refetching
- Cache invalidation on mutations
- Optimistic updates support

### 3. Error Handling
- Typed error responses
- User-friendly error messages
- Automatic retry with backoff
- Network error handling

### 4. TypeScript Support
- Fully typed API responses
- Autocomplete for endpoints
- Type-safe query keys
- IntelliSense support

## API Endpoints Reference

All endpoints are defined in `API_CONFIG.ENDPOINTS`:

\`\`\`typescript
import { API_CONFIG } from '@/config';

// Examples:
API_CONFIG.ENDPOINTS.AUTH.LOGIN           // '/auth/login'
API_CONFIG.ENDPOINTS.DASHBOARD.KPIS       // '/dashboard/kpis'
API_CONFIG.ENDPOINTS.PAYMENTS.APPROVE(id) // '/payments/{id}/approve'
API_CONFIG.ENDPOINTS.PO.DETAIL(poNumber)  // '/po/{poNumber}'
\`\`\`

## Best Practices

1. **Use React Query hooks** instead of direct service calls
2. **Invalidate cache** after mutations
3. **Handle loading & error states** in components
4. **Use typed endpoints** from API_CONFIG
5. **Centralize error handling** with errorHandler

## Migration Notes

### Before (Mock Mode)
\`\`\`typescript
const USE_MOCK = true;
if (USE_MOCK) {
  return mockData;
}
await apiClient.get('/hardcoded-path');
\`\`\`

### After (Integrated)
\`\`\`typescript
import { API_CONFIG } from '@/config';
await apiClient.get(API_CONFIG.ENDPOINTS.MODULE.ACTION);
\`\`\`

## Testing

Mock mode can be enabled via environment variable:
\`\`\`bash
VITE_USE_MOCK=true npm run dev
\`\`\`

## Troubleshooting

### CORS Errors
Ensure backend allows frontend origin in CORS settings.

### 401 Unauthorized
Check if backend is running and JWT tokens are valid.

### Network Errors
Verify `VITE_API_BASE_URL` points to correct backend.

### Cache Issues
Clear React Query cache: `queryClient.clear()`
