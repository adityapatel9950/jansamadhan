import React from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  description,
  children,
  id,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-800 uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-600 font-bold">*</span>}
        </label>
      </div>
      {children}
      {description && !error && (
        <p className="text-xs text-slate-500 leading-normal">{description}</p>
      )}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
};
