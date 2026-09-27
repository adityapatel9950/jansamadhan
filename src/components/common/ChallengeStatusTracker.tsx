import React from 'react';
import { ChallengeStatus } from '../../types/challenge';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

export interface ChallengeStatusTrackerProps {
  currentStatus: ChallengeStatus;
  createdAt: string;
  updatedAt?: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

const ORDERED_STEPS: { status: ChallengeStatus; label: string; description: string }[] = [
  {
    status: 'SUBMITTED',
    label: 'Submitted',
    description: 'Received by JanSamadhan portal.',
  },
  {
    status: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Triage by state nodal officer.',
  },
  {
    status: 'VERIFIED',
    label: 'Verified',
    description: 'Grievance confirmed valid & actionable.',
  },
  {
    status: 'ASSIGNED',
    label: 'Assigned',
    description: 'Routed to University / Student R&D team.',
  },
  {
    status: 'IN_PROGRESS',
    label: 'R&D In Progress',
    description: 'Technological prototype development.',
  },
  {
    status: 'PILOT',
    label: 'Field Pilot',
    description: 'On-site trial at Panchayat / Habitation.',
  },
  {
    status: 'RESOLVED',
    label: 'Resolved',
    description: 'Solution deployed and closed.',
  },
];

export const ChallengeStatusTracker: React.FC<ChallengeStatusTrackerProps> = ({
  currentStatus,
  createdAt,
  updatedAt,
  verificationStatus,
}) => {
  const isRejected = currentStatus === 'REJECTED' || verificationStatus === 'REJECTED';

  // Find index in progressive pipeline
  let currentIndex = ORDERED_STEPS.findIndex((s) => s.status === currentStatus);
  if (currentStatus === 'ACCEPTED') currentIndex = 2; // maps to VERIFIED
  if (currentStatus === 'CLOSED') currentIndex = 6; // maps to RESOLVED

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Resolution Lifecycle
        </span>
        <span className="text-[11px] text-slate-500">
          Last updated: {formatDate(updatedAt || createdAt)}
        </span>
      </div>

      {isRejected ? (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-center gap-2.5 text-rose-800 text-xs">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-semibold">Problem Rejected / Flagged Out of Scope</p>
            <p className="text-[11px] text-rose-700 mt-0.5">
              The nodal officer determined this problem cannot be pursued as an academic innovation challenge under SIH 2026.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress track */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-start justify-between min-w-[580px] relative">
              {ORDERED_STEPS.map((step, idx) => {
                const isPassed = currentIndex > idx;
                const isCurrent = currentIndex === idx;
                const isFuture = currentIndex < idx;

                return (
                  <div key={step.status} className="flex-1 flex flex-col items-center text-center relative px-1">
                    {/* Connecting line */}
                    {idx < ORDERED_STEPS.length - 1 && (
                      <div
                        className={`absolute top-3.5 left-1/2 w-full h-0.5 z-0 ${
                          isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-600 animate-pulse'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Label & Description */}
                    <div className="mt-1.5 space-y-0.5">
                      <p
                        className={`text-xs font-medium ${
                          isCurrent
                            ? 'text-emerald-950 font-bold'
                            : isPassed
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-slate-500 max-w-[85px] leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
