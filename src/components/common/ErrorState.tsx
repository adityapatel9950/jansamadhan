import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load information',
  message = 'An error occurred while communicating with the service.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <div className="p-2 bg-rose-100 text-rose-700 rounded-lg mb-2">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
