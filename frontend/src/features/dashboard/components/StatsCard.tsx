import React from 'react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'lime' | 'violet' | 'sky' | 'amber' | 'rose' | 'slate';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'slate',
}) => {
  const iconColors = {
    lime: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
    violet: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    sky: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    slate: 'text-slate-300 bg-slate-800 border-slate-700/60',
  };

  const textColors = {
    lime: 'text-lime-400',
    violet: 'text-violet-300',
    sky: 'text-sky-300',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    slate: 'text-white',
  };

  return (
    <Card className="hover:border-slate-700/80 transition-all p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {title}
          </span>
          <div className={cn('text-2xl sm:text-3xl font-black tracking-tight', textColors[variant])}>
            {value}
          </div>
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
            iconColors[variant]
          )}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-lime-400">{trend}</span>}
        </div>
      )}
    </Card>
  );
};
