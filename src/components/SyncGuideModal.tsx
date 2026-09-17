import React from 'react';
import { X, ExternalLink, Copy, Check, Terminal } from 'lucide-react';

interface SyncGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  markdownContent: string;
}

export const SyncGuideModal: React.FC<SyncGuideModalProps> = ({
  isOpen,
  onClose,
  username,
  markdownContent,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const targetRepoName = username || 'your-github-username';

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">How to Sync to Your GitHub Profile</h2>
            <p className="text-xs text-slate-400">
              Follow these simple steps to activate your awesome new profile README on GitHub
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 mt-6">
          {/* Step 1 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-100">Create a Special Repository on GitHub</p>
              <p className="text-slate-400">
                Go to GitHub and create a repository named exactly after your username:{' '}
                <strong className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {targetRepoName}
                </strong>
              </p>
              <a
                href={`https://github.com/new?name=${encodeURIComponent(targetRepoName)}&readme=true`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline pt-1 font-medium"
              >
                Open GitHub New Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <div className="space-y-2 w-full">
              <p className="font-semibold text-slate-100">Copy Your Generated README Code</p>
              <p className="text-slate-400">
                Click the button below to copy the complete markdown to your clipboard:
              </p>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Full README.md'}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-100">Paste and Commit Changes</p>
              <p className="text-slate-400">
                Edit the <code className="text-cyan-300 font-mono">README.md</code> file in your repository, paste the code, and click <strong>"Commit changes"</strong>.
              </p>
              <p className="text-emerald-400 font-medium pt-1">
                🎉 Your cool new profile is instantly active on github.com/{targetRepoName}!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
