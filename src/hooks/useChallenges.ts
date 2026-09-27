import { useState, useEffect, useCallback } from 'react';
import { Challenge, ChallengeFilterState } from '../types/challenge';
import { challengeService } from '../services/challengeService';

export const useChallenges = (initialFilters: ChallengeFilterState = {}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChallengeFilterState>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await challengeService.getChallenges(filters);
      setChallenges(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load challenges';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const updateFilters = (newFilters: Partial<ChallengeFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset page on filter changes unless page explicitly given
    }));
  };

  const refresh = () => {
    loadChallenges();
  };

  return {
    challenges,
    total,
    totalPages,
    currentPage: filters.page || 1,
    filters,
    isLoading,
    error,
    updateFilters,
    refresh,
  };
};
