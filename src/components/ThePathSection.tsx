import React from 'react';
import { Compass, ShieldCheck, Flame, Code } from 'lucide-react';

export const ThePathSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Honor in Open Source',
      desc: 'Craft clean, readable code and document every repository with precision, empathy, and absolute architectural clarity.',
    },
    {
      num: '02',
      title: 'Lethal Execution',
      desc: 'Ship high-impact features with rapid velocity. Let your commit history reflect relentless discipline and technical mastery.',
    },
    {
      num: '03',
      title: 'Unrivaled Identity',
      desc: 'Stand out from millions of developers. GitPix elevates your personal developer brand with unforgettable visual impact.',
    },
  ];

  return (
    <section id="code" className="relative py-24 px-4 sm:px-8 bg-[#09040b] text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-rose-500 font-orbitron font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-rose-500" /> The Samurai Creed
          </span>
          <h2 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            The Code of the Open Source Warrior
          </h2>
          <p className="font-rajdhani text-slate-400 text-sm sm:text-base">
            Guided by ancient discipline and cutting-edge cybernetics, GitPix transforms your GitHub profile into a warrior's banner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition-all"
            >
              <span className="font-orbitron font-black text-6xl text-rose-950/80 group-hover:text-rose-900/60 transition-colors absolute top-4 right-4 pointer-events-none">
                {step.num}
              </span>
              <div className="space-y-4 relative z-10">
                <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-rose-400 transition-colors">
                  {step.title}
                </h3>
                <p className="font-rajdhani text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
