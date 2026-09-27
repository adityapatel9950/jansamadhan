import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChallenges } from '../../hooks/useChallenges';
import { challengeService } from '../../services/challengeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/tables/Table';
import { ChallengesByCategoryChart } from '../../components/charts/ChallengesByCategoryChart';
import { ChallengeStats, Challenge } from '../../types/challenge';
import {
  formatDate,
  formatStatus,
  getStatusTextClass,
  formatPriority,
  getPriorityTextClass,
} from '../../utils/formatters';
import { Briefcase, Building2, Handshake, ArrowRight, DollarSign } from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChallengeStats | null>(null);

  // Challenges in active progress or accepted for scaling
  const { challenges, isLoading } = useChallenges({ limit: 5 });

  useEffect(() => {
    challengeService
      .getDashboardStats()
      .then((res) => setStats(res))
      .catch((err) => console.warn('[IndustryDashboard] Error loading stats:', err));
  }, []);

  const columns = [
    {
      header: 'Innovation Initiative',
      key: 'title',
      render: (item: Challenge) => (
        <div className="max-w-md">
          <Link
            to="/citizen/challenges"
            className="font-semibold text-slate-900 hover:text-emerald-900 block truncate"
          >
            {item.title}
          </Link>
          <div className="text-xs text-slate-500 mt-0.5">
            District: {item.district} · {item.category}
          </div>
        </div>
      ),
    },
    {
      header: 'Beneficiary Population',
      key: 'impactedPopulationEstimate',
      align: 'right' as const,
      render: (item: Challenge) => (
        <span className="text-xs text-slate-700 tabular-nums font-medium">
          {item.impactedPopulationEstimate?.toLocaleString()} citizens
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: Challenge) => (
        <span className={`text-xs ${getStatusTextClass(item.status)}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (item: Challenge) => (
        <span className={`text-xs ${getPriorityTextClass(item.priority)}`}>
          {formatPriority(item.priority)}
        </span>
      ),
    },
    {
      header: 'Reported',
      key: 'createdAt',
      align: 'right' as const,
      render: (item: Challenge) => (
        <span className="text-xs text-slate-500 tabular-nums">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Industry & CSR Partnership Desk
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            {user?.organizationOrDepartment || 'Industry Partner Console'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Partner Representative: <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.designation || 'CSR Innovation Lead'}) · {user?.district}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/citizen/challenges">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Pilot Opportunities
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>High-Impact Problems</span>
            <Briefcase className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats?.total ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Eligible for CSR pilot grants</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Active Academic Pilots</span>
            <Handshake className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">
            {stats?.inProgress ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Co-mentored with university faculty</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>CSR Funds Allocated</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            ₹ 48.5 L
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Committed for field validations</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Deployments Scaled</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {stats?.resolved ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Adopted by district administration</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card
            headerKicker="CSR Engagement"
            title="Societal Innovations Open for Industry Adoption"
            subtitle="Projects with working student prototypes seeking seed funding, industrial mentoring, or manufacturing scaling"
            headerAction={
              <Link to="/citizen/challenges">
                <Button variant="ghost" size="sm">
                  Full Pipeline
                </Button>
              </Link>
            }
          >
            <Table
              columns={columns}
              data={challenges}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
            />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card
            headerKicker="Sectoral Allocation"
            title="Needs by Industry Sector"
            subtitle="Sectors demanding technological intervention"
          >
            {stats?.byCategory ? (
              <ChallengesByCategoryChart data={stats.byCategory} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading sectors...
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
