import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { RequestTypeBreakdown } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

interface RequestTypeChartProps {
  data: RequestTypeBreakdown[];
  isLoading?: boolean;
}

export function RequestTypeChart({ data, isLoading }: RequestTypeChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Requests by Type</h3>
      <p className="text-xs text-gray-400 mb-4">Distribution of pending requests</p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value} (${((value / total) * 100).toFixed(0)}%)`,
              'Count',
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '13px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-gray-600 ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
