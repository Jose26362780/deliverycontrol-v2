import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  badge?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, badge, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between min-h-[1.25rem]">
            <label
              htmlFor={selectId}
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {label}
            </label>
            {badge && (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700/60 leading-none shrink-0 ml-1.5">
                {badge}
              </span>
            )}
          </div>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors cursor-pointer',
            'focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/40',
            'disabled:bg-slate-950 disabled:text-slate-600 disabled:cursor-not-allowed',
            error ? 'border-rose-500' : '',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100 py-1">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
