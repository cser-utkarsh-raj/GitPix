import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Copy, Download, Github, Search, RotateCcw, Check, ChevronRight, X, Eye, SlidersHorizontal } from 'lucide-react';
import { TEMPLATE_PRESETS } from './data/templates.js';
import { generateMarkdown } from './utils/markdownGenerator.js';

const EMPTY_PROFILE = {
  username: '', displayName: '', title: 'Software Engineer', avatarUrl: '', location: '', company: '',
  tagline: 'Building useful things and shipping them.', aboutBio: 'I enjoy turning ideas into clean, useful software.',
  currentWork: '', currentWorkLink: '', learning: '', askMeAbout: '', funFact: '',
  selectedTech: ['javascript', 'python', 'react', 'fastapi', 'git'],
  showStatsCard: true, showStreakStats: true, showTopLanguages: true, showTrophies: false,
  showVisitorCounter: false, statsTheme: 'transparent', projects: [], socials: [],
  customMarkdown: '', coffeeUsername: '', headerType: 'banner', theme: 'samurai', badgeStyle: 'flat-square',
};
const TECH = ['javascript','python','typescript','react','nextjs','nodejs','express','fastapi','flask','java','spring','html','css','tailwindcss','vite','postgresql','mysql','mongodb','docker','git','github','aws','azure','linux','figma'];

export default function App() {
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('gitpix_profile')) || EMPTY_PROFILE; } catch { return EMPTY_PROFILE; } });
  const [template, setTemplate] = useState(() => localStorage.getItem('gitpix_template') || 'samurai');
  const [username, setUsername] = useState(profile.username || '');
  const [queryLoading, setQueryLoading] = useState(false), [queryError, setQueryError] = useState('');
  const [copied, setCopied] = useState(false), [mobilePanel, setMobilePanel] = useState('editor'), [showTemplates, setShowTemplates] = useState(false);
  useEffect(() => localStorage.setItem('gitpix_profile', JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem('gitpix_template', template), [template]);
  const selectedTemplate = useMemo(() => TEMPLATE_PRESETS.find(t => t.id === template) || TEMPLATE_PRESETS[0], [template]);
  const markdown = useMemo(() => generateMarkdown({ ...profile, theme: template }), [profile, template]);
  const update = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));

  async function importGithub() {
    const value = username.trim().replace(/^@/, '');
    if (!value || !/^[a-zA-Z0-9-]{1,39}$/.test(value)) return setQueryError('Enter a valid GitHub username.');
    setQueryLoading(true); setQueryError('');
    try {
      const res = await fetch(`/api/github/user/${encodeURIComponent(value)}`), data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load that GitHub profile.');
      setProfile(prev => ({ ...prev, ...data.profile, projects: data.projects || [], selectedTech: data.languages?.length ? data.languages.map(x => x.toLowerCase()).filter(x => TECH.includes(x)).slice(0, 8) : prev.selectedTech }));
      setUsername(data.profile.username);
    } catch (err) { setQueryError(err.message || 'GitHub lookup failed.'); } finally { setQueryLoading(false); }
  }
  async function copyMarkdown() { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 1600); }
  function downloadMarkdown() { const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'README.md'; a.click(); URL.revokeObjectURL(url); }
  function applyTemplate(id) { setTemplate(id); setShowTemplates(false); }
  function reset() { setProfile(EMPTY_PROFILE); setUsername(''); setTemplate('samurai'); localStorage.removeItem('gitpix_profile'); localStorage.removeItem('gitpix_template'); }

  return <div className="gitpix-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="GitPix home"><span className="brand-mark">G</span><span>GIT<span>PIX</span></span></a><nav className="desktop-nav"><a href="#templates">Templates</a><a href="#designer">Designer</a><a href="#preview">Preview</a></nav><div className="top-actions"><a className="github-link" href="https://github.com/cser-utkarsh-raj/GitPix" target="_blank" rel="noreferrer"><Github size={15}/> Source</a><button className="outline-btn" onClick={reset}><RotateCcw size={14}/> Reset</button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> GITHUB PROFILE README DESIGNER</div><h1>Forge a profile<br/><em>worth starring.</em></h1><p>Choose a visual system, pull in your public GitHub data, tune every section, and export a README that actually looks like you.</p><div className="hero-cta"><a href="#designer" className="primary-btn">Start designing <ChevronRight size={17}/></a><a href="#templates" className="text-btn">Explore templates</a></div><div className="hero-meta"><span>6 visual systems</span><i/> <span>Live preview</span><i/> <span>No account required</span></div></div><div className="hero-art" aria-hidden="true"><div className="sun-disc"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="slash slash-a"/><div className="slash slash-b"/><div className="hero-card"><span>README / 01</span><strong>MAKE IT<br/><b>YOURS.</b></strong><small>GITHUB PROFILE SYSTEM</small></div><div className="vertical-jp">プロフィール · 作品 · コード</div></div></section>
      <section id="templates" className="section"><div className="section-head"><div><span className="section-kicker">01 / VISUAL SYSTEMS</span><h2>Pick your weapon.</h2></div><p>Every template is a different composition, not a recolor. Switch anytime without losing your content.</p></div><div className="template-grid">{TEMPLATE_PRESETS.map(t => <button key={t.id} className={`template-card ${template === t.id ? 'selected' : ''}`} onClick={() => applyTemplate(t.id)}><div className={`template-art art-${t.id}`}><span>{t.label}</span><div className="art-lines"/><strong>{t.short}</strong></div><div className="template-info"><span>{t.name}</span><small>{t.description}</small></div></button>)}</div></section>
      <section id="designer" className="section"><div className="section-head"><div><span className="section-kicker">02 / THE FORGE</span><h2>Build your README.</h2></div><p>Import once, then customize the details. Your draft is saved locally as you work.</p></div><div className="mobile-tabs"><button className={mobilePanel === 'editor' ? 'active' : ''} onClick={() => setMobilePanel('editor')}><SlidersHorizontal size={15}/> Edit</button><button className={mobilePanel === 'preview' ? 'active' : ''} onClick={() => setMobilePanel('preview')}><Eye size={15}/> Preview</button></div><div className="workbench">
        <aside className={`panel editor-panel ${mobilePanel === 'preview' ? 'mobile-hidden' : ''}`}><div className="panel-title"><div><span>PROFILE DATA</span><small>Public GitHub information</small></div><Github size={18}/></div><div className="import-row"><div className="field with-icon"><Search size={15}/><input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && importGithub()} placeholder="github username" aria-label="GitHub username"/></div><button className="square-btn" onClick={importGithub} disabled={queryLoading}>{queryLoading ? '…' : <ChevronRight size={18}/>}</button></div>{queryError && <div className="error-box">{queryError}</div>}
          <div className="field"><label>Display name</label><input value={profile.displayName} onChange={e => update('displayName', e.target.value)} placeholder="Your name"/></div><div className="field"><label>Headline</label><input value={profile.title} onChange={e => update('title', e.target.value)} placeholder="Software Engineer"/></div><div className="field"><label>Tagline</label><input value={profile.tagline} onChange={e => update('tagline', e.target.value)} placeholder="What are you building?"/></div><div className="field"><label>About</label><textarea rows="3" value={profile.aboutBio} onChange={e => update('aboutBio', e.target.value)} placeholder="A short introduction..."/></div><div className="field-row"><div className="field"><label>Location</label><input value={profile.location} onChange={e => update('location', e.target.value)} placeholder="Jaipur, India"/></div><div className="field"><label>Company</label><input value={profile.company} onChange={e => update('company', e.target.value)} placeholder=".dot"/></div></div><div className="field-row"><div className="field"><label>Currently building</label><input value={profile.currentWork} onChange={e => update('currentWork', e.target.value)} placeholder="A new product"/></div><div className="field"><label>Learning</label><input value={profile.learning} onChange={e => update('learning', e.target.value)} placeholder="Rust, systems..."/></div></div><div className="field"><label>Ask me about</label><input value={profile.askMeAbout} onChange={e => update('askMeAbout', e.target.value)} placeholder="React, Python, APIs"/></div><div className="field"><label>Fun fact</label><input value={profile.funFact} onChange={e => update('funFact', e.target.value)} placeholder="Something human."/></div>
          <div className="subhead">TECH STACK</div><div className="tech-grid">{TECH.map(id => <button key={id} className={profile.selectedTech.includes(id) ? 'tech selected' : 'tech'} onClick={() => update('selectedTech', profile.selectedTech.includes(id) ? profile.selectedTech.filter(x => x !== id) : [...profile.selectedTech, id])}>{id}</button>)}</div><div className="subhead">GITHUB MODULES</div><div className="toggle-grid">{[['showStatsCard','Stats'],['showTopLanguages','Languages'],['showStreakStats','Streak'],['showTrophies','Trophies'],['showVisitorCounter','Visitors']].map(([key,label]) => <label className="toggle" key={key}><input type="checkbox" checked={profile[key]} onChange={e => update(key,e.target.checked)}/><span>{label}</span></label>)}</div><div className="panel-footer"><span>Auto-saved locally</span><button onClick={() => setShowTemplates(true)}>Change template</button></div>
        </aside>
        <section id="preview" className={`panel preview-panel ${mobilePanel === 'editor' ? 'mobile-hidden' : ''}`}><div className="preview-toolbar"><div><span>LIVE PREVIEW</span><small>{selectedTemplate.name}</small></div><div className="toolbar-actions"><button onClick={copyMarkdown}>{copied ? <><Check size={15}/> Copied</> : <><Copy size={15}/> Copy MD</>}</button><button onClick={downloadMarkdown}><Download size={15}/> Download</button></div></div><div className={`readme-paper paper-${template}`}><ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown></div></section>
      </div></section>
      <section className="export-strip"><div><span className="section-kicker">03 / SHIP IT</span><h2>Your README is ready.</h2><p>Copy the Markdown into your profile repository or download it as <code>README.md</code>.</p></div><div className="export-actions"><button className="primary-btn" onClick={copyMarkdown}>{copied ? 'Copied to clipboard' : 'Copy Markdown'} <Copy size={16}/></button><button className="outline-btn" onClick={downloadMarkdown}><Download size={15}/> Download README.md</button></div></section>
    </main>
    <footer className="footer"><div className="brand"><span className="brand-mark">G</span><span>GIT<span>PIX</span></span></div><p>Designed for developers who care about the details.</p><a href="https://github.com/cser-utkarsh-raj/GitPix" target="_blank" rel="noreferrer"><Github size={15}/> Open source</a></footer>
    {showTemplates && <div className="modal-backdrop" onMouseDown={() => setShowTemplates(false)}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">TEMPLATE LIBRARY</span><h3>Choose a visual system.</h3></div><button onClick={() => setShowTemplates(false)}><X size={18}/></button></div><div className="modal-grid">{TEMPLATE_PRESETS.map(t => <button key={t.id} onClick={() => applyTemplate(t.id)} className={template === t.id ? 'modal-template selected' : 'modal-template'}><div className={`mini-art art-${t.id}`}><strong>{t.short}</strong></div><span>{t.name}</span></button>)}</div></div></div>}
  </div>;
}
