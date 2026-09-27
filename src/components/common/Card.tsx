import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerKicker?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerKicker,
  headerAction,
  footer,
  children,
  className = '',
  bodyClassName = '',
}) => {
  const hasHeader = title || subtitle || headerAction || headerKicker;

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}
    >
      {hasHeader && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            {headerKicker && (
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                {headerKicker}
              </span>
            )}
            {title && (
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
};
