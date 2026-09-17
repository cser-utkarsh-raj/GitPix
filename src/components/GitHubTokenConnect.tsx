import React, { useState } from 'react';
import { Key, CheckCircle2, ShieldAlert, ExternalLink, RefreshCw, Github, Sparkles } from 'lucide-react';

interface GitHubTokenConnectProps {
  token: string;
  setToken: (token: string) => void;
  userInfo: any;
  setUserInfo: (info: any) => void;
  isValidated: boolean;
  setIsValidated: (valid: boolean) => void;
}

export const GitHubTokenConnect: React.FC<GitHubTokenConnectProps> = ({
  token,
  setToken,
  userInfo,
  setUserInfo,
  isValidated,
  setIsValidated,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!token || token.trim() === '') {
      setErrorMsg('Please enter a valid GitHub Personal Access Token');
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/github/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Validation failed');
      }

      const data = await res.json();
      setUserInfo(data);
      setIsValidated(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not validate GitHub token');
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              1. Connect GitHub Account & Token
            </h2>
            <p className="text-xs text-slate-400">
              Enter your GitHub Personal Access Token to enable 1-click direct push to your repository
            </p>
          </div>
        </div>

        {isValidated && (
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Connected as @{userInfo?.username}
          </span>
        )}
      </div>

      {!isValidated ? (
        <div className="space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                placeholder="Paste GitHub Personal Access Token (ghp_...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Connect GitHub
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Requires <code className="text-cyan-300 font-mono">repo</code> scope permission
            </span>
            <a
              href="https://github.com/settings/tokens/new?description=AI%20Profile%20Studio&scopes=repo"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              Generate token on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>
      ) : (
        /* Connected state */
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl mt-3">
          <div className="flex items-center gap-3">
            <img
              src={userInfo?.avatarUrl}
              alt={userInfo?.username}
              className="w-9 h-9 rounded-full border border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                {userInfo?.name || userInfo?.username}
                <span className="text-[10px] text-slate-400 font-mono">(@{userInfo?.username})</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Target Repo: <span className="text-cyan-400 font-mono">github.com/{userInfo?.username}/{userInfo?.username}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsValidated(false);
              setUserInfo(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Change Account
          </button>
        </div>
      )}
    </div>
  );
};
