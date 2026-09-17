import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2, Bot, Wand2 } from 'lucide-react';
import { ProfileData } from '../types';

interface AIBioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfileData;
  onApplyBio: (bio: string) => void;
  onApplyTagline: (tagline: string) => void;
  onApplyCustomSection: (sectionMarkdown: string) => void;
}

export const AIBioGeneratorModal: React.FC<AIBioGeneratorModalProps> = ({
  isOpen,
  onClose,
  data,
  onApplyBio,
  onApplyTagline,
  onApplyCustomSection,
}) => {
  const [mode, setMode] = useState<'bio' | 'tagline' | 'custom_section'>('bio');
  const [vibe, setVibe] = useState('Cyberpunk Hacker');
  const [roleInput, setRoleInput] = useState(data.title || 'Full Stack Engineer');
  const [currentWorkInput, setCurrentWorkInput] = useState(data.currentWork || '');
  const [goalInput, setGoalInput] = useState('My Tech Journey & Philosophy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [customResult, setCustomResult] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setResults([]);
    setCustomResult('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          name: data.displayName || data.username,
          role: roleInput,
          skills: data.selectedTech,
          vibe,
          currentWork: currentWorkInput,
          goal: goalInput,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate AI content');
      }

      const json = await res.json();
      const output = json.output || '';

      if (mode === 'custom_section') {
        setCustomResult(output);
      } else {
        try {
          // Attempt parsing JSON string array from Gemini output
          const parsed = JSON.parse(output.replace(/```json|```/g, '').trim());
          if (Array.isArray(parsed)) {
            setResults(parsed);
          } else {
            setResults([output]);
          }
        } catch {
          // Fallback splits
          const splitLines = output
            .split('\n')
            .map((s) => s.replace(/^[0-9]+\.\s*|\*|-|"/g, '').trim())
            .filter((s) => s.length > 5);
          setResults(splitLines.length > 0 ? splitLines.slice(0, 4) : [output]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-900/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Gemini AI README Writer
            </h2>
            <p className="text-xs text-slate-400">
              Generate catchy bios, taglines, or custom sections tuned to your style
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-4 text-xs font-medium">
          <button
            onClick={() => setMode('bio')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'bio'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catchy Bio
          </button>
          <button
            onClick={() => setMode('tagline')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'tagline'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tagline / Motto
          </button>
          <button
            onClick={() => setMode('custom_section')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'custom_section'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Section
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Your Developer Role / Specialty</label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, AI Researcher, Systems Dev"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Select Vibe / Aesthetic Tone</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-purple-500"
            >
              <option value="Cyberpunk Hacker">⚡ Cyberpunk Hacker (Edgy & Techy)</option>
              <option value="Senior Architect">💼 Senior Architect (Professional & Authoritative)</option>
              <option value="Witty & Funny">😄 Witty & Humorous (Relatable Dev Jokes)</option>
              <option value="Minimalist Genius">✨ Minimalist & Direct (Clean & Concise)</option>
              <option value="Open Source Pioneer">🌍 Open Source Pioneer (Collaborative)</option>
            </select>
          </div>

          {mode === 'custom_section' && (
            <div>
              <label className="block text-slate-400 mb-1">Section Topic / Heading</label>
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. Why I Love Building, My Open Source Philosophy"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 mb-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating AI Suggestions...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-yellow-300" /> Generate Suggestions with Gemini
            </>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs mb-4">
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && mode !== 'custom_section' && (
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Suggestions (Click to Apply)
            </h3>
            {results.map((resItem, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (mode === 'bio') onApplyBio(resItem);
                  if (mode === 'tagline') onApplyTagline(resItem);
                  onClose();
                }}
                className="group cursor-pointer p-3 bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-950/90 rounded-xl transition-all text-xs text-slate-200 leading-relaxed flex items-start justify-between gap-3"
              >
                <span>{resItem}</span>
                <span className="shrink-0 text-purple-400 font-medium group-hover:scale-105 transition-transform flex items-center gap-1 text-[11px]">
                  Use <Check className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        )}

        {customResult && mode === 'custom_section' && (
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Generated Markdown Section
            </h3>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
              {customResult}
            </pre>
            <button
              onClick={() => {
                onApplyCustomSection(customResult);
                onClose();
              }}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Append Section to README
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
