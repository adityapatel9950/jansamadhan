import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { challengeService } from '../../services/challengeService';
import { Challenge, UpdateChallengeInput } from '../../types/challenge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ChallengeStatusTracker } from '../../components/common/ChallengeStatusTracker';
import { ChallengeForm } from '../../components/forms/ChallengeForm';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Phone,
  Tag,
  Edit3,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const ChallengeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchChallenge = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await challengeService.getChallengeById(id);
      setChallenge(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load challenge';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-xs text-slate-500">
        Loading problem statement details...
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Link
          to="/citizen/challenges"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Challenges
        </Link>
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
          <p className="font-semibold">Unable to display challenge</p>
          <p className="mt-1">{error || 'Challenge not found.'}</p>
        </div>
      </div>
    );
  }

  const isOwner = user && (challenge.submittedBy === user.id || challenge.submittedByUserId === user.id);
  const canEdit = isOwner && (challenge.status === 'DRAFT' || challenge.status === 'SUBMITTED');

  const handleUpdate = async (values: UpdateChallengeInput) => {
    setUpdateLoading(true);
    try {
      const updated = await challengeService.updateChallenge(challenge.id, values);
      setChallenge(updated);
      setIsEditing(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update challenge');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-5">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/citizen/challenges"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Challenges Registry
        </Link>

        {canEdit && !isEditing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Before Verification</span>
          </Button>
        )}
      </div>

      {/* Editing Mode */}
      {isEditing ? (
        <Card
          headerKicker="Modification"
          title={`Edit: ${challenge.title}`}
          subtitle="You can edit details as long as the problem has not been formally verified by a Nodal Officer."
        >
          <div className="mb-4">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:underline inline-flex items-center gap-1"
            >
              Cancel editing
            </button>
          </div>
          <ChallengeForm
            initialValues={{
              title: challenge.title,
              description: challenge.description,
              category: challenge.category,
              district: challenge.district,
              block: challenge.block,
              village: challenge.village,
              address: challenge.address,
              latitude: challenge.latitude,
              longitude: challenge.longitude,
              priority: challenge.priority,
              impactedPopulationEstimate: challenge.impactedPopulationEstimate,
              contactPreference: challenge.contactPreference,
              supportingImageUrl: challenge.supportingImageUrl,
              supportingDocumentUrl: challenge.supportingDocumentUrl,
              tags: challenge.tags,
            }}
            onSubmit={handleUpdate}
            isLoading={updateLoading}
            submitButtonText="Save Changes"
            isEditing={true}
          />
        </Card>
      ) : (
        <>
          {/* Main Details Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-5 shadow-xs">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {challenge.category}
                </span>
                <StatusBadge status={challenge.status} />
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {challenge.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Submitted on {formatDate(challenge.createdAt)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  By {challenge.submittedByName || 'Citizen'} ({challenge.submittedByRole || 'CITIZEN'})
                </span>
                {challenge.contactPreference && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Contact via {challenge.contactPreference}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status Tracker */}
            <ChallengeStatusTracker
              currentStatus={challenge.status}
              createdAt={challenge.createdAt}
              updatedAt={challenge.updatedAt}
              verificationStatus={challenge.verificationStatus}
            />

            {/* Description */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Detailed Problem Description
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>

            {/* Location & Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Geographic Location</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p>
                    <strong className="text-slate-700">District:</strong> {challenge.district}
                  </p>
                  {challenge.block && (
                    <p>
                      <strong className="text-slate-700">Block / Tehsil:</strong> {challenge.block}
                    </p>
                  )}
                  {challenge.village && (
                    <p>
                      <strong className="text-slate-700">Village / Locality:</strong> {challenge.village}
                    </p>
                  )}
                  {challenge.address && (
                    <p>
                      <strong className="text-slate-700">Landmark / Address:</strong> {challenge.address}
                    </p>
                  )}
                  {challenge.latitude && challenge.longitude && (
                    <p className="font-mono text-[11px] text-slate-500 pt-1">
                      GPS: {challenge.latitude}° N, {challenge.longitude}° E
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Beneficiaries & Severity</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p>
                    <strong className="text-slate-700">People Impacted:</strong>{' '}
                    {(challenge.impactedPopulationEstimate || 0).toLocaleString()} residents
                  </p>
                  <p>
                    <strong className="text-slate-700">Severity Assessment:</strong>{' '}
                    <span className="font-semibold text-slate-800">{challenge.priority}</span>
                  </p>
                  <p>
                    <strong className="text-slate-700">Assigned Department:</strong>{' '}
                    {challenge.departmentName || 'Under Nodal Triage'}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence & Uploads */}
            {(challenge.supportingImageUrl || challenge.supportingDocumentUrl) && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Supporting Evidences & Documentation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {challenge.supportingImageUrl && (
                    <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex items-center gap-3">
                      <img
                        src={challenge.supportingImageUrl}
                        alt="Evidence"
                        className="w-14 h-14 object-cover rounded border border-slate-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          Field Photograph
                        </p>
                        <a
                          href={challenge.supportingImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-800 hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          View Full Photo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {challenge.supportingDocumentUrl && (
                    <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex items-center gap-3">
                      <FileText className="w-10 h-10 text-emerald-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          Gram Sabha / Survey Document
                        </p>
                        <a
                          href={challenge.supportingDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-800 hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          Open Attached File <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {challenge.tags && challenge.tags.length > 0 && (
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                {challenge.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
