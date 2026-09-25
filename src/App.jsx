import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Copy, Download, Github, Search, RotateCcw, Check, ChevronRight, Eye, SlidersHorizontal, Sparkles, ExternalLink, Upload, LogOut, Wand2 } from 'lucide-react';
import { TEMPLATE_PRESETS } from './data/templates.js';
import { generateMarkdown } from './utils/markdownGenerator.js';

const EMPTY_PROFILE = {
  username: '', displayName: '', title: 'Software Engineer', avatarUrl: '', location: '', company: '', website: '', twitter: '',
  tagline: 'Building useful things and shipping them.', aboutBio: 'I enjoy turning ideas into clean, useful software.', currentWork: '', currentWorkLink: '', learning: '', askMeAbout: '', funFact: '',
  selectedTech: ['javascript', 'python', 'react', 'fastapi', 'git'], languages: [], projects: [], publicRepos: 0, followers: 0, following: 0, totalStars: 0,
  showStatsCard: true, showStreakStats: true, showTopLanguages: true, showTrophies: false, showVisitorCounter: false, socials: [], customMarkdown: '', badgeStyle: 'flat-square',
};
const TECH = ['javascript','python','typescript','react','nextjs','nodejs','express','fastapi','flask','java','spring','html','css','tailwindcss','vite','postgresql','mysql','mongodb','docker','git','github','aws','azure','linux','figma'];

export default function App() {
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('gitpix_profile')) || EMPTY_PROFILE; } catch { return EMPTY_PROFILE; } });
  const [template, setTemplate] = useState(() => localStorage.getItem('gitpix_template') || 'ronin');
  const [username, setUsername] = useState(profile.username || '');
  const [queryLoading, setQueryLoading] = useState(false), [queryError, setQueryError] = useState('');
  const [copied, setCopied] = useState(false), [mobilePanel, setMobilePanel] = useState('editor');
  const [generationMode, setGenerationMode] = useState(() => localStorage.getItem('gitpix_generation_mode') || 'template');
  const [aiMarkdown, setAiMarkdown] = useState('');
  const [aiLoading, setAiLoading] = useState(false), [aiError, setAiError] = useState('');
  const [connected, setConnected] = useState(false), [connectedUser, setConnectedUser] = useState('');
  const [publishState, setPublishState] = useState('');

  useEffect(() => localStorage.setItem('gitpix_profile', JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem('gitpix_template', template), [template]);
  useEffect(() => localStorage.setItem('gitpix_generation_mode', generationMode), [generationMode]);
  useEffect(() => { fetch('/api/github/connection').then(r => r.json()).then(x => { setConnected(!!x.connected); setConnectedUser(x.username || ''); }).catch(() => {}); }, []);

  const selectedTemplate = useMemo(() => TEMPLATE_PRESETS.find(t => t.id === template) || TEMPLATE_PRESETS[0], [template]);
  const fallbackMarkdown = useMemo(() => generateMarkdown({ ...profile, theme: template }), [profile, template]);
  const markdown = generationMode === 'ai' && aiMarkdown ? aiMarkdown : fallbackMarkdown;
  const update = (key, value) => setProfile(prev => ({ ...prev, [key]: value }));

  async function importGithub() {
    const value = username.trim().replace(/^@/, '');
    if (!value || !/^[a-zA-Z0-9-]{1,39}$/.test(value)) return setQueryError('Enter a valid GitHub username.');
    setQueryLoading(true); setQueryError('');
    try {
      const res = await fetch(`/api/github/user/${encodeURIComponent(value)}`), data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || 'Could not load that GitHub profile.');
      setProfile(prev => ({ ...prev, ...data.profile, projects: data.projects || [], languages: data.languages || [], selectedTech: data.languages?.length ? data.languages.map(x => x.toLowerCase()).filter(x => TECH.includes(x)).slice(0, 8) : prev.selectedTech }));
      setUsername(data.profile.username); setAiMarkdown('');
    } catch (err) { setQueryError(err.message || 'GitHub lookup failed.'); } finally { setQueryLoading(false); }
  }

  async function generateWithAI() {
    if (!profile.username) return setAiError('Import a GitHub profile first.');
    setAiLoading(true); setAiError(''); setGenerationMode('ai');
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile, template, instructions: `Use the ${selectedTemplate.name} style. Keep it distinctive, factual and polished. Do not invent projects, roles, employers, metrics or technologies.` }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'AI generation failed.');
      setAiMarkdown(data.markdown || '');
    } catch (err) { setAiError(err.message || 'AI generation failed.'); setGenerationMode('template'); }
    finally { setAiLoading(false); }
  }

  async function copyMarkdown() { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } }
  function downloadMarkdown() { const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'README.md'; a.click(); URL.revokeObjectURL(url); }
  function applyTemplate(id) { setTemplate(id); setAiMarkdown(''); }
  function reset() { setProfile(EMPTY_PROFILE); setUsername(''); setTemplate('ronin'); setAiMarkdown(''); setGenerationMode('template'); localStorage.removeItem('gitpix_profile'); localStorage.removeItem('gitpix_template'); }
  function connectGithub() { window.location.href = '/api/github/oauth/start'; }
  async function publishGithub() {
    setPublishState('publishing');
    try { const res = await fetch('/api/github/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markdown }) }); const data = await res.json(); if (!res.ok) throw new Error(data.detail || 'Publish failed.'); setPublishState(data.url || 'published'); }
    catch (err) { setPublishState(`error:${err.message}`); }
  }
  async function disconnectGithub() { await fetch('/api/github/disconnect', { method: 'POST' }).catch(() => {}); setConnected(false); setConnectedUser(''); }

  return <div className={`gitpix-shell theme-${template}`}>
    <header className="topbar"><a className="brand" href="#top" aria-label="GitPix home"><img src="/gitpix-logo.svg" alt="GitPix" /></a><nav className="desktop-nav"><a href="#templates">Templates</a><a href="#designer">Designer</a><a href="#preview">Preview</a></nav><div className="top-actions"><a className="github-link" href="https://github.com/cser-utkarsh-raj/GitPix" target="_blank" rel="noreferrer"><Github size={15}/> Source</a>{connected ? <button className="connection-pill" onClick={disconnectGithub}><Github size={14}/> {connectedUser} <LogOut size={12}/></button> : <button className="outline-btn" onClick={connectGithub}><Github size={14}/> Connect</button>}<button className="outline-btn" onClick={reset}><RotateCcw size={14}/> Reset</button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="pulse-dot"/> GITHUB PROFILE README DESIGNER</div><h1>Turn your profile<br/><em>into a signature.</em></h1><p>Bring in your public GitHub data, choose a visual system, let AI write the Markdown or use a deterministic template, then publish it back to your profile repository.</p><div className="hero-cta"><a href="#designer" className="primary-btn">Start designing <ChevronRight size={17}/></a><a href="#templates" className="text-btn">Explore the systems</a></div><div className="hero-meta"><span>6 distinct styles</span><i/> <span>GitHub import</span><i/> <span>AI + templates</span><i/> <span>Optional publish</span></div></div><div className="hero-art" aria-hidden="true"><div className="hero-grid"/><div className="hero-sigil">GP</div><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-noise"/><div className="hero-label">GITHUB / README / 02</div></div></section>
      <section id="templates" className="section"><div className="section-head"><div><span className="section-kicker">01 / VISUAL SYSTEMS</span><h2>Six different identities.</h2></div><p>Not six color swaps. Each system changes typography, composition, palette, graphics, motion and the Markdown structure it generates.</p></div><div className="template-grid">{TEMPLATE_PRESETS.map((t, i) => <button key={t.id} className={`template-card art-${t.id} ${template === t.id ? 'selected' : ''}`} onClick={() => applyTemplate(t.id)}><div className="template-art"><span>{String(i + 1).padStart(2, '0')} / {t.label}</span><strong>{t.short}</strong><small>{t.animation}</small><div className="art-graphic"/></div><div className="template-info"><span>{t.name}</span><small>{t.description}</small><em>{t.palette} · {t.font}</em></div></button>)}</div></section>
      <section id="designer" className="section"><div className="section-head"><div><span className="section-kicker">02 / THE DESIGNER</span><h2>GitHub in. README out.</h2></div><p>Import the public profile once. GitPix turns repositories, languages, profile facts and stats into editable content.</p></div><div className="mobile-tabs"><button className={mobilePanel === 'editor' ? 'active' : ''} onClick={() => setMobilePanel('editor')}><SlidersHorizontal size={15}/> Edit</button><button className={mobilePanel === 'preview' ? 'active' : ''} onClick={() => setMobilePanel('preview')}><Eye size={15}/> Preview</button></div><div className="workbench">
        <aside className={`panel editor-panel ${mobilePanel === 'preview' ? 'mobile-hidden' : ''}`}><div className="panel-title"><div><span>1 / GITHUB PROFILE</span><small>Public data · never asks for a token</small></div><Github size={18}/></div><div className="import-row"><div className="field with-icon"><Search size={15}/><input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && importGithub()} placeholder="github username" aria-label="GitHub username"/></div><button className="square-btn" onClick={importGithub} disabled={queryLoading}>{queryLoading ? '…' : <ChevronRight size={18}/>}</button></div>{queryError && <div className="error-box">{queryError}</div>}
          <div className="profile-import-card">{profile.avatarUrl ? <img src={profile.avatarUrl} alt=""/> : <div className="avatar-placeholder">GP</div>}<div><strong>{profile.displayName || 'No profile imported'}</strong><span>@{profile.username || 'username'}</span><small>{profile.publicRepos || 0} repos · {profile.followers || 0} followers · {profile.totalStars || 0} stars</small></div></div>
          <div className="subhead">2 / CUSTOMIZE</div><div className="field"><label>Display name</label><input value={profile.displayName} onChange={e => update('displayName', e.target.value)} placeholder="Your name"/></div><div className="field"><label>Headline</label><input value={profile.title} onChange={e => update('title', e.target.value)} placeholder="Software Engineer"/></div><div className="field"><label>Tagline</label><input value={profile.tagline} onChange={e => update('tagline', e.target.value)} placeholder="What are you building?"/></div><div className="field"><label>About</label><textarea rows="3" value={profile.aboutBio} onChange={e => update('aboutBio', e.target.value)} placeholder="A short introduction..."/></div><div className="field-row"><div className="field"><label>Location</label><input value={profile.location} onChange={e => update('location', e.target.value)} placeholder="Your city"/></div><div className="field"><label>Company</label><input value={profile.company} onChange={e => update('company', e.target.value)} placeholder="Company / .dot"/></div></div><div className="field-row"><div className="field"><label>Currently building</label><input value={profile.currentWork} onChange={e => update('currentWork', e.target.value)} placeholder="A new product"/></div><div className="field"><label>Learning</label><input value={profile.learning} onChange={e => update('learning', e.target.value)} placeholder="Systems, Rust..."/></div></div><div className="field"><label>Ask me about</label><input value={profile.askMeAbout} onChange={e => update('askMeAbout', e.target.value)} placeholder="React, Python, APIs"/></div><div className="field"><label>Fun fact</label><input value={profile.funFact} onChange={e => update('funFact', e.target.value)} placeholder="Something human."/></div>
          <div className="subhead">3 / STACK</div><div className="tech-grid">{TECH.map(id => <button key={id} className={profile.selectedTech.includes(id) ? 'tech selected' : 'tech'} onClick={() => update('selectedTech', profile.selectedTech.includes(id) ? profile.selectedTech.filter(x => x !== id) : [...profile.selectedTech, id])}>{id}</button>)}</div><div className="subhead">4 / GITHUB MODULES</div><div className="toggle-grid">{[['showStatsCard','Stats'],['showTopLanguages','Languages'],['showStreakStats','Streak'],['showTrophies','Trophies'],['showVisitorCounter','Visitors']].map(([key,label]) => <label className="toggle" key={key}><input type="checkbox" checked={profile[key]} onChange={e => update(key,e.target.checked)}/><span>{label}</span></label>)}</div>
          <div className="subhead">5 / GENERATION</div><div className="generation-switch"><button className={generationMode === 'template' ? 'active' : ''} onClick={() => { setGenerationMode('template'); setAiMarkdown(''); }}><Upload size={14}/> Template</button><button className={generationMode === 'ai' ? 'active' : ''} onClick={generateWithAI} disabled={aiLoading}><Sparkles size={14}/> {aiLoading ? 'Writing…' : 'AI Generate'}</button></div>{aiError && <div className="error-box">{aiError}</div>}<p className="ai-note">AI uses your imported public data as its source of truth. Add your provider key on the server.</p>
          <div className="panel-footer"><span>Saved locally</span><button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>Change template</button></div>
        </aside>
        <section id="preview" className={`panel preview-panel ${mobilePanel === 'editor' ? 'mobile-hidden' : ''}`}><div className="preview-toolbar"><div><span>LIVE README</span><small>{selectedTemplate.name} · {generationMode === 'ai' ? 'AI generated' : 'deterministic template'}</small></div><div className="toolbar-actions"><button onClick={copyMarkdown}>{copied ? <><Check size={15}/> Copied</> : <><Copy size={15}/> Copy</>}</button><button onClick={downloadMarkdown}><Download size={15}/> Download</button>{connected && <button className="publish-btn" onClick={publishGithub} disabled={publishState === 'publishing'}><Upload size={15}/> {publishState === 'publishing' ? 'Publishing…' : 'Publish'}</button>}</div></div><div className={`readme-paper paper-${template}`}><ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown></div>{publishState && publishState !== 'publishing' && <div className={`publish-result ${publishState.startsWith('error:') ? 'error' : ''}`}>{publishState.startsWith('error:') ? publishState.slice(6) : <>Published to <a href={publishState} target="_blank" rel="noreferrer">your GitHub profile <ExternalLink size={12}/></a></>}</div>}</section>
      </div></section>
      <section className="export-strip"><div><span className="section-kicker">03 / SHIP IT</span><h2>Write it. Preview it. Publish it.</h2><p>Use the deterministic renderer when you want predictable output. Use AI when you want a more personal README. Publishing is optional.</p></div><div className="export-actions"><button className="primary-btn" onClick={generateWithAI} disabled={aiLoading}><Wand2 size={16}/> {aiLoading ? 'Writing README…' : 'Generate with AI'}</button><button className="outline-btn" onClick={copyMarkdown}>{copied ? 'Copied' : 'Copy Markdown'} <Copy size={15}/></button>{connected && <button className="outline-btn" onClick={publishGithub}><Upload size={15}/> Publish to GitHub</button>}</div></section>
    </main>
    <footer className="footer"><div><div className="brand footer-brand"><img src="/gitpix-logo.svg" alt="GitPix" /></div><p>Design your GitHub story. Built for people who care about the details.</p></div><div className="dot-footer"><span>PART OF THE</span><a href="https://github.com/cser-utkarsh-raj" target="_blank" rel="noreferrer" aria-label=".dot"><span className="dot-mark">✦</span><strong><b>.</b>dot</strong></a></div><div className="footer-links"><a href="https://github.com/cser-utkarsh-raj/GitPix" target="_blank" rel="noreferrer">GitHub</a><a href="#templates">Templates</a><a href="#designer">Designer</a></div></footer>
  </div>;
}
