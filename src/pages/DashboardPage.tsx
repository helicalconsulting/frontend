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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Animated background pattern */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
        <div className="absolute bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      </div>
      
      <Header title="Dashboard Overview" subtitle="Real-time approval command center" />

      <div className="p-6 space-y-6 animate-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <div className="animate-slide-up">
            <KPICard
              title="Pending Approvals"
              value={isLoading ? '—' : formatNumber(data!.kpis.pendingApprovals)}
              icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
              iconBgColor="bg-amber-100"
              trend={{ value: 12, isPositive: false }}
              isLoading={isLoading}
            />
          </div>
          <div className="animate-slide-up delay-75">
            <KPICard
              title="Approved Today"
              value={isLoading ? '—' : formatNumber(data!.kpis.approvedToday)}
              icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
              iconBgColor="bg-emerald-100"
              trend={{ value: 8, isPositive: true }}
              isLoading={isLoading}
            />
          </div>
          <div className="animate-slide-up delay-100">
            <KPICard
              title="Avg. Processing (hrs)"
              value={isLoading ? '—' : data!.kpis.avgProcessingTime.toLocaleString()}
              icon={<Clock className="h-6 w-6 text-blue-600" />}
              iconBgColor="bg-blue-100"
              isLoading={isLoading}
            />
          </div>
          <div className="animate-slide-up delay-200">
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

                return (
                  <button
                    key={section.id}
                    onClick={() => section.route && navigate(section.route)}
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center cursor-pointer"
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
