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
import { GraduationCap, Lightbulb, Users, ArrowRight, Award } from 'lucide-react';

export const UniversityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChallengeStats | null>(null);

  // Challenges accepted for academic R&D
  const { challenges, isLoading } = useChallenges({ status: 'ACCEPTED', limit: 5 });

  useEffect(() => {
    challengeService
      .getDashboardStats()
      .then((res) => setStats(res))
      .catch((err) => console.warn('[UniversityDashboard] Error loading stats:', err));
  }, []);

  const columns = [
    {
      header: 'R&D Problem Statement',
      key: 'title',
      render: (item: Challenge) => (
        <div className="max-w-md">
          <Link
            to="/university/challenges"
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
      header: 'Department Need',
      key: 'departmentName',
      render: (item: Challenge) => (
        <span className="text-xs text-slate-600 block max-w-[180px] truncate">
          {item.departmentName || 'State Department'}
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
      header: 'Target Impact',
      key: 'impactedPopulationEstimate',
      align: 'right' as const,
      render: (item: Challenge) => (
        <span className="text-xs text-slate-600 tabular-nums">
          {item.impactedPopulationEstimate?.toLocaleString()} citizens
        </span>
      ),
    },
    {
      header: 'Posted Date',
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
      {/* University Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Academic R&D & SIH 2026 Student Innovation Cell
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">
            {user?.organizationOrDepartment || 'University Incubation Centre'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.role}) · {user?.designation || 'Academic Researcher'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/university/challenges">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Open R&D Problems
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Verified State Needs</span>
            <Lightbulb className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {stats?.accepted ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for student prototypes</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Active Student Capstones</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 tabular-nums">
            {stats?.inProgress ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Teams actively prototyping</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Participating Institutes</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tabular-nums">
            18
          </div>
          <div className="text-[11px] text-slate-500 mt-1">BIT, IIT ISM, NIT, Polytechnics</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Field Validated</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {stats?.resolved ?? '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Transitioned to department pilots</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card
            headerKicker="Academic Opportunities"
            title="Societal Needs Accepted for University R&D"
            subtitle="Verified problems from state departments looking for student & faculty innovation"
            headerAction={
              <Link to="/university/challenges">
                <Button variant="ghost" size="sm">
                  Browse All
                </Button>
              </Link>
            }
          >
            <Table
              columns={columns}
              data={challenges}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              emptyMessage="No pending R&D challenges currently in this filter."
            />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card
            headerKicker="Research Clusters"
            title="Focus Areas in Jharkhand"
            subtitle="Academic problem distribution by sector"
          >
            {stats?.byCategory ? (
              <ChallengesByCategoryChart data={stats.byCategory} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading research domain data...
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
