import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MasterySection } from './components/MasterySection';
import { ThePathSection } from './components/ThePathSection';
import { ContactModal } from './components/ContactModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { Footer } from './components/Footer';
import { SakuraCanvas } from './components/SakuraCanvas';

// Generator Components
import { GitHubTokenConnect } from './components/GitHubTokenConnect';
import { AIGeneratorPanel } from './components/AIGeneratorPanel';
import { DirectPushSection } from './components/DirectPushSection';
import { TemplatePicker } from './components/TemplatePicker';
import { PreviewContainer } from './components/PreviewContainer';
import { SyncGuideModal } from './components/SyncGuideModal';
import { Sparkles, Code, Layout, ShieldCheck, Zap } from 'lucide-react';

interface GitHubUser {
  login: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  company?: string;
  twitter_username?: string;
  blog?: string;
  public_repos?: number;
  followers?: number;
}

interface UserProfile {
  username: string;
  fullName: string;
  bio: string;
  role: string;
  location: string;
  company: string;
  twitter: string;
  website: string;
  skills: string[];
  githubStatsUsername: string;
  includeVisitorBadge: boolean;
  includeStatsCard: boolean;
  includeTopLangsCard: boolean;
  includeStreakCard: boolean;
  includeTypingHeader: boolean;
  styleTheme: string;
  workStatus: string;
  currentLearning: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSyncGuideOpen, setIsSyncGuideOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // GitHub Token & User State
  const [githubToken, setGithubToken] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);

  // Profile Form State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    fullName: '',
    bio: '',
    role: 'Full-Stack Developer',
    location: '',
    company: '',
    twitter: '',
    website: '',
    skills: ['TypeScript', 'React', 'Node.js', 'TailwindCSS', 'Python'],
    githubStatsUsername: '',
    includeVisitorBadge: true,
    includeStatsCard: true,
    includeTopLangsCard: true,
    includeStreakCard: true,
    includeTypingHeader: true,
    styleTheme: 'cyberpunk-samurai',
    workStatus: 'Open to opportunities',
    currentLearning: 'Rust & WebAssembly',
  });

  // Initial Markdown Content
  const [markdownContent, setMarkdownContent] = useState<string>(`# <h1 align="center">👋 Hi, I'm Alex Mercer | Samurai Full-Stack Developer</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=22&duration=3000&pause=1000&color=F43F5E&center=true&vCenter=true&lines=Full-Stack+%26+Security+Architect;Building+High-Throughput+Systems;Samurai+Open-Source+Warrior;Welcome+to+my+GitHub+Dojo" alt="Typing SVG" />
</p>

---

### 🥷 About Me
- 🔭 **Currently Building**: High-performance AI tools & cyber infrastructure.
- 🌱 **Learning**: Rust, WebAssembly & LLM Fine-tuning.
- ⚡ **Fun Fact**: I solve memory leaks before my morning matcha.

---

### ⚔️ Tech Arsenal
<p flex flex-wrap gap-2>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

### 📊 GitHub Stats
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=octocat&show_icons=true&theme=radical" alt="Stats Card" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=octocat&theme=radical" alt="Streak Stats" />
</p>
`);

  const [activeEditorTab, setActiveEditorTab] = useState<'preview' | 'edit'>('preview');

  // Handle Token Validation
  const handleTokenValidated = (token: string, user: GitHubUser) => {
    setGithubToken(token);
    setIsValidated(true);
    setGithubUser(user);

    setUserProfile((prev) => ({
      ...prev,
      username: user.login,
      fullName: user.name || user.login,
      bio: user.bio || prev.bio,
      location: user.location || prev.location,
      company: user.company || prev.company,
      twitter: user.twitter_username || prev.twitter,
      website: user.blog || prev.website,
      githubStatsUsername: user.login,
    }));
  };

  // Handle Preset Selection
  const handleApplyPreset = (data: any) => {
    setUserProfile((prev) => ({
      ...prev,
      fullName: data.displayName || prev.fullName,
      role: data.title || prev.role,
      bio: data.aboutBio || prev.bio,
      currentLearning: data.learning || prev.currentLearning,
      styleTheme: data.theme || prev.styleTheme,
    }));
  };

  return (
    <div className="min-h-screen bg-[#09040b] text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Animated Floating Sakura & Particles Canvas */}
      <SakuraCanvas />

      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full relative z-20">
        {/* Futuristic Samurai Hero */}
        <HeroSection
          onOpenContact={() => setIsContactOpen(true)}
          soundEnabled={soundEnabled}
        />

        {/* Core Generator Workbench */}
        <section id="generator" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 font-orbitron font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" /> GitPix Samurai AI Profile Dojo
            </div>
            <h2 className="font-orbitron font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
              Forge Your GitHub README
            </h2>
            <p className="font-rajdhani text-slate-400 text-sm sm:text-base">
              Connect your GitHub Personal Access Token, customize your developer profile, pick preset themes, generate with Gemini AI, and push live directly to your profile repository.
            </p>
          </div>

          {/* Workbench Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls (Steps 1, 2, 3) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Step 1: Connect Token */}
              <GitHubTokenConnect
                token={githubToken}
                setToken={setGithubToken}
                userInfo={githubUser}
                setUserInfo={setGithubUser}
                isValidated={isValidated}
                setIsValidated={setIsValidated}
              />

              {/* Step 2: AI Profile Generator Panel */}
              <AIGeneratorPanel
                userInfo={githubUser}
                onGenerate={(newMarkdown) => {
                  setMarkdownContent(newMarkdown);
                  setActiveEditorTab('preview');
                }}
              />

              {/* Step 3: Direct Push Section */}
              <DirectPushSection
                token={githubToken}
                isValidated={isValidated}
                markdownContent={markdownContent}
                username={githubUser?.username || userProfile.username || 'username'}
              />

              {/* Preset Templates Trigger */}
              <div id="templates" className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" /> Samurai Presets
                  </h3>
                  <p className="text-xs text-slate-400 font-rajdhani">
                    Apply instant Cyberpunk, Minimalist, or Tokyo Night profile presets
                  </p>
                </div>
                <button
                  onClick={() => setIsTemplatePickerOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-orbitron font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-600/30"
                >
                  Browse Presets
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Markdown Editor & Preview */}
            <div id="preview" className="lg:col-span-7 sticky top-28 space-y-4">
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorTab('preview')}
                    className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all flex items-center gap-2 ${
                      activeEditorTab === 'preview'
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5" /> Live GFM Preview
                  </button>
                  <button
                    onClick={() => setActiveEditorTab('edit')}
                    className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all flex items-center gap-2 ${
                      activeEditorTab === 'edit'
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" /> Raw Markdown Editor
                  </button>
                </div>

                <button
                  onClick={() => setIsSyncGuideOpen(true)}
                  className="px-3 py-1.5 text-[11px] font-orbitron font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded-xl transition-all"
                >
                  Manual Sync Guide
                </button>
              </div>

              {/* Preview Container Component */}
              <PreviewContainer
                markdownContent={markdownContent}
              />
            </div>
          </div>
        </section>

        {/* Weapons & Capabilities Section */}
        <MasterySection onOpenContact={() => setIsContactOpen(true)} />

        {/* Open Source Samurai Creed */}
        <ThePathSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <TerminalDrawer isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <SyncGuideModal
        isOpen={isSyncGuideOpen}
        onClose={() => setIsSyncGuideOpen(false)}
        username={githubUser?.username || userProfile.username || 'username'}
        markdownContent={markdownContent}
      />
      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={handleApplyPreset}
      />
    </div>
  );
}
