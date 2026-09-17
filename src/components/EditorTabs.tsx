import React, { useState } from 'react';
import {
  User,
  Code,
  BarChart2,
  FolderGit2,
  Share2,
  Layout,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';
import { ProfileData, BadgeStyle } from '../types';
import { TECH_BADGES } from '../data/techStackData';

interface EditorTabsProps {
  data: ProfileData;
  onUpdate: (updated: Partial<ProfileData>) => void;
  onOpenAIModal: () => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ data, onUpdate, onOpenAIModal }) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'tech' | 'stats' | 'projects' | 'socials' | 'header'
  >('profile');

  // Tech stack search & category
  const [techSearch, setTechSearch] = useState('');
  const [techCategory, setTechCategory] = useState<string>('all');

  // Stats themes list
  const STATS_THEMES = [
    'dark',
    'radical',
    'oceanic',
    'dracula',
    'synthwave',
    'tokyonight',
    'cyber',
    'slate',
    'nord',
    'gruvbox',
    'onedark',
  ];

  // Helper for tech stack toggling
  const toggleTech = (id: string) => {
    const current = data.selectedTech || [];
    if (current.includes(id)) {
      onUpdate({ selectedTech: current.filter((t) => t !== id) });
    } else {
      onUpdate({ selectedTech: [...current, id] });
    }
  };

  // Helper for adding projects
  const addProject = () => {
    const newProj = {
      id: Date.now().toString(),
      title: '🚀 My Awesome Project',
      description: 'A full-stack modern application with real-time sync.',
      techStack: ['TypeScript', 'React'],
      stars: 120,
    };
    onUpdate({ projects: [...(data.projects || []), newProj] });
  };

  const removeProject = (id: string) => {
    onUpdate({ projects: (data.projects || []).filter((p) => p.id !== id) });
  };

  const updateProject = (id: string, updatedFields: any) => {
    onUpdate({
      projects: (data.projects || []).map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    });
  };

  // Helper for social links
  const updateSocial = (platform: string, url: string, username: string) => {
    const updated = (data.socials || []).map((s) =>
      s.platform === platform ? { ...s, url, username } : s
    );
    onUpdate({ socials: updated });
  };

  const filteredBadges = TECH_BADGES.filter((badge) => {
    const matchesCategory = techCategory === 'all' || badge.category === techCategory;
    const matchesSearch =
      badge.name.toLowerCase().includes(techSearch.toLowerCase()) ||
      badge.category.toLowerCase().includes(techSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-xl">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-medium scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile & Bio
        </button>

        <button
          onClick={() => setActiveTab('tech')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'tech'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" /> Tech Stack ({data.selectedTech?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> Stats & Cards
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" /> Projects ({data.projects?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('socials')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'socials'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" /> Socials
        </button>

        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'header'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Banner & Custom
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-4 space-y-4 text-xs overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {/* TAB 1: PROFILE & BIO */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Personal Identity
              </h3>
              <button
                onClick={onOpenAIModal}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 bg-purple-950/40 border border-purple-800/50 px-2 py-1 rounded-lg"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" /> AI Bio Assistant
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={data.displayName}
                  onChange={(e) => onUpdate({ displayName: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => onUpdate({ username: e.target.value })}
                  placeholder="e.g. alexmercer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Title / Headline</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="e.g. Full Stack & AI Software Engineer 🚀"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={data.tagline}
                  onChange={(e) => onUpdate({ tagline: e.target.value })}
                  placeholder="e.g. Transforming complex code into elegant products."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">About Me (Bio Paragraph)</label>
              <textarea
                rows={3}
                value={data.aboutBio}
                onChange={(e) => onUpdate({ aboutBio: e.target.value })}
                placeholder="Write a brief intro about yourself..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2 border-t border-slate-800">
              Current Status Bullets
            </h3>

            <div className="space-y-2">
              <div>
                <label className="block text-slate-400 mb-1">🔭 Currently Working On</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.currentWork}
                    onChange={(e) => onUpdate({ currentWork: e.target.value })}
                    placeholder="Project name or description"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={data.currentWorkLink}
                    onChange={(e) => onUpdate({ currentWorkLink: e.target.value })}
                    placeholder="Project URL (optional)"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">🌱 Currently Learning</label>
                  <input
                    type="text"
                    value={data.learning}
                    onChange={(e) => onUpdate({ learning: e.target.value })}
                    placeholder="e.g. WebGPU & Rust"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">💬 Ask Me About</label>
                  <input
                    type="text"
                    value={data.askMeAbout}
                    onChange={(e) => onUpdate({ askMeAbout: e.target.value })}
                    placeholder="e.g. React, Next.js, Architecture"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">⚡ Fun Fact</label>
                  <input
                    type="text"
                    value={data.funFact}
                    onChange={(e) => onUpdate({ funFact: e.target.value })}
                    placeholder="e.g. I drink 3 coffees a day"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">📍 Location</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => onUpdate({ location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">💼 Company / Org</label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => onUpdate({ company: e.target.value })}
                    placeholder="e.g. Open Source"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECH STACK */}
        {activeTab === 'tech' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Your Tech Stack
              </h3>

              {/* Badge Style Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Badge Style:</span>
                <select
                  value={data.badgeStyle}
                  onChange={(e) => onUpdate({ badgeStyle: e.target.value as BadgeStyle })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="flat">Flat</option>
                  <option value="flat-square">Flat Square</option>
                  <option value="for-the-badge">For The Badge</option>
                  <option value="plastic">Plastic</option>
                </select>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={techCategory}
                onChange={(e) => setTechCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="languages">Languages</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Databases</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="ai">AI & ML</option>
                <option value="tools">Tools & Other</option>
              </select>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1 max-h-72 overflow-y-auto">
              {filteredBadges.map((badge) => {
                const isSelected = data.selectedTech?.includes(badge.id);
                return (
                  <button
                    key={badge.id}
                    onClick={() => toggleTech(badge.id)}
                    className={`p-2 rounded-xl border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-medium text-xs truncate">{badge.name}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STATS & CARDS */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                GitHub Dynamic Cards & Widgets
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Widget Theme:</span>
                <select
                  value={data.statsTheme}
                  onChange={(e) => onUpdate({ statsTheme: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 outline-none focus:border-cyan-500 text-xs"
                >
                  {STATS_THEMES.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">GitHub Stats Card</span>
                  <span className="text-[11px] text-slate-500">
                    Show total stars, commits, PRs, & contributions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showStatsCard}
                  onChange={(e) => onUpdate({ showStatsCard: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Top Languages Chart</span>
                  <span className="text-[11px] text-slate-500">
                    Display most used programming languages
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showTopLanguages}
                  onChange={(e) => onUpdate({ showTopLanguages: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Streak Stats</span>
                  <span className="text-[11px] text-slate-500">
                    Show current streak, longest streak & total contributions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showStreakStats}
                  onChange={(e) => onUpdate({ showStreakStats: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">GitHub Trophy Case</span>
                  <span className="text-[11px] text-slate-500">
                    Display achievement badges & rank medals
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showTrophies}
                  onChange={(e) => onUpdate({ showTrophies: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Profile Views Counter</span>
                  <span className="text-[11px] text-slate-500">
                    Track visitors who view your profile
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showVisitorCounter}
                  onChange={(e) => onUpdate({ showVisitorCounter: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Random Dev Joke Widget</span>
                  <span className="text-[11px] text-slate-500">
                    Show a hilarious fresh tech joke
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showDevJoke}
                  onChange={(e) => onUpdate({ showDevJoke: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: FEATURED PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Featured Projects / Work
              </h3>
              <button
                onClick={addProject}
                className="flex items-center gap-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {(!data.projects || data.projects.length === 0) && (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                No featured projects added yet. Click "Add Project" to showcase your best repositories.
              </div>
            )}

            <div className="space-y-3">
              {data.projects?.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">
                      PROJECT #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                      placeholder="Project Title"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={proj.demoUrl || ''}
                      onChange={(e) => updateProject(proj.id, { demoUrl: e.target.value })}
                      placeholder="Live Demo / Repository URL"
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Brief description of what this project does"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />

                  <input
                    type="text"
                    value={proj.techStack ? proj.techStack.join(', ') : ''}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        techStack: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="Tech stack tags (comma separated: React, Node, PostgreSQL)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOCIALS & COFFEE */}
        {activeTab === 'socials' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Social Links & Badges
            </h3>

            <div className="space-y-2">
              {data.socials?.map((soc) => (
                <div key={soc.platform} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 font-medium capitalize">
                    {soc.platform}
                  </div>
                  <input
                    type="text"
                    value={soc.url}
                    onChange={(e) => updateSocial(soc.platform, e.target.value, soc.username)}
                    placeholder={`https://${soc.platform}.com/username`}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2 border-t border-slate-800">
              Sponsor / Buy Me A Coffee
            </h3>

            <div>
              <label className="block text-slate-400 mb-1">Buy Me A Coffee Username</label>
              <input
                type="text"
                value={data.coffeeUsername}
                onChange={(e) => onUpdate({ coffeeUsername: e.target.value })}
                placeholder="e.g. alexmercer"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* TAB 6: BANNER & CUSTOM MARKDOWN */}
        {activeTab === 'header' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Header Banner Customizer
            </h3>

            <div>
              <label className="block text-slate-400 mb-1">Header Style</label>
              <select
                value={data.headerType}
                onChange={(e) => onUpdate({ headerType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value="typing">Animated Typing SVG Header</option>
                <option value="capsule">Capsule Waving Banner</option>
                <option value="banner">Simple Markdown Heading</option>
              </select>
            </div>

            {data.headerType === 'typing' && (
              <div>
                <label className="block text-slate-400 mb-1">
                  Typing Animation Sentences (One line per phrase)
                </label>
                <textarea
                  rows={4}
                  value={data.typingText ? data.typingText.join('\n') : ''}
                  onChange={(e) => onUpdate({ typingText: e.target.value.split('\n') })}
                  placeholder="Full Stack Software Engineer&#10;Open Source Craftsman&#10;Building for the future..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500 font-mono resize-none"
                />
              </div>
            )}

            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider pt-2 border-t border-slate-800">
              Custom Markdown Snippets
            </h3>

            <div>
              <label className="block text-slate-400 mb-1">
                Add Any Custom Raw Markdown or HTML
              </label>
              <textarea
                rows={5}
                value={data.customMarkdown}
                onChange={(e) => onUpdate({ customMarkdown: e.target.value })}
                placeholder="### 📜 My Quote&#10;> 'Code is like humor. When you have to explain it, it's bad.'"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-cyan-500 font-mono resize-none text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
