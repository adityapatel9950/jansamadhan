import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { challengeService } from '../../services/challengeService';
import { Challenge, ChallengeFilterState } from '../../types/challenge';
import { ChallengeTable } from '../../components/common/ChallengeTable';
import { SearchFilter } from '../../components/common/SearchFilter';
import { Pagination } from '../../components/tables/Pagination';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PlusCircle, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const MyChallengesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<ChallengeFilterState>({
    page: 1,
    limit: 8,
    search: '',
    status: '',
    category: '',
    district: '',
  });

  const loadMyChallenges = async () => {
    setIsLoading(true);
    try {
      const res = await challengeService.getMyChallenges(filters);
      setChallenges(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.warn('Could not load my challenges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyChallenges();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 8,
      search: '',
      status: '',
      category: '',
      district: '',
    });
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-2">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">My Registered Grievances & Challenges</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Track status progression, departmental verification, and academic team assignments for your submissions.
          </p>
        </div>
        <Link to="/citizen/new-challenge">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Grievance</span>
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        search={filters.search || ''}
        status={filters.status || ''}
        category={filters.category || ''}
        district={filters.district || ''}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
        onStatusChange={(status) => setFilters((prev) => ({ ...prev, status, page: 1 }))}
        onCategoryChange={(category) => setFilters((prev) => ({ ...prev, category, page: 1 }))}
        onDistrictChange={(district) => setFilters((prev) => ({ ...prev, district, page: 1 }))}
        onReset={handleResetFilters}
      />

      {/* Challenge Table */}
      <ChallengeTable
        challenges={challenges}
        isLoading={isLoading}
        currentUserId={user?.id}
        onView={(c) => navigate(`/citizen/challenges/${c.id}`)}
        onEdit={(c) => navigate(`/citizen/challenges/${c.id}`)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            totalItems={total}
            pageSize={filters.limit || 8}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </div>
      )}
    </div>
  );
};
