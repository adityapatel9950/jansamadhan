import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChallenges } from '../../hooks/useChallenges';
import { challengeService } from '../../services/challengeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/tables/Table';
import { ChallengesByCategoryChart } from '../../components/charts/ChallengesByCategoryChart';
import { ChallengesStatusChart } from '../../components/charts/ChallengesStatusChart';
import { ChallengeStats, Challenge } from '../../types/challenge';
import {
  formatDate,
  formatStatus,
  getStatusTextClass,
  formatPriority,
  getPriorityTextClass,
} from '../../utils/formatters';
import { ShieldCheck, Database, Building2, Users, ArrowRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const { challenges, isLoading } = useChallenges({ limit: 6 });

  useEffect(() => {
    challengeService
      .getDashboardStats()
      .then((res) => setStats(res))
      .catch((err) => console.warn('[AdminDashboard] Error loading stats:', err));
  }, []);

  const columns = [
    {
      header: 'Problem Title',
      key: 'title',
      render: (item: Challenge) => (
        <div className="max-w-md">
          <Link
            to="/government/challenges"
            className="font-semibold text-slate-900 hover:text-emerald-900 block truncate"
          >
            {item.title}
          </Link>
          <div className="text-xs text-slate-500 mt-0.5">
            {item.category} · District: {item.district}
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      key: 'departmentName',
      render: (item: Challenge) => (
        <span className="text-xs text-slate-600 block max-w-[180px] truncate">
          {item.departmentName || 'Under Review'}
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
      header: 'Status',
      key: 'status',
      render: (item: Challenge) => (
        <span className={`text-xs ${getStatusTextClass(item.status)}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: 'Date',
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
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            State-Level Oversight & Administration
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            Smart India Hackathon 2026 Cell · Jharkhand
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nodal Administrator: <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.designation || 'State Coordinator'}) · Suchana Bhawan, Ranchi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/government/challenges">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Manage State Registry
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Intake</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats?.total ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 24 districts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>State Departments</span>
            <Building2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            7
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Nodal officers actively routing</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>R&D Pipeline</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">
            {(stats?.accepted || 0) + (stats?.inProgress || 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active problem statements</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Platform Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-emerald-700 uppercase mt-1">
            Phase 1 Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">PostgreSQL Ready</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card
            headerKicker="Audit Log & Intake"
            title="State Registry Submissions"
            subtitle="Latest problems logged across all districts"
            headerAction={
              <Link to="/government/challenges">
                <Button variant="ghost" size="sm">
                  View Full Registry
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

        <div className="lg:col-span-4 space-y-6">
          <Card
            headerKicker="Lifecycle Funnel"
            title="Resolution Status"
            subtitle="Current state funnel"
          >
            {stats ? (
              <ChallengesStatusChart stats={stats} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading...
              </div>
            )}
          </Card>

          <Card
            headerKicker="Domain Distribution"
            title="Sectors"
            subtitle="Breakdown by department domain"
          >
            {stats?.byCategory ? (
              <ChallengesByCategoryChart data={stats.byCategory} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading...
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
