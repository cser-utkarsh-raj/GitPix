import React, { useState } from 'react';
import { Terminal, X, Play, RefreshCw, Cpu, Wifi } from 'lucide-react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ isOpen, onClose }) => {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM BOOT: GITPIX SAMURAI PROFILE FORGE OS v4.8',
    'STATUS: 100% ONLINE | GEMINI 3.8 FLASH ENGINE READY',
    'GITHUB API: OPERATIONAL (REST v3 + GRAPHQL v4)',
    'PING: 1.2ms (TOKYO-CYBER-CORE-01)',
    'Type "help", "forge", "templates", or "push" for guidance.',
  ]);

  if (!isOpen) return null;

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim().toLowerCase();
    const newLogs = [...logs, `> ${command}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available commands:',
        '  forge     - Trigger Gemini AI profile generation',
        '  templates - List available Samurai themes',
        '  push      - Inspect 1-Click Direct Push to GitHub',
        '  status    - Check AI & GitHub API connection',
        '  clear     - Clear terminal screen'
      );
    } else if (cmd === 'forge') {
      newLogs.push(
        '--- GITPIX AI FORGE ENGINE ---',
        'Model:        Gemini 3.8 Flash (Neural Markdown)',
        'Speed:        ~1.2s per full README generation',
        'Features:     Tech Badges, Typing Animation, Stats SVG, Streak Counter'
      );
    } else if (cmd === 'templates') {
      newLogs.push(
        '--- AVAILABLE SAMURAI TEMPLATES ---',
        '1. Cyberpunk Samurai (Crimson & Neon)',
        '2. Minimalist Architect (Clean & Professional)',
        '3. Tokyo Night (Deep Violet Aesthetic)',
        '4. Terminal Hacker (Matrix Green CLI)',
        '5. Senior Full-Stack (Metrics & Badges Heavy)'
      );
    } else if (cmd === 'push') {
      newLogs.push(
        '--- DIRECT GITHUB PUSH SYSTEM ---',
        'Method: POST /api/github/push-readme',
        'Target Repo: github.com/{username}/{username}',
        'Auth: Personal Access Token (repo scope)',
        'Auto-creates repository if missing!'
      );
    } else if (cmd === 'status') {
      newLogs.push('GEMINI AI API: CONNECTED | GITHUB REST API: CONNECTED | 0 FATAL ERRORS.');
    } else if (cmd === 'clear') {
      setLogs([]);
      setCommand('');
      return;
    } else {
      newLogs.push(`Command not recognized: "${command}". Type "help" for command list.`);
    }

    setLogs(newLogs);
    setCommand('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c0812] border border-cyan-500/50 max-w-2xl w-full h-[450px] rounded-2xl flex flex-col overflow-hidden shadow-2xl font-mono text-xs">
        {/* Top Header Bar */}
        <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span className="font-bold">GITPIX_CYBER_TERMINAL.exe</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs viewport */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1 text-cyan-300">
          {logs.map((log, index) => (
            <div key={index} className={log.startsWith('>') ? 'text-rose-400 font-bold' : ''}>
              {log}
            </div>
          ))}
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleRunCommand} className="bg-slate-950 p-3 border-t border-slate-800 flex items-center gap-2">
          <span className="text-rose-500 font-bold">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type command ('help', 'forge', 'templates', 'push')..."
            className="flex-1 bg-transparent text-white outline-none text-xs font-mono"
          />
          <button type="submit" className="px-3 py-1 bg-cyan-600 text-white rounded text-xs font-bold">
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};
