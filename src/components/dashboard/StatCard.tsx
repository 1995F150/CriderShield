import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium ${trend.isUpward ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUpward ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};
