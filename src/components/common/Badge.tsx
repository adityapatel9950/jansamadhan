import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'info' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'text-slate-700 bg-slate-100 border border-slate-200',
    success: 'text-emerald-800 bg-emerald-50 border border-emerald-200',
    warning: 'text-amber-800 bg-amber-50 border border-amber-200',
    info: 'text-sky-800 bg-sky-50 border border-sky-200',
    danger: 'text-rose-800 bg-rose-50 border border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
