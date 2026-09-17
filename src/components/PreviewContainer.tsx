import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Code2, Copy, Check, Sun, Moon } from 'lucide-react';

interface PreviewContainerProps {
  markdownContent: string;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({ markdownContent }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'preview'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live GitHub View
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'code'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Raw Markdown
          </button>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2">
          {viewMode === 'preview' && (
            <button
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {previewTheme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Light Mode
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Main Preview Frame */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60 max-h-[calc(100vh-200px)]">
        {viewMode === 'preview' ? (
          <div
            className={`max-w-4xl mx-auto rounded-2xl border p-6 transition-colors shadow-2xl ${
              previewTheme === 'dark'
                ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
                : 'bg-white border-slate-200 text-slate-800 shadow-slate-200'
            }`}
          >
            {/* GitHub Header Container Simulation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold opacity-75">
                <span>README.md</span>
              </div>
              <span className="text-[10px] bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50">
                GitHub Profile Preview
              </span>
            </div>

            {/* Markdown Rendered Content */}
            <div className="prose prose-invert max-w-none text-sm leading-relaxed space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold pb-2 border-b border-slate-800/80 mb-4 mt-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold pb-2 border-b border-slate-800/80 mb-3 mt-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mb-2 mt-4 text-cyan-400">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-sm font-semibold mb-1 text-slate-200">{children}</h4>
                  ),
                  p: ({ children }) => <div className="mb-2 leading-relaxed">{children}</div>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
                  li: ({ children }) => <li className="text-slate-300">{children}</li>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline font-medium"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || ''}
                      loading="lazy"
                      className="inline-block max-w-full my-1 rounded"
                    />
                  ),
                  code: ({ children }) => (
                    <code className="bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  hr: () => <hr className="border-slate-800 my-6" />,
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          /* Code View */
          <div className="max-w-4xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 font-mono text-xs text-cyan-300 shadow-xl overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">{markdownContent}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
