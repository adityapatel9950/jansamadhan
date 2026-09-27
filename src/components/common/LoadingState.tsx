import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  variant?: 'inline' | 'card' | 'fullscreen';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  variant = 'card',
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-800 mb-3" />
        <p className="text-sm font-medium text-slate-700">{message}</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to JanSamadhan registry...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-800 mb-3" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
        <div className="w-1/2 h-full bg-emerald-700 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
