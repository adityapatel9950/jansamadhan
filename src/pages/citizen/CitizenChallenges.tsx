import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChallenges } from '../../hooks/useChallenges';
import { useAuth } from '../../hooks/useAuth';
import { ChallengeTable } from '../../components/common/ChallengeTable';
import { SearchFilter } from '../../components/common/SearchFilter';
import { Pagination } from '../../components/tables/Pagination';
import { Button } from '../../components/common/Button';
import { PlusCircle } from 'lucide-react';

export const CitizenChallenges: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    challenges,
    total,
    totalPages,
    currentPage,
    filters,
    isLoading,
    updateFilters,
  } = useChallenges({ limit: 10 });

  const handleResetFilters = () => {
    updateFilters({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      category: '',
      district: '',
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Jharkhand Societal Problems Registry
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Public registry of societal challenges submitted by citizens and local representatives.
          </p>
        </div>
        <Link to="/citizen/new-challenge">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Problem</span>
          </Button>
        </Link>
      </div>

      {/* Filter Component */}
      <SearchFilter
        search={filters.search || ''}
        status={filters.status || ''}
        category={filters.category || ''}
        district={filters.district || ''}
        onSearchChange={(search) => updateFilters({ search, page: 1 })}
        onStatusChange={(status) => updateFilters({ status, page: 1 })}
        onCategoryChange={(category) => updateFilters({ category, page: 1 })}
        onDistrictChange={(district) => updateFilters({ district, page: 1 })}
        onReset={handleResetFilters}
      />

      {/* Reusable Challenge Table */}
      <ChallengeTable
        challenges={challenges}
        isLoading={isLoading}
        currentUserId={user?.id}
        showSubmitter={true}
        onView={(c) => navigate(`/citizen/challenges/${c.id}`)}
        onEdit={(c) => navigate(`/citizen/challenges/${c.id}`)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            pageSize={filters.limit || 10}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      )}
    </div>
  );
};
