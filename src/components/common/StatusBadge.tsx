import React from 'react';
import { ChallengeStatus } from '../../types/challenge';

export interface StatusBadgeProps {
  status: ChallengeStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const getBadgeConfig = (s: ChallengeStatus) => {
    switch (s) {
      case 'DRAFT':
        return {
          label: 'Draft',
          classes: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
        };
      case 'SUBMITTED':
        return {
          label: 'Submitted',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          classes: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'VERIFIED':
      case 'ACCEPTED':
        return {
          label: 'Verified by Nodal Officer',
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'ASSIGNED':
        return {
          label: 'Assigned to University/Team',
          classes: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'IN_PROGRESS':
        return {
          label: 'R&D In Progress',
          classes: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'PILOT':
        return {
          label: 'Field Pilot Underway',
          classes: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
        };
      case 'RESOLVED':
        return {
          label: 'Resolved & Deployed',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'CLOSED':
        return {
          label: 'Archived / Closed',
          classes: 'bg-zinc-100 text-zinc-700 border-zinc-300',
          dot: 'bg-zinc-400',
        };
      case 'REJECTED':
        return {
          label: 'Rejected / Out of Scope',
          classes: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: s,
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig(status);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.classes} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
