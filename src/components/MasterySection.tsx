import React from 'react';
import { Sword, Zap, ShieldAlert, Cpu, BarChart3, Radio, ArrowUpRight, Sparkles } from 'lucide-react';

interface MasterySectionProps {
  onOpenContact?: () => void;
}

export const MasterySection: React.FC<MasterySectionProps> = () => {
  const capabilities = [
    {
      icon: Sword,
      title: 'Neural README Composer',
      desc: 'Gemini 3.8 Flash synthesizes personalized markdown tailored to your dev role, aesthetic vibe, and tech stack.',
      stat: '100%',
      statLabel: 'Bespoke Markdown',
    },
    {
      icon: Cpu,
      title: 'Dynamic Shields & Badges',
      desc: 'Inject color-matched tech badges, status pills, and interactive SVG typing headers automatically.',
      stat: '500+',
      statLabel: 'Badges Available',
    },
    {
      icon: BarChart3,
      title: 'Real-time Stats Widgets',
      desc: 'Live commit streak, top language breakdown, and contribution cards aligned to cyber themes.',
      stat: 'Live',
      statLabel: 'GitHub Sync',
    },
    {
      icon: ShieldAlert,
      title: 'Direct Repository Deployment',
      desc: 'Connect your PAT to commit README directly to your username/username special GitHub repository.',
      stat: '1-Click',
      statLabel: 'Direct Push',
    },
  ];

  const handleScrollToGen = () => {
    const el = document.getElementById('generator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="path" className="relative py-24 px-4 sm:px-8 bg-[#0c0610] text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rose-900/40 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-500 font-orbitron font-bold text-xs uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4 text-rose-500" /> GitPix Profile Arsenal
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              Lethal Developer Presentation
            </h2>
          </div>
          <p className="text-slate-400 font-rajdhani text-sm sm:text-base max-w-md">
            Transform your GitHub profile from a generic code page into an unforgettable digital showcase that wins star repos, sponsors, and recruiter eyes.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-950/80 border border-slate-800/80 hover:border-rose-500/60 p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-rajdhani text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-orbitron font-black text-2xl text-rose-400">{item.stat}</span>
                    <span className="block font-rajdhani text-[11px] text-slate-500 uppercase tracking-wider">
                      {item.statLabel}
                    </span>
                  </div>
                  <button
                    onClick={handleScrollToGen}
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
