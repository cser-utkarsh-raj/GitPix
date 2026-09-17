import React, { useState } from 'react';
import { Sparkles, Facebook, Youtube, Globe, Github, Twitter, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeroSectionProps {
  onOpenContact: () => void;
  soundEnabled: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContact, soundEnabled }) => {
  const [isSlashing, setIsSlashing] = useState(false);
  const [hoveringBlade, setHoveringBlade] = useState(false);

  const handleKatanaClick = () => {
    setIsSlashing(true);
    if (soundEnabled) soundEffects.playKatanaSlash();
    setTimeout(() => setIsSlashing(false), 500);

    const genEl = document.getElementById('generator');
    if (genEl) {
      genEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-10 px-4 sm:px-8 overflow-hidden bg-[#09040b] select-none"
    >
      {/* Background Radial Glow & Red Cyber Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-[#0d0511] to-[#08030a] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-rose-900/40 via-rose-950/10 to-transparent pointer-events-none blur-3xl animate-pulse-glow" />

      {/* Main Center Stage */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex-1 flex items-center justify-center my-auto">
        {/* Massive Calligraphy Brush Backdrop Text "GITPIX PROFILE" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-80 sm:opacity-90">
          <h1 className="font-brush text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-rose-200 text-glow-white uppercase select-none text-center leading-none transform -rotate-1">
            GITPIX
          </h1>
          <h1 className="font-brush text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-600 to-red-700 text-glow-red uppercase select-none text-center leading-none transform rotate-1 -mt-2 sm:-mt-6">
            PROFILE DOJO
          </h1>
        </div>

        {/* Central Samurai Character */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full my-auto">
          <div
            onClick={handleKatanaClick}
            onMouseEnter={() => setHoveringBlade(true)}
            onMouseLeave={() => setHoveringBlade(false)}
            className="relative cursor-pointer group transform transition-transform duration-500 hover:scale-[1.02]"
          >
            {/* Samurai Hero Image */}
            <div className="relative rounded-3xl overflow-hidden border border-rose-900/40 shadow-2xl shadow-rose-950/80">
              <img
                src="/src/assets/images/futuristic_samurai_hero_1789629420289.jpg"
                alt="GitPix Futuristic Samurai GitHub Profile Generator"
                referrerPolicy="no-referrer"
                className={`w-full max-w-lg mx-auto object-cover rounded-3xl transition-all duration-300 ${
                  isSlashing ? 'brightness-125 contrast-125 scale-105 filter drop-shadow-[0_0_35px_rgba(239,68,68,0.9)]' : ''
                }`}
              />

              {/* Red LED Visor Overlay HUD: 年 $ 台 */}
              <div className="absolute top-[38%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 bg-black/80 px-2.5 py-0.5 rounded-md border border-rose-500/80 box-glow-red flex items-center justify-center gap-1">
                <span className="font-shoju text-[11px] font-bold text-rose-500 animate-pulse tracking-widest text-glow-red">
                  GitPix AI • v4.8
                </span>
              </div>

              {/* Katana Blade Glowing Slash Line Trigger */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-rose-600/30 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveringBlade || isSlashing ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Interactive Slash Effect Overlay */}
              {isSlashing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_30px_#ffffff] transform -rotate-45 animate-ping" />
                </div>
              )}
            </div>

            {/* Click prompt tooltip */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-rose-950/90 border border-rose-500/60 px-4 py-1.5 rounded-full text-[11px] font-orbitron font-semibold text-rose-200 tracking-wider uppercase shadow-lg shadow-rose-950/80 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              Click Katana to Forge GitHub README
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Matches Dribbble Screenshot exactly */}
      <div className="relative z-30 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-8">
        {/* Bottom Left Stats */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-1">
              100K+
            </span>
            <span className="font-rajdhani font-semibold text-xs text-slate-400 uppercase tracking-widest">
              Profiles Forged
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-1">
              15+
            </span>
            <span className="font-rajdhani font-semibold text-xs text-slate-400 uppercase tracking-widest">
              Samurai Themes
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-orbitron font-black text-3xl sm:text-4xl text-rose-400 tracking-tight flex items-center gap-1">
              1-Click
            </span>
            <span className="font-rajdhani font-semibold text-xs text-slate-400 uppercase tracking-widest">
              Direct GitHub Deploy
            </span>
          </div>
        </div>

        {/* Bottom Right Socials - White circular ink splatter icons */}
        <div className="flex items-center justify-start md:justify-end gap-3">
          {[
            { icon: Github, label: 'GitHub', href: 'https://github.com' },
            { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
            { icon: Globe, label: 'Website', href: '#' },
          ].map((soc, idx) => {
            const IconComponent = soc.icon;
            return (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                title={soc.label}
                className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 shadow-lg shadow-black/50"
              >
                <IconComponent className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
