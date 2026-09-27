import React from 'react';
import { Challenge } from '../../types/challenge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../utils/formatters';
import { MapPin, Users, Calendar, ArrowRight, Image as ImageIcon, FileText } from 'lucide-react';

export interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onClick,
  onEdit,
  canEdit = false,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 hover:border-emerald-600/60 rounded-lg p-4 transition-all duration-150 shadow-xs hover:shadow-sm cursor-pointer space-y-3 flex flex-col justify-between"
    >
      <div className="space-y-2">
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {challenge.category}
          </span>
          <StatusBadge status={challenge.status} size="sm" />
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-900">
          {challenge.title}
        </h4>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        {/* Location & Beneficiaries Meta */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {challenge.district}
              {challenge.block ? `, ${challenge.block}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{(challenge.impactedPopulationEstimate || 0).toLocaleString()} affected</span>
          </div>
        </div>

        {/* Footer: Date & Evidence badges */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formatDate(challenge.createdAt)}
            </span>
            {challenge.supportingImageUrl && (
              <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded text-[10px]">
                <ImageIcon className="w-3 h-3" /> Photo
              </span>
            )}
            {challenge.supportingDocumentUrl && (
              <span className="flex items-center gap-0.5 text-sky-700 bg-sky-50 px-1 py-0.2 rounded text-[10px]">
                <FileText className="w-3 h-3" /> PDF
              </span>
            )}
          </div>

          {canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-950 underline"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
