import React from 'react';
import { Shield } from 'lucide-react';

export const Rodape: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer
      className={`border-t border-slate-800/80 bg-[#0B1120]/60 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-auto print:hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-4 text-slate-400">
          <span>© {new Date().getFullYear()} Delivery Control . Todos os Direitos Reservados.</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-slate-400 font-medium">
            Desenvolvido por{" "}
            <a
              href="https://my-portfolio-jose-martinez.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-400 hover:text-lime-300 transition-colors"
            >
              José Martinez
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export const Footer = Rodape;
export default Rodape;
