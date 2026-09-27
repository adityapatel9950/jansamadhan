import React, { useState } from 'react';
import { useChallenges } from '../../hooks/useChallenges';
import { challengeService } from '../../services/challengeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/tables/Table';
import { Pagination } from '../../components/tables/Pagination';
import { SearchBar } from '../../components/tables/SearchBar';
import { Filter } from '../../components/tables/Filter';
import { Modal } from '../../components/common/Modal';
import { Challenge, ChallengeStatus } from '../../types/challenge';
import {
  formatDate,
  formatStatus,
  getStatusTextClass,
  formatPriority,
  getPriorityTextClass,
  JHARKHAND_DISTRICTS,
  CHALLENGE_CATEGORIES,
} from '../../utils/formatters';
import { Check, ShieldCheck, MapPin, Building, Eye, Clock } from 'lucide-react';

export const GovernmentChallenges: React.FC = () => {
  const {
    challenges,
    total,
    totalPages,
    currentPage,
    filters,
    isLoading,
    updateFilters,
    refresh,
  } = useChallenges({ limit: 10 });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: ChallengeStatus) => {
    setUpdatingId(id);
    try {
      await challengeService.updateChallengeStatus(id, newStatus);
      setFeedbackMessage(`Status updated to "${formatStatus(newStatus)}".`);
      refresh();
      if (selectedChallenge && selectedChallenge.id === id) {
        setSelectedChallenge({ ...selectedChallenge, status: newStatus });
      }
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      alert(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      header: 'Problem Title',
      key: 'title',
      render: (item: Challenge) => (
        <div className="max-w-xs md:max-w-md">
          <button
            onClick={() => setSelectedChallenge(item)}
            className="font-semibold text-slate-900 hover:text-emerald-900 text-left block"
          >
            {item.title}
          </button>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{item.category}</span>
            <span>·</span>
            <span>{item.district}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Submitting Entity',
      key: 'submittedByName',
      render: (item: Challenge) => (
        <div className="text-xs text-slate-700">
          <div className="font-medium text-slate-900">{item.submittedByName}</div>
          <div className="text-[11px] text-slate-500">{item.submittedByRole}</div>
        </div>
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
      header: 'Current Status',
      key: 'status',
      render: (item: Challenge) => (
        <span className={`text-xs ${getStatusTextClass(item.status)}`}>
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      header: 'Triage & Routing',
      key: 'action',
      render: (item: Challenge) => (
        <div className="flex items-center gap-1.5">
          {item.status === 'SUBMITTED' && (
            <Button
              variant="outline"
              size="sm"
              isLoading={updatingId === item.id}
              onClick={() => handleStatusChange(item.id, 'UNDER_REVIEW')}
            >
              Verify
            </Button>
          )}

          {(item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW') && (
            <Button
              variant="primary"
              size="sm"
              isLoading={updatingId === item.id}
              onClick={() => handleStatusChange(item.id, 'ACCEPTED')}
            >
              Accept for R&D
            </Button>
          )}

          {item.status === 'ACCEPTED' && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={updatingId === item.id}
              onClick={() => handleStatusChange(item.id, 'IN_PROGRESS')}
            >
              Mark In Progress
            </Button>
          )}

          {item.status === 'IN_PROGRESS' && (
            <Button
              variant="primary"
              size="sm"
              isLoading={updatingId === item.id}
              onClick={() => handleStatusChange(item.id, 'RESOLVED')}
            >
              Mark Resolved
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChallenge(item)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Review
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
            Department Triage & Challenge Routing Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming citizen problems, verify ground veracity, and route accepted challenges to university researchers
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SearchBar
            value={filters.search || ''}
            onChange={(val) => updateFilters({ search: val })}
            placeholder="Search problems by keyword, district, submitter..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <Filter
              label="District"
              value={filters.district || ''}
              onChange={(val) => updateFilters({ district: val })}
              options={JHARKHAND_DISTRICTS.map((d) => ({ value: d, label: d }))}
              allLabel="All Districts"
            />

            <Filter
              label="Domain"
              value={filters.category || ''}
              onChange={(val) => updateFilters({ category: val })}
              options={CHALLENGE_CATEGORIES.map((c) => ({ value: c, label: c }))}
              allLabel="All Categories"
            />

            <Filter
              label="Status"
              value={filters.status || ''}
              onChange={(val) => updateFilters({ status: val })}
              options={[
                { value: 'SUBMITTED', label: 'Submitted (New)' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'ACCEPTED', label: 'Accepted for R&D' },
                { value: 'IN_PROGRESS', label: 'R&D In Progress' },
                { value: 'RESOLVED', label: 'Resolved & Deployed' },
                { value: 'REJECTED', label: 'Rejected' },
              ]}
              allLabel="All Statuses"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          data={challenges}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage="No departmental challenges found matching this view."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={filters.limit || 10}
          onPageChange={(page) => updateFilters({ page })}
        />
      </Card>

      {/* Detail & Action Modal */}
      {selectedChallenge && (
        <Modal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          title={selectedChallenge.title}
          subtitle={`Challenge ID: ${selectedChallenge.id} · Registered ${formatDate(selectedChallenge.createdAt)}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Update Status:</span>
                <select
                  value={selectedChallenge.status}
                  onChange={(e) =>
                    handleStatusChange(selectedChallenge.id, e.target.value as ChallengeStatus)
                  }
                  className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-medium"
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ACCEPTED">Accepted for R&D</option>
                  <option value="IN_PROGRESS">R&D In Progress</option>
                  <option value="RESOLVED">Resolved & Deployed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedChallenge(null)}>
                Done
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
                <span className="text-[10px] text-slate-400 block uppercase">Estimated Impact</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {selectedChallenge.impactedPopulationEstimate?.toLocaleString() || '—'} citizens
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Reported By</span>
                <span className="font-semibold text-slate-900">{selectedChallenge.submittedByName}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                Problem Narrative & Ground Context
              </h4>
              <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line bg-white p-3 border border-slate-100 rounded">
                {selectedChallenge.description}
              </p>
            </div>

            {selectedChallenge.locationDetails && (
              <div>
                <span className="font-semibold text-slate-900 text-xs block mb-1">
                  Location Details:
                </span>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedChallenge.locationDetails}
                </p>
              </div>
            )}

            {selectedChallenge.departmentName && (
              <div>
                <span className="font-semibold text-slate-900 text-xs block mb-1">
                  Designated Department:
                </span>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {selectedChallenge.departmentName}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
