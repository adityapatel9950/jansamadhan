import React from 'react';
import {
  CITIZEN_CHALLENGE_CATEGORIES,
  ChallengeStatus,
} from '../../types/challenge';
import { JHARKHAND_DISTRICTS } from '../../utils/formatters';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface SearchFilterProps {
  search: string;
  status: string;
  category: string;
  district: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onDistrictChange: (val: string) => void;
  onReset: () => void;
  statusOptions?: { value: string; label: string }[];
}

const DEFAULT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'VERIFIED', label: 'Verified by Nodal Officer' },
  { value: 'ASSIGNED', label: 'Assigned to University' },
  { value: 'IN_PROGRESS', label: 'R&D In Progress' },
  { value: 'PILOT', label: 'Field Pilot Underway' },
  { value: 'RESOLVED', label: 'Resolved & Deployed' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  status,
  category,
  district,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onDistrictChange,
  onReset,
  statusOptions = DEFAULT_STATUS_OPTIONS,
}) => {
  const hasActiveFilters = Boolean(search || status || category || district);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by problem title, keywords, village, or description..."
          className="w-full text-xs pl-9 pr-3 py-2 rounded border border-slate-300 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-xs rounded border border-slate-300 bg-white px-2 py-1.5 focus:border-emerald-600 focus:outline-none"
        >
          <option value="">All Categories</option>
          {CITIZEN_CHALLENGE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="text-xs rounded border border-slate-300 bg-white px-2 py-1.5 focus:border-emerald-600 focus:outline-none"
        >
          <option value="">All Districts (Jharkhand)</option>
          {JHARKHAND_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Status */}
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 text-xs rounded border border-slate-300 bg-white px-2 py-1.5 focus:border-emerald-600 focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="p-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
