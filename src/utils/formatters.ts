import { ChallengeStatus, ChallengePriority } from '../types/challenge';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const formatStatus = (status: ChallengeStatus): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'ACCEPTED':
      return 'Accepted by Dept';
    case 'IN_PROGRESS':
      return 'R&D In Progress';
    case 'RESOLVED':
      return 'Resolved & Deployed';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status;
  }
};

export const getStatusTextClass = (status: ChallengeStatus): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'text-amber-700 font-medium';
    case 'UNDER_REVIEW':
      return 'text-sky-700 font-medium';
    case 'ACCEPTED':
      return 'text-blue-700 font-medium';
    case 'IN_PROGRESS':
      return 'text-indigo-700 font-medium';
    case 'RESOLVED':
      return 'text-emerald-700 font-medium';
    case 'REJECTED':
      return 'text-rose-700 font-medium';
    default:
      return 'text-slate-700 font-medium';
  }
};

export const formatPriority = (priority: ChallengePriority): string => {
  switch (priority) {
    case 'CRITICAL':
      return 'Critical';
    case 'HIGH':
      return 'High';
    case 'MEDIUM':
      return 'Medium';
    case 'LOW':
      return 'Low';
    default:
      return priority;
  }
};

export const getPriorityTextClass = (priority: ChallengePriority): string => {
  switch (priority) {
    case 'CRITICAL':
      return 'text-rose-700 font-semibold';
    case 'HIGH':
      return 'text-amber-700 font-medium';
    case 'MEDIUM':
      return 'text-slate-700 font-medium';
    case 'LOW':
      return 'text-slate-500 font-medium';
    default:
      return 'text-slate-600 font-medium';
  }
};

export const JHARKHAND_DISTRICTS = [
  'Bokaro',
  'Chatra',
  'Deoghar',
  'Dhanbad',
  'Dumka',
  'East Singhbhum',
  'Garhwa',
  'Giridih',
  'Godda',
  'Gumla',
  'Hazaribagh',
  'Jamtara',
  'Khunti',
  'Koderma',
  'Latehar',
  'Lohardaga',
  'Pakur',
  'Palamu',
  'Ramgarh',
  'Ranchi',
  'Sahibganj',
  'Seraikela Kharsawan',
  'Simdega',
  'West Singhbhum',
];

export const CHALLENGE_CATEGORIES = [
  'Agriculture & Irrigation',
  'Drinking Water & Sanitation',
  'Rural Infrastructure & Roads',
  'Public Health & Nutrition',
  'Education & Skill Development',
  'Forest & Environment',
  'Tribal Livelihoods & Handicrafts',
  'Renewable Energy & Power',
  'Urban Governance & Waste',
];
