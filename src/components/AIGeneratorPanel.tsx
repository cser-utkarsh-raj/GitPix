import React, { useState } from 'react';
import { Bot, Wand2, Loader2, Sparkles, Code2, Terminal } from 'lucide-react';

interface AIGeneratorPanelProps {
  userInfo: any;
  onGenerate: (markdown: string) => void;
}

export const AIGeneratorPanel: React.FC<AIGeneratorPanelProps> = ({ userInfo, onGenerate }) => {
  const [role, setRole] = useState('Full Stack & AI Engineer');
  const [vibe, setVibe] = useState('Cyberpunk Matrix');
  const [skills, setSkills] = useState(
    userInfo?.topLanguages?.length > 0
      ? userInfo.topLanguages.join(', ')
      : 'TypeScript, React, Node.js, Python, Docker, PostgreSQL'
  );
  const [currentWork, setCurrentWork] = useState('building high-performance AI tools & web apps');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateFullReadme = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-full-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userInfo?.username || 'developer',
          displayName: userInfo?.name || userInfo?.username || 'Developer',
          role,
          vibe,
          keySkills: skills.split(',').map((s) => s.trim()),
          currentWork,
          userContext: customPrompt,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'AI README generation failed');
      }

      const data = await res.json();
      if (data.markdown) {
        onGenerate(data.markdown);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating README via Gemini AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-slate-100 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-purple-600/10 border border-purple-500/30 rounded-xl text-purple-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            2. AI Profile Builder (Powered by Gemini 3.8 Flash)
          </h2>
          <p className="text-xs text-slate-400">
            AI will compose a custom, non-generic README file crafted specifically for your profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium">Developer Role / Title</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Frontend Architect, AI Engineer"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Aesthetic Theme & Vibe</label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-purple-500 font-medium"
          >
            <option value="Cyberpunk Matrix">⚡ Cyberpunk Matrix (Neon, Edgy & Animated)</option>
            <option value="Senior Architect">💼 Senior Architect (Professional & Minimalist)</option>
            <option value="Tokyo Night">🌸 Tokyo Night Synthwave (Vibrant & Stylish)</option>
            <option value="Minimalist Genius">✨ Minimalist Genius (Clean & Direct)</option>
            <option value="Open Source Hacker">🌍 Open Source Hacker (Community Focus)</option>
          </select>
        </div>
      </div>

      <div className="text-xs space-y-3">
        <div>
          <label className="block text-slate-400 mb-1 font-medium">Core Tech Stack & Badges</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="TypeScript, React, Python, Docker, PostgreSQL, AWS"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">🔭 Currently Building / Working On</label>
          <input
            type="text"
            value={currentWork}
            onChange={(e) => setCurrentWork(e.target.value)}
            placeholder="e.g. distributed microservices & open source web engines"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Custom AI Prompt & Details (Optional)</label>
          <textarea
            rows={2}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add any specific goals, quotes, hobbies, or custom sections you want AI to include..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-purple-500 resize-none font-sans"
          />
        </div>
      </div>

      <button
        onClick={handleGenerateFullReadme}
        disabled={isGenerating}
        className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Gemini AI is crafting your bespoke README...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 text-yellow-300" /> Generate AI Profile README Now
          </>
        )}
      </button>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
