import React, { useRef } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  showShortcuts?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label = 'Fecha',
  value,
  onChange,
  error,
  helperText,
  showShortcuts = true,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const getRelativeDateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();
  const yesterdayStr = getRelativeDateStr(1);
  const twoDaysAgoStr = getRelativeDateStr(2);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Seleccionar fecha';
    try {
      const [y, m, d] = dateString.split('-');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const isToday = value === todayStr;
  const isYesterday = value === yesterdayStr;

  const handleBoxClick = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between min-h-5 gap-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
          </label>
          {showShortcuts && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onChange(todayStr)}
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors leading-none',
                  isToday
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400/40 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                )}
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => onChange(yesterdayStr)}
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-medium rounded transition-colors leading-none',
                  isYesterday
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400/40 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                )}
              >
                Ayer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Picker Trigger */}
      <div
        onClick={handleBoxClick}
        className={cn(
          'relative flex items-center w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 transition-all cursor-pointer group hover:border-slate-600 h-10.5',
          'focus-within:border-lime-400 focus-within:ring-1 focus-within:ring-lime-400/40',
          error ? 'border-rose-500' : ''
        )}
      >
        <div className="text-lime-400 group-hover:text-lime-300 mr-2.5 flex items-center justify-center shrink-0">
          <CalendarIcon className="w-4 h-4" />
        </div>

        <span className="flex-1 font-medium capitalize text-slate-200 text-sm truncate">
          {formatDisplayDate(value)}
        </span>

        {/* Hidden styled native input overlay with showPicker accessibility */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scheme-dark"
        />

        <span className="text-[11px] text-slate-500 font-mono tracking-tight shrink-0 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
          {value || 'AAAA-MM-DD'}
        </span>
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
