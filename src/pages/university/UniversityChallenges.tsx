import React, { useState } from 'react';
import { useChallenges } from '../../hooks/useChallenges';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/tables/Table';
import { Pagination } from '../../components/tables/Pagination';
import { SearchBar } from '../../components/tables/SearchBar';
import { Filter } from '../../components/tables/Filter';
import { Modal } from '../../components/common/Modal';
import { SolutionForm } from '../../components/forms/SolutionForm';
import { Challenge } from '../../types/challenge';
import {
  formatDate,
  formatStatus,
  getStatusTextClass,
  formatPriority,
  getPriorityTextClass,
  JHARKHAND_DISTRICTS,
  CHALLENGE_CATEGORIES,
} from '../../utils/formatters';
import { Lightbulb, Eye, MapPin, Building, CheckCircle2 } from 'lucide-react';

export const UniversityChallenges: React.FC = () => {
  const {
    challenges,
    total,
    totalPages,
    currentPage,
    filters,
    isLoading,
    updateFilters,
  } = useChallenges({ limit: 10 });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [solutionModalChallenge, setSolutionModalChallenge] = useState<Challenge | null>(null);
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false);
  const [solutionSuccessMessage, setSolutionSuccessMessage] = useState<string | null>(null);

  const handleProposeSolution = async (solutionData: {
    title: string;
    summary: string;
    technicalStack: string;
    estimatedBudget: number;
    estimatedDurationMonths: number;
  }) => {
    setIsSubmittingSolution(true);
    try {
      // Simulate real solution registration flow
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSolutionSuccessMessage(
        `Innovation proposal "${solutionData.title}" submitted successfully for departmental evaluation.`
      );
      setTimeout(() => {
        setSolutionSuccessMessage(null);
        setSolutionModalChallenge(null);
      }, 2000);
    } catch {
      alert('Failed to submit proposal.');
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  const columns = [
    {
      header: 'Problem Statement & District',
      key: 'title',
      render: (item: Challenge) => (
        <div className="max-w-md">
          <button
            onClick={() => setSelectedChallenge(item)}
            className="font-semibold text-slate-900 hover:text-emerald-900 text-left block"
          >
            {item.title}
          </button>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{item.category}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {item.district}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'State Department',
      key: 'departmentName',
      render: (item: Challenge) => (
        <span className="text-xs text-slate-600 block max-w-[200px] truncate">
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
      header: 'Status',
      key: 'status',
      render: (item: Challenge) => (
        <span className={`text-xs ${getStatusTextClass(item.status)}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (item: Challenge) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSolutionModalChallenge(item)}
            leftIcon={<Lightbulb className="w-3.5 h-3.5" />}
          >
            Propose Solution
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedChallenge(item)}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Open R&D Problem Statements for Jharkhand
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department-validated challenges available for student capstones, hackathon teams, and faculty labs
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchBar
            value={filters.search || ''}
            onChange={(val) => updateFilters({ search: val })}
            placeholder="Search R&D challenges by technology, district, keyword..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <Filter
              label="District"
              value={filters.district || ''}
              onChange={(val) => updateFilters({ district: val })}
              options={JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }))}
              allLabel="All 24 Districts"
            />

            <Filter
              label="Domain"
              value={filters.category || ''}
              onChange={(val) => updateFilters({ category: val })}
              options={CHALLENGE_CATEGORIES.map((c) => ({ value: c, label: c }))}
              allLabel="All Domains"
            />

            <Filter
              label="Status"
              value={filters.status || ''}
              onChange={(val) => updateFilters({ status: val })}
              options={[
                { value: 'ACCEPTED', label: 'Accepted for R&D (Open)' },
                { value: 'IN_PROGRESS', label: 'R&D In Progress' },
                { value: 'RESOLVED', label: 'Resolved' },
              ]}
              allLabel="All Statuses"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={challenges}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No open R&D challenges matching current filters."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={filters.limit || 10}
          onPageChange={(page) => updateFilters({ page })}
        />
      </Card>

      {/* Detail Modal */}
      {selectedChallenge && (
        <Modal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          title={selectedChallenge.title}
          subtitle={`Challenge ID: ${selectedChallenge.id} · Registered on ${formatDate(selectedChallenge.createdAt)}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = selectedChallenge;
                  setSelectedChallenge(null);
                  setSolutionModalChallenge(target);
                }}
                leftIcon={<Lightbulb className="w-3.5 h-3.5" />}
              >
                Propose Solution to this Problem
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedChallenge(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">District</span>
                <span className="font-semibold text-slate-900">{selectedChallenge.district}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Priority</span>
                <span className={getPriorityTextClass(selectedChallenge.priority)}>
                  {formatPriority(selectedChallenge.priority)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Target Impact</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {selectedChallenge.impactedPopulationEstimate?.toLocaleString()} citizens
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                <span className={getStatusTextClass(selectedChallenge.status)}>
                  {formatStatus(selectedChallenge.status)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                Full Problem Statement
              </h4>
              <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line bg-white p-3 border border-slate-100 rounded">
                {selectedChallenge.description}
              </p>
            </div>

            {selectedChallenge.tags && selectedChallenge.tags.length > 0 && (
              <div>
                <span className="font-semibold text-slate-900 text-xs block mb-1.5">
                  Technical Tags & Hardware Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Propose Solution Modal */}
      {solutionModalChallenge && (
        <Modal
          isOpen={!!solutionModalChallenge}
          onClose={() => setSolutionModalChallenge(null)}
          title="Submit Academic / Student Innovation Proposal"
          subtitle="Propose a working prototype, hardware architecture, or capstone solution"
          maxWidth="2xl"
        >
          {solutionSuccessMessage ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-slate-900 text-sm">{solutionSuccessMessage}</p>
              <p className="text-xs text-slate-500">
                Department nodal officer and technical committee will review your submission.
              </p>
            </div>
          ) : (
            <SolutionForm
              challengeTitle={solutionModalChallenge.title}
              onSubmit={handleProposeSolution}
              isLoading={isSubmittingSolution}
            />
          )}
        </Modal>
      )}
    </div>
  );
};
