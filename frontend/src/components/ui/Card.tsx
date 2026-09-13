import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-900/80 border border-slate-800 text-slate-100 shadow-sm',
    elevated: 'bg-slate-900 border border-slate-700/60 text-slate-100 shadow-xl shadow-slate-950/40',
    glass: 'bg-slate-900/50 backdrop-blur-md border border-slate-800/80 text-slate-100',
    highlight: 'bg-slate-900/90 border border-lime-400/30 text-slate-100 shadow-md shadow-lime-400/5',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 md:p-6 transition-all',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
