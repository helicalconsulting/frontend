import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/services/dashboardService';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
