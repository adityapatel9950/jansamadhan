import React from 'react';
import { SelectOption } from '../../types/common';

export interface FilterProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  allLabel?: string;
}

export const Filter: React.FC<FilterProps> = ({
  label,
  value,
  options,
  onChange,
  allLabel = 'All',
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs font-medium text-slate-500">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
