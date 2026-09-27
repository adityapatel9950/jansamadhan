import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface ChallengesByCategoryChartProps {
  data: Record<string, number>;
}

export const ChallengesByCategoryChart: React.FC<ChallengesByCategoryChartProps> = ({
  data,
}) => {
  const chartData = Object.entries(data).map(([category, count]) => {
    // Shorten category names for clean axis legibility
    const shortLabel = category
      .replace('Agriculture & Irrigation', 'Agriculture')
      .replace('Drinking Water & Sanitation', 'Drinking Water')
      .replace('Rural Infrastructure & Roads', 'Roads & Infra')
      .replace('Public Health & Nutrition', 'Public Health')
      .replace('Education & Skill Development', 'Education')
      .replace('Forest & Environment', 'Forestry')
      .replace('Tribal Livelihoods & Handicrafts', 'Tribal Crafts');

    return {
      name: shortLabel,
      fullName: category,
      count,
    };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748B' }}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748B' }}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-2.5 border border-slate-200 rounded shadow-md text-xs">
                    <p className="font-semibold text-slate-800">{item.fullName}</p>
                    <p className="text-emerald-800 font-medium tabular-nums mt-0.5">
                      {item.count} Registered Challenges
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill="#064E3B" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
