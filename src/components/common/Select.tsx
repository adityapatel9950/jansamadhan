import React from 'react';
import { SelectOption } from '../../types/common';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  placeholder,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        disabled={disabled}
        className={`block w-full rounded-md border text-sm text-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 disabled:bg-slate-100 disabled:text-slate-500 px-3 py-2 ${
          error
            ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
            : 'border-slate-300 hover:border-slate-400'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
