import React from 'react';
import { Challenge } from '../../types/challenge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../utils/formatters';
import { MapPin, Eye, Edit3, Image as ImageIcon, FileText } from 'lucide-react';

export interface ChallengeTableProps {
  challenges: Challenge[];
  isLoading?: boolean;
  onView: (challenge: Challenge) => void;
  onEdit?: (challenge: Challenge) => void;
  currentUserId?: string;
  showSubmitter?: boolean;
}

export const ChallengeTable: React.FC<ChallengeTableProps> = ({
  challenges,
  isLoading = false,
  onView,
  onEdit,
  currentUserId,
  showSubmitter = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
        Loading challenges...
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
        No challenges found matching your criteria.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Title & Domain</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Status</th>
              {showSubmitter && <th className="py-2.5 px-3">Submitted By</th>}
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {challenges.map((c) => {
              const isOwner = currentUserId && (c.submittedBy === currentUserId || c.submittedByUserId === currentUserId);
              const isEditable = isOwner && (c.status === 'DRAFT' || c.status === 'SUBMITTED');

              return (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 max-w-xs">
                    <button
                      onClick={() => onView(c)}
                      className="font-semibold text-slate-900 hover:text-emerald-900 block text-left truncate max-w-xs"
                    >
                      {c.title}
                    </button>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-emerald-800">{c.category}</span>
                      {c.supportingImageUrl && (
                        <span className="text-slate-400 flex items-center" title="Has photo evidence">
                          · <ImageIcon className="w-3 h-3 ml-0.5" />
                        </span>
                      )}
                      {c.supportingDocumentUrl && (
                        <span className="text-slate-400 flex items-center" title="Has document">
                          · <FileText className="w-3 h-3 ml-0.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{c.district}</span>
                    </div>
                    {c.block && <div className="text-[11px] text-slate-400 pl-4">{c.block}</div>}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block text-[11px] font-medium px-1.5 py-0.5 rounded ${
                        c.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 font-semibold'
                          : c.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.priority}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <StatusBadge status={c.status} size="sm" />
                  </td>

                  {showSubmitter && (
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                      {c.submittedByName || 'Citizen'}
                    </td>
                  )}

                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                    {formatDate(c.createdAt)}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap text-right space-x-1.5">
                    <button
                      onClick={() => onView(c)}
                      className="p-1 text-slate-500 hover:text-emerald-900 rounded hover:bg-slate-100 transition-colors inline-flex items-center gap-1 text-[11px]"
                      title="View details & status tracker"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Track</span>
                    </button>

                    {isEditable && onEdit && (
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1 text-slate-500 hover:text-amber-800 rounded hover:bg-amber-50 transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="Edit before verification"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
