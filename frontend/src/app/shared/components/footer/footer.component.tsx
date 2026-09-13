import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer
      className={`border-t border-slate-800/80 bg-[#0B1120]/60 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-auto print:hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">Sistema Online & Seguro</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline">Conexão Criptografada SSL</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-lime-400" />
            <span>v2.4.0</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>© {new Date().getFullYear()} Plataforma Corporativa</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
