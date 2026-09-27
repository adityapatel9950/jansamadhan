import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChallenges } from '../../hooks/useChallenges';
import { challengeService } from '../../services/challengeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/tables/Table';
import { ChallengesStatusChart } from '../../components/charts/ChallengesStatusChart';
import { ChallengeStats, Challenge } from '../../types/challenge';
import {
  formatDate,
  formatStatus,
  getStatusTextClass,
  formatPriority,
  getPriorityTextClass,
} from '../../utils/formatters';
import { Building2, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const { challenges, isLoading } = useChallenges({ limit: 5 });

  useEffect(() => {
    challengeService
      .getDashboardStats()
      .then((res) => setStats(res))
      .catch((err) => console.warn('[GovernmentDashboard] Error loading stats:', err));
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
            {item.district} · {item.category}
          </div>
        </div>
      ),
    },
    {
      header: 'Reported By',
      key: 'submittedByName',
      render: (item: Challenge) => (
        <span className="text-xs text-slate-700">
          {item.submittedByName} ({item.submittedByRole})
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
      header: 'Submitted',
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
      {/* Officer Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Government Department Nodal Console
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            {user?.organizationOrDepartment || 'Department Office'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Officer: <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.designation || 'Nodal Officer'}) · {user?.district}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/government/challenges">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Pending Submissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Pending Triage</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tabular-nums">
            {(stats?.submitted || 0) + (stats?.underReview || 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requiring verification</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Accepted for R&D</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 tabular-nums">
            {stats?.accepted ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Assigned to academic labs</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Active Student Projects</span>
            <AlertTriangle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">
            {stats?.inProgress ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Prototypes in pilot testing</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Resolved in Field</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {stats?.resolved ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Deployed in tribal blocks</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card
            headerKicker="Department Queue"
            title="Incoming Problem Submissions"
            subtitle="Prioritize, verify, and route societal challenges to university incubation cells"
            headerAction={
              <Link to="/government/challenges">
                <Button variant="ghost" size="sm">
                  Manage All
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
            headerKicker="Resolution Funnel"
            title="State Pipeline Status"
            subtitle="Distribution of reported challenges by lifecycle stage"
          >
            {stats ? (
              <ChallengesStatusChart stats={stats} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading status funnel...
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
