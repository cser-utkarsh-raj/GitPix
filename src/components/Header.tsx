import React from 'react';
import { Terminal, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenContact: () => void;
  onOpenTerminal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenContact,
  onOpenTerminal,
  soundEnabled,
  setSoundEnabled,
}) => {
  const navItems = [
    { id: 'hero', label: 'Dojo' },
    { id: 'generator', label: 'AI Forge' },
    { id: 'templates', label: 'Templates' },
    { id: 'preview', label: 'Live Preview' },
    { id: 'code', label: 'Samurai Creed' },
  ];

  const handleNavClick = (id: string) => {
    if (soundEnabled) soundEffects.playCyberClick();
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 transition-all bg-gradient-to-b from-[#0a050c]/90 via-[#0a050c]/60 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo matching Dribbble Shot */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          {/* Samurai Helmet Red Emblem */}
          <div className="relative w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center p-0.5 shadow-lg shadow-rose-600/50 group-hover:scale-105 transition-transform border border-rose-400">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-white drop-shadow-md"
              aria-hidden="true"
            >
              {/* Helmet horns & mask silhouette */}
              <path d="M50 15 C35 15, 25 28, 20 40 C32 38, 42 42, 50 48 C58 42, 68 38, 80 40 C75 28, 65 15, 50 15 Z" />
              <path d="M22 45 C32 45, 40 52, 50 58 C60 52, 68 45, 78 45 C82 62, 75 78, 50 82 C25 78, 18 62, 22 45 Z" />
              {/* Katana cross blade line */}
              <line x1="10" y1="52" x2="90" y2="52" stroke="#000" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-orbitron font-extrabold text-sm tracking-wider text-white uppercase group-hover:text-rose-400 transition-colors">
              GITPIX
            </span>
            <span className="text-[9px] font-rajdhani font-semibold text-rose-400 tracking-widest uppercase">
              Presented by .dot
            </span>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-rajdhani font-semibold text-sm tracking-wider uppercase text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-1 transition-colors hover:text-white ${
                activeTab === item.id ? 'text-white font-bold' : 'text-slate-400'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-lg shadow-rose-500/80 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Tools & CTA */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) soundEffects.playKatanaSlash();
            }}
            title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber SFX'}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Cyber Terminal */}
          <button
            onClick={onOpenTerminal}
            title="Open Cybernetic Terminal HUD"
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors hidden sm:block"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Beveled Sci-Fi FORGE PROFILE button */}
          <button
            onClick={() => {
              if (soundEnabled) soundEffects.playKatanaSlash();
              handleNavClick('generator');
            }}
            className="clip-sci-fi-button relative px-6 py-2.5 bg-gradient-to-r from-rose-900/90 via-slate-900 to-slate-950 border border-rose-500/60 hover:border-rose-400 text-white font-orbitron font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-rose-600/30 active:scale-95 group"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> FORGE PROFILE
            </span>
            <div className="absolute inset-0 bg-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </header>
  );
};
