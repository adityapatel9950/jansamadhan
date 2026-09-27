import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { challengeService } from '../../services/challengeService';
import { Challenge, ChallengeStats } from '../../types/challenge';
import { ChallengeCard } from '../../components/common/ChallengeCard';
import { ChallengeTable } from '../../components/common/ChallengeTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ChallengesByCategoryChart } from '../../components/charts/ChallengesByCategoryChart';
import { PlusCircle, FileText, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [myRecentChallenges, setMyRecentChallenges] = useState<Challenge[]>([]);
  const [allRecentChallenges, setAllRecentChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      challengeService.getDashboardStats().catch(() => null),
      challengeService.getMyChallenges({ limit: 4 }).catch(() => ({ items: [] })),
      challengeService.getChallenges({ limit: 4 }).catch(() => ({ items: [] })),
    ])
      .then(([statsRes, myRes, allRes]) => {
        if (statsRes) setStats(statsRes);
        setMyRecentChallenges(myRes.items);
        setAllRecentChallenges(allRes.items);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Citizen Grievance & Innovation Portal
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Welcome back, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Report grassroot challenges in Jharkhand to directly connect your community problem with
            engineering universities, polytechnics, and CSR innovation teams under Smart India Hackathon.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/citizen/new-challenge">
            <Button variant="primary" size="md" className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Problem</span>
            </Button>
          </Link>
          <Link to="/citizen/my-challenges">
            <Button variant="secondary" size="md">
              <span>My Submissions</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">State Challenges</p>
            <p className="text-xl font-bold text-slate-900">{stats?.total ?? 5}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Under Review</p>
            <p className="text-xl font-bold text-slate-900">{stats?.underReview ?? 2}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Verified / In R&D</p>
            <p className="text-xl font-bold text-slate-900">
              {(stats?.accepted || 0) + (stats?.inProgress || 0) || 3}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">My Problems</p>
            <p className="text-xl font-bold text-slate-900">{myRecentChallenges.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Challenges & Domain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My Challenges Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">My Submissions & Live Tracking</h3>
            <Link
              to="/citizen/my-challenges"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>View All My Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-500">
              Loading your submissions...
            </div>
          ) : myRecentChallenges.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-700">No submissions from your account yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Submit a problem statement regarding drinking water, agriculture, energy, or roads in your area.
              </p>
              <div className="pt-2">
                <Link to="/citizen/new-challenge">
                  <Button variant="primary" size="sm">
                    Submit First Grievance
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {myRecentChallenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  onClick={() => navigate(`/citizen/challenges/${c.id}`)}
                  onEdit={() => navigate(`/citizen/challenges/${c.id}`)}
                  canEdit={c.status === 'DRAFT' || c.status === 'SUBMITTED'}
                />
              ))}
            </div>
          )}

          {/* Across Jharkhand Section */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Community Problems across Jharkhand</h3>
              <Link
                to="/citizen/challenges"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <span>Browse Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <ChallengeTable
              challenges={allRecentChallenges}
              isLoading={isLoading}
              onView={(c) => navigate(`/citizen/challenges/${c.id}`)}
              showSubmitter={true}
            />
          </div>
        </div>

        {/* Charts & Guidelines Column (1 col) */}
        <div className="space-y-4">
          <Card
            headerKicker="Analytics"
            title="Problems by Category"
            subtitle="Distribution of reported grassroot challenges across 24 districts"
          >
            <div className="h-56">
              <ChallengesByCategoryChart data={stats?.byCategory || {}} />
            </div>
          </Card>

          <div className="bg-emerald-900 text-white rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              SIH 2026 Student Collaboration
            </h4>
            <p className="text-xs text-emerald-50 leading-relaxed">
              When you submit a verified problem, engineering students and faculty from BIT Mesra,
              IIT ISM Dhanbad, and NIT Jamshedpur formulate technological solution proposals funded by
              CSR partners.
            </p>
            <div className="pt-1">
              <Link
                to="/citizen/new-challenge"
                className="text-xs font-semibold text-emerald-300 hover:text-white underline"
              >
                Report a localized issue now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
