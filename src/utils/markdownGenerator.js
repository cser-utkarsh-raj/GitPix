const esc = (value='') => String(value).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const badge = (label, color='24292f', style='flat-square') => `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=${style}`;
const techColors = { javascript:'F7DF1E', typescript:'3178C6', python:'3776AB', react:'61DAFB', nextjs:'000000', nodejs:'5FA04E', express:'000000', fastapi:'009688', flask:'000000', java:'ED8B00', spring:'6DB33F', html:'E34F26', css:'1572B6', tailwindcss:'06B6D4', vite:'646CFF', postgresql:'4169E1', mysql:'4479A1', mongodb:'47A248', docker:'2496ED', git:'F05032', github:'181717', aws:'232F3E', azure:'0078D4', linux:'FCC624', figma:'F24E1E' };

export function generateMarkdown(data) {
  const name = esc(data.displayName || data.username || 'Your Name');
  const username = data.username || 'yourusername';
  const t = data.theme || 'samurai';
  const lines = [];
  if (t === 'samurai') lines.push(`<div align="center">\n\n# ${name}\n### ${esc(data.title || 'Software Engineer')}\n\n${data.tagline ? `*${esc(data.tagline)}*` : ''}\n\n`);
  else if (t === 'terminal') lines.push(`<div align="center">\n\n<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=2800&pause=900&color=8DF6A7&center=true&vCenter=true&width=700&lines=${encodeURIComponent(data.title || 'Software Engineer')};${encodeURIComponent(data.tagline || 'Building useful things.') }" alt="Typing header" />\n\n`);
  else if (t === 'bento') lines.push(`<div align="center">\n\n# ${name}\n**${esc(data.title || 'Software Engineer')}**\n\n${data.tagline ? esc(data.tagline) : ''}\n\n`);
  else lines.push(`<div align="center">\n\n# ${name}\n### ${esc(data.title || 'Software Engineer')}\n\n${data.tagline ? `*${esc(data.tagline)}*` : ''}\n\n`);
  if (data.showVisitorCounter) lines.push(`<img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(username)}&label=PROFILE+VIEWS&color=ff5a67&style=flat-square" alt="Profile views" />\n`);
  lines.push(`</div>\n\n---\n`);
  if (data.aboutBio || data.location || data.company || data.currentWork || data.learning || data.askMeAbout || data.funFact) {
    lines.push(`## ${t==='terminal' ? '$ cat about.md' : 'About'}\n\n${data.aboutBio ? `${esc(data.aboutBio)}\n\n` : ''}`);
    if (data.currentWork) lines.push(`- 🔭 Building **${esc(data.currentWork)}**${data.currentWorkLink ? ` ([link](${data.currentWorkLink}))` : ''}`);
    if (data.learning) lines.push(`- 🌱 Learning **${esc(data.learning)}**`);
    if (data.askMeAbout) lines.push(`- 💬 Ask me about **${esc(data.askMeAbout)}**`);
    if (data.location) lines.push(`- 📍 ${esc(data.location)}`);
    if (data.company) lines.push(`- 💼 ${esc(data.company)}`);
    if (data.funFact) lines.push(`- ⚡ ${esc(data.funFact)}`);
    lines.push('');
  }
  if (data.selectedTech?.length) {
    lines.push(`## ${t==='terminal' ? '$ ls tech/' : 'Stack'}\n\n`);
    lines.push(data.selectedTech.map(id => `<img src="${badge(id, techColors[id] || '555555', data.badgeStyle || 'flat-square')}" alt="${id}" />`).join(' '));
    lines.push('\n');
  }
  if (data.projects?.length) {
    lines.push(`## ${t==='terminal' ? '$ ls projects/' : 'Selected work'}\n\n`);
    data.projects.slice(0,6).forEach(p => lines.push(`### ${p.repoUrl ? `[${esc(p.title || p.name)}](${p.repoUrl})` : esc(p.title || p.name)}\n${esc(p.description || '')}\n\n`));
  }
  const stats = [];
  if (data.showStatsCard) stats.push(`<img src="https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(username)}&show_icons=true&hide_border=true&theme=transparent" alt="GitHub stats" />`);
  if (data.showTopLanguages) stats.push(`<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(username)}&layout=compact&hide_border=true&theme=transparent" alt="Top languages" />`);
  if (stats.length || data.showStreakStats) lines.push(`## GitHub activity\n\n<div align="center">\n${stats.join('\n')}\n${data.showStreakStats ? `<img src="https://streak-stats.demolab.com?user=${encodeURIComponent(username)}&hide_border=true&theme=transparent" alt="GitHub streak" />` : ''}\n</div>\n`);
  if (data.showTrophies) lines.push(`<p align="center"><img src="https://github-profile-trophy.vercel.app/?username=${encodeURIComponent(username)}&theme=flat&no-frame=true&no-bg=true&column=6" alt="GitHub trophies" /></p>\n`);
  if (data.socials?.length) lines.push(`## Connect\n\n${data.socials.filter(s=>s.url).map(s=>`[${esc(s.platform)}](${s.url})`).join(' · ')}\n`);
  if (data.customMarkdown?.trim()) lines.push(`\n${data.customMarkdown.trim()}\n`);
  lines.push(`\n---\n\n<div align="center">Designed with <a href="https://github.com/cser-utkarsh-raj/GitPix">GitPix</a>.</div>`);
  return lines.join('\n').replace(/\n{4,}/g,'\n\n\n');
}
