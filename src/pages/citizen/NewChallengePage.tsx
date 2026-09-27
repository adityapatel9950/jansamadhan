import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { challengeService } from '../../services/challengeService';
import { Card } from '../../components/common/Card';
import { ChallengeForm } from '../../components/forms/ChallengeForm';
import { CreateChallengeInput } from '../../types/challenge';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successChallengeId, setSuccessChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: CreateChallengeInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await challengeService.createChallenge(values);
      setSuccessChallengeId(created.id);
      setTimeout(() => {
        navigate(`/citizen/challenges/${created.id}`);
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register challenge';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link
          to="/citizen/challenges"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Challenges Registry
        </Link>
      </div>

      <Card
        headerKicker="Phase 3 Citizen Submission"
        title="Submit a Societal Grievance or Challenge"
        subtitle="Provide concrete details about the localized problem in your village, block, or ward. All submissions undergo nodal officer verification and are formulated into technical hackathon problem statements."
      >
        {successChallengeId && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Challenge Registered Successfully!</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Reference ID: <span className="font-mono font-bold">{successChallengeId}</span>. Redirecting to live status tracker...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-semibold">Submission Error</p>
              <p className="text-[11px] text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <ChallengeForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Register Challenge on JanSamadhan"
        />
      </Card>
    </div>
  );
};
