import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060307] border-t border-slate-900 py-12 px-4 sm:px-8 text-slate-400 font-rajdhani text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-orbitron font-extrabold text-white text-sm tracking-wider uppercase">
            GITPIX
          </span>
          <span className="text-rose-500 font-semibold tracking-widest uppercase">
            Presented by .dot
          </span>
        </div>

        <p className="text-center text-slate-500">
          © {new Date().getFullYear()} GitPix. Futuristic Samurai AI GitHub Profile Generator. All Rights Reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white transition-all font-orbitron font-bold text-xs uppercase"
        >
          Top of Dojo <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
