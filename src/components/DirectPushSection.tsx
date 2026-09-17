import React, { useState } from 'react';
import { Rocket, Loader2, CheckCircle, ExternalLink, AlertCircle, GitCommit } from 'lucide-react';

interface DirectPushSectionProps {
  token: string;
  isValidated: boolean;
  markdownContent: string;
  username: string;
}

export const DirectPushSection: React.FC<DirectPushSectionProps> = ({
  token,
  isValidated,
  markdownContent,
  username,
}) => {
  const [commitMsg, setCommitMsg] = useState('Update GitHub Profile README via AI Studio 🚀');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDirectPush = async () => {
    if (!isValidated || !token) {
      setErrorMsg('Please connect your GitHub Personal Access Token in Step 1 first.');
      return;
    }

    if (!markdownContent || markdownContent.trim() === '') {
      setErrorMsg('No markdown content to push. Please generate or edit a README first.');
      return;
    }

    setIsPushing(true);
    setErrorMsg(null);
    setPushResult(null);

    try {
      const res = await fetch('/api/github/push-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          markdownContent,
          commitMessage: commitMsg,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to push README to GitHub');
      }

      const data = await res.json();
      setPushResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error committing README to GitHub');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-slate-100 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              3. Direct Push to GitHub Repository
            </h2>
            <p className="text-xs text-slate-400">
              Commit & push directly to <code className="text-cyan-300 font-mono">github.com/{username || 'username'}/{username || 'username'}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1">
            <GitCommit className="w-3.5 h-3.5 text-cyan-400" /> Commit Message
          </label>
          <input
            type="text"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
            placeholder="Commit message..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <button
          onClick={handleDirectPush}
          disabled={isPushing || !isValidated}
          className={`w-full py-3 text-xs font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 ${
            !isValidated
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {isPushing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Pushing README directly to GitHub...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" /> Push README Directly to GitHub ({username || 'github'})
            </>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {pushResult && pushResult.success && (
          <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5" />
              {pushResult.createdNewRepo
                ? 'Repository Created & README Pushed Successfully!'
                : 'README Updated Successfully!'}
            </div>
            <p className="text-slate-300">
              Your GitHub profile README has been pushed live to GitHub.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 font-medium">
              <a
                href={pushResult.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
              >
                View Live GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={pushResult.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline"
              >
                View Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
