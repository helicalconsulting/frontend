import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/KPICard';
import { ApprovalTrendChart } from '@/components/ApprovalTrendChart';
import { RequestTypeChart } from '@/components/RequestTypeChart';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Receipt,
  CreditCard,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const sectionIcons: Record<string, typeof ShoppingCart> = {
  'ShoppingCart': ShoppingCart,
  'Receipt': Receipt,
  'CreditCard': CreditCard,
  'TrendingUp': TrendingUp,
};

const sectionColors: Record<string, string> = {
  'purchase-orders': 'from-blue-500 to-blue-600',
  'accounts-payable': 'from-emerald-500 to-emerald-600',
  'payments': 'from-amber-500 to-amber-600',
  'sales-orders': 'from-purple-500 to-purple-600',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard Overview" subtitle="Real-time approval command center" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Pending Approvals"
            value={isLoading ? '—' : formatNumber(data!.kpis.pendingApprovals)}
            icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
            iconBgColor="bg-amber-100"
            trend={{ value: 12, isPositive: false }}
            isLoading={isLoading}
          />
          <KPICard
            title="Approved Today"
            value={isLoading ? '—' : formatNumber(data!.kpis.approvedToday)}
            icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
            iconBgColor="bg-emerald-100"
            trend={{ value: 8, isPositive: true }}
            isLoading={isLoading}
          />
          <KPICard
            title="Avg. Processing (hrs)"
            value={isLoading ? '—' : data!.kpis.avgProcessingTime.toLocaleString()}
            icon={<Clock className="h-6 w-6 text-blue-600" />}
            iconBgColor="bg-blue-100"
            isLoading={isLoading}
          />
          <KPICard
            title="Total Value"
            value={
              isLoading
                ? '—'
                : formatCurrency(data!.kpis.totalFinancialExposure, data!.kpis.currency)
            }
            icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
            iconBgColor="bg-indigo-100"
            trend={{ value: 15, isPositive: true }}
            isLoading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ApprovalTrendChart
              data={data?.approvalTrends || []}
              isLoading={isLoading}
            />
          </div>
          <div>
            <RequestTypeChart
              data={data?.requestTypes || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(4)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-200" />
                      <div className="h-4 w-28 rounded bg-gray-200" />
                      <div className="h-8 w-16 rounded bg-gray-200" />
                    </div>
                  </div>
                ))
            : data?.sections.map((section) => {
                const IconComp = sectionIcons[section.icon] || ShoppingCart;
                const gradient = sectionColors[section.id] || 'from-gray-500 to-gray-600';
                const isClickable = section.id === 'purchase-orders';

                return (
                  <button
                    key={section.id}
                    onClick={() => isClickable && navigate('/purchase-orders')}
                    className={`group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center ${
                      isClickable ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
                      >
                        <IconComp className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        {section.title}
                      </h3>
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="text-xs font-medium">Open</span>
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
