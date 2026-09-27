import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface ChallengesStatusChartProps {
  stats: {
    submitted: number;
    underReview: number;
    accepted: number;
    inProgress: number;
    resolved: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  Submitted: '#D97706', // amber-600
  'Under Review': '#0284C7', // sky-600
  'Accepted by Dept': '#2563EB', // blue-600
  'R&D In Progress': '#4F46E5', // indigo-600
  Resolved: '#059669', // emerald-600
};

export const ChallengesStatusChart: React.FC<ChallengesStatusChartProps> = ({ stats }) => {
  const chartData = [
    { name: 'Submitted', value: stats.submitted },
    { name: 'Under Review', value: stats.underReview },
    { name: 'Accepted by Dept', value: stats.accepted },
    { name: 'R&D In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#64748B'} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div className="bg-white p-2 border border-slate-200 rounded shadow-sm text-xs">
                    <span className="font-semibold text-slate-800">{item.name}: </span>
                    <span className="font-bold tabular-nums text-slate-900">{item.value}</span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
