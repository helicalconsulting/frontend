import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/KPICard';
import { ApprovalTrendChart } from '@/components/ApprovalTrendChart';
import { RequestTypeChart } from '@/components/RequestTypeChart';
import { Badge } from '@/components/ui/Badge';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
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
  Users,
  Wifi,
  Activity,
  FileText,
  Shield,
} from 'lucide-react';

const sectionIcons: Record<string, typeof ShoppingCart> = {
  ShoppingCart: ShoppingCart,
  Receipt: Receipt,
  CreditCard: CreditCard,
  TrendingUp: TrendingUp,
};

const sectionColors: Record<string, string> = {
  'purchase-orders': 'from-blue-500 to-blue-600',
  'accounts-payable': 'from-emerald-500 to-emerald-600',
  payments: 'from-amber-500 to-amber-600',
  'sales-orders': 'from-purple-500 to-purple-600',
};

// Recent activity data
const recentActivity = [
  {
    id: 1,
    action: 'approved',
    user: 'John Manager',
    item: 'PO-000512',
    module: 'Purchase Order',
    amount: 45000,
    currency: 'USD',
    time: '5 min ago',
    icon: CheckCircle2,
    color: 'text-emerald-500',
  },
  {
    id: 2,
    action: 'submitted',
    user: 'Mike Staff',
    item: 'PR-2026-006',
    module: 'Payment Request',
    amount: 12500,
    currency: 'USD',
    time: '12 min ago',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    id: 3,
    action: 'rejected',
    user: 'Sarah Finance',
    item: 'INV-2026-0515',
    module: 'AP Invoice',
    amount: 3200,
    currency: 'USD',
    time: '28 min ago',
    icon: AlertTriangle,
    color: 'text-red-500',
  },
  {
    id: 4,
    action: 'approved',
    user: 'Robert Director',
    item: 'SO-000001142',
    module: 'Credit Override',
    amount: 25000,
    currency: 'USD',
    time: '1 hr ago',
    icon: CheckCircle2,
    color: 'text-emerald-500',
  },
  {
    id: 5,
    action: 'created',
    user: 'Emily Procurement',
    item: 'ONB-007',
    module: 'Supplier Onboarding',
    amount: null,
    currency: null,
    time: '2 hrs ago',
    icon: Users,
    color: 'text-indigo-500',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden contain-layout bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10">
      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div
  className="absolute top-40 -left-40 h-72 w-72 rounded-full bg-blue-400/10 blur-2xl opacity-50 pointer-events-none"
/>

<div
  className="absolute bottom-40 -right-40 h-72 w-72 rounded-full bg-indigo-400/10 blur-2xl opacity-50 pointer-events-none"
/>
      </div>

      <Header
        title="Dashboard Overview"
        subtitle="Real-time approval command center"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Welcome + SYSPRO Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Here's what's happening across your workflow system
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5">
              <Wifi className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                SYSPRO: Mock Mode
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                System Healthy
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 items-stretch">

          <div className="animate-slide-up h-full">
            <KPICard
              className="h-full"
              title="Pending Approvals"
              value={isLoading ? '—' : formatNumber(data!.kpis.pendingApprovals)}
              icon={<AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />}
              iconBgColor="bg-amber-100"
              trend={{ value: 12, isPositive: false }}
              isLoading={isLoading}
            />
          </div>

          <div className="h-full">
            <KPICard
              className="h-full"
              title="Approved Today"
              value={isLoading ? '—' : formatNumber(data!.kpis.approvedToday)}
              icon={<CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />}
              iconBgColor="bg-emerald-100"
              trend={{ value: 8, isPositive: true }}
              isLoading={isLoading}
            />
          </div>

          <div className="animate-slide-up delay-100 h-full">
            <KPICard
              className="h-full"
              title="Avg. Processing (hrs)"
              value={isLoading ? '—' : data!.kpis.avgProcessingTime.toLocaleString()}
              icon={<Clock className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />}
              iconBgColor="bg-blue-100"
              isLoading={isLoading}
            />
          </div>

          <div className="animate-slide-up delay-200 h-full">
            <KPICard
              className="h-full"
              title="Total Value"
              icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-700 dark:text-indigo-300 stroke-[2.5]" />}
              value={
                isLoading
                  ? '—'
                  : formatCurrency(
                    data!.kpis.totalFinancialExposure,
                    data!.kpis.currency
                  )
              }
              iconBgColor="bg-indigo-100"
              trend={{ value: 15, isPositive: true }}
              isLoading={isLoading}
            />
          </div>

        </div>

        {/* Charts + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-2">
            <ApprovalTrendChart
              data={data?.approvalTrends || []}
              isLoading={isLoading}
            />
          </div>
          <div className="h-full">
  <RequestTypeChart
    data={data?.requestTypes || []}
    isLoading={isLoading}
  />
</div>
        </div>

        {/* Module Cards + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Section Cards */}
          <div className="lg:col-span-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Approval Queues
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {isLoading
                ? Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-slate-800" />
                        <div className="flex-1">
                          <div className="h-4 w-28 rounded bg-gray-200 dark:bg-slate-800 mb-2" />
                          <div className="h-6 w-16 rounded bg-gray-200 dark:bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  ))
                : data?.sections.map((section) => {
                  const IconComp =
                    sectionIcons[section.icon] || ShoppingCart;
                  const gradient =
                    sectionColors[section.id] || 'from-gray-500 to-gray-600';

                  return (
                    <button
                      key={section.id}
                      onClick={() =>
                        section.route && navigate(section.route)
                      }
                      className="group rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:-translate-y-1 text-left cursor-pointer w-full"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-md transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}
                        >
                          <IconComp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-slate-300 truncate">
                            {section.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                              {section.count}
                            </span>
                            <Badge variant="warning" className="text-xs">
                              pending
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-500 flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Quick Actions */}
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-5 sm:mt-6 mb-3">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                {
                  label: 'Master Data',
                  icon: Users,
                  route: '/master-data',
                  gradient: 'from-cyan-500 to-cyan-600',
                  count: 4,
                },
                {
                  label: 'Reports',
                  icon: Activity,
                  route: '/reports',
                  gradient: 'from-blue-500 to-blue-600',
                  count: null,
                },
                {
                  label: 'Audit Trail',
                  icon: FileText,
                  route: '/audit-trail',
                  gradient: 'from-gray-500 to-gray-600',
                  count: null,
                },
                {
                  label: 'Admin',
                  icon: Shield,
                  route: '/admin/users',
                  gradient: 'from-indigo-500 to-indigo-600',
                  count: null,
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className="group flex items-center gap-2 sm:gap-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm transition-all hover:shadow-md dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} shadow-sm transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}
                  >
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 truncate">
                      {item.label}
                    </p>
                    {item.count && (
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">
                        {item.count} pending
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Recent Activity
            </h3>
            <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 sm:p-4 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-slate-200">
                          <span className="font-semibold">
                            {activity.user}
                          </span>{' '}
                          <span
                            className={
                              activity.action === 'approved'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : activity.action === 'rejected'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-blue-600 dark:text-blue-400'
                            }
                          >
                            {activity.action}
                          </span>{' '}
                          <span className="font-mono text-[10px] sm:text-xs bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {activity.item}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-500">
                            {activity.module}
                          </span>
                          {activity.amount && (
                            <>
                              <span className="text-xs text-gray-300 dark:text-slate-600">•</span>
                              <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-slate-400">
                                {formatCurrency(
                                  activity.amount,
                                  activity.currency || 'USD'
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50/80 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800/60">
                <button
                  onClick={() => navigate('/audit-trail')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All Activity
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
