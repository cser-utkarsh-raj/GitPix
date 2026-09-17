import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-rose-500/60 max-w-lg w-full p-6 sm:p-8 rounded-3xl relative text-white shadow-2xl space-y-6 animate-fade-in clip-sci-fi">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-500 font-orbitron uppercase tracking-widest">
                GitPix Support & Feature Dojo
              </span>
              <h2 className="text-2xl font-black font-orbitron uppercase text-white">
                Contact GitPix Master
              </h2>
              <p className="text-xs text-slate-400 font-rajdhani">
                Have a feature request, theme recommendation, or GitHub API integration question? Drop your query below.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 text-xs font-rajdhani"
            >
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">GitHub Username / Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. octocat"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="dev@github.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Inquiry Type</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500">
                  <option value="1">Custom Samurai Template Request</option>
                  <option value="2">GitHub API & PAT Connection Support</option>
                  <option value="3">Feature Request / Bug Report</option>
                  <option value="4">Custom Enterprise Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your request or custom template vision..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-orbitron font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch Request to GitPix
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-rose-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black font-orbitron text-white uppercase">Message Dispatched!</h3>
            <p className="text-xs text-slate-300 font-rajdhani">
              Thank you for reaching out to GitPix. Our open-source team will respond shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-rose-600 text-white font-orbitron text-xs font-bold rounded-xl"
            >
              Return to Profile Dojo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
