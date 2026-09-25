const esc = (value = '') => String(value).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const badge = (label, color = '24292f', style = 'for-the-badge') => `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=${style}`;
const techColors = { javascript:'F7DF1E', typescript:'3178C6', python:'3776AB', react:'61DAFB', nextjs:'111111', nodejs:'5FA04E', express:'111111', fastapi:'009688', flask:'111111', java:'ED8B00', spring:'6DB33F', html:'E34F26', css:'1572B6', tailwindcss:'06B6D4', vite:'646CFF', postgresql:'4169E1', mysql:'4479A1', mongodb:'47A248', docker:'2496ED', git:'F05032', github:'181717', aws:'232F3E', azure:'0078D4', linux:'FCC624', figma:'F24E1E' };
const profileStats = data => `**${data.publicRepos ?? 0}** repositories · **${data.followers ?? 0}** followers · **${data.following ?? 0}** following · **${data.totalStars ?? 0}** stars`;
const projects = data => (data.projects || []).slice(0, 6).map(p => `- **[${esc(p.title || p.name || 'Project')}](${p.repoUrl || '#'})** — ${esc(p.description || 'Open-source project.')}${p.stars ? ` · ⭐ ${p.stars}` : ''}`).join('\n');
const tech = data => (data.selectedTech || []).slice(0, 10).map(id => `<img src="${badge(id, techColors[id] || '555555')}" alt="${id}" height="28" />`).join(' ');

export function generateMarkdown(data) {
  const name = esc(data.displayName || data.username || 'Your Name');
  const username = data.username || 'yourusername';
  const t = data.theme || 'ronin';
  const title = esc(data.title || 'Software Engineer');
  const tagline = esc(data.tagline || 'Building useful things and shipping them.');
  const about = esc(data.aboutBio || 'I enjoy turning ideas into clean, useful software.');
  const lines = [];

  if (t === 'ronin') {
    lines.push(`<div align="center">\n\n# ${name}\n## ${title}\n\n*${tagline}*\n\n`);
    if (data.avatarUrl) lines.push(`<img src="${data.avatarUrl}" width="110" alt="${name}" />\n\n`);
    lines.push(`${profileStats(data)}\n\n</div>\n\n---\n\n`);
    lines.push(`## About the builder\n\n${about}\n\n### Current chapter\n\n${data.currentWork ? `- 🔨 Building **${esc(data.currentWork)}**\n` : ''}${data.learning ? `- 🌱 Learning **${esc(data.learning)}**\n` : ''}${data.askMeAbout ? `- 💬 Ask me about **${esc(data.askMeAbout)}**\n` : ''}${data.location ? `- 📍 ${esc(data.location)}\n` : ''}\n`);
    lines.push(`## Arsenal\n\n${tech(data)}\n\n## Selected work\n\n${projects(data)}\n\n`);
  } else if (t === 'terminal') {
    lines.push(`<div align="center">\n\n<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=2600&pause=900&color=4DFF88&center=true&vCenter=true&width=760&lines=${encodeURIComponent(name)};${encodeURIComponent(title)}" alt="${name}" />\n\n</div>\n\n`);
    lines.push('```text\n$ whoami\n' + username + '\n$ cat profile.txt\n' + tagline + '\n```\n\n');
    lines.push(`## $ cat about.md\n\n${about}\n\n`);
    lines.push(`## $ ls tech/\n\n${(data.selectedTech || []).map(x => '`' + x + '`').join('  ')}\n\n`);
    lines.push(`## $ ls projects/\n\n${projects(data)}\n\n`);
    lines.push(`## $ github --stats\n\n${profileStats(data)}\n\n`);
  } else if (t === 'bento') {
    lines.push(`<div align="center">\n\n# ${name}\n**${title}** · ${tagline}\n\n</div>\n\n`);
    lines.push(`| PROFILE | GITHUB | FOCUS |\n|---|---|---|\n| ${about.replace(/\n/g, ' ')} | ${profileStats(data)} | ${esc(data.currentWork || 'Building useful software')} |\n\n`);
    lines.push(`## Stack\n\n${tech(data)}\n\n## Projects\n\n${projects(data)}\n\n`);
    if (data.showTopLanguages) lines.push(`## Languages\n\n${(data.languages || []).slice(0, 8).map(x => `\`${x}\``).join(' · ')}\n\n`);
  } else if (t === 'editorial') {
    lines.push(`<div align="center">\n\n# ${name}\n### ${title}\n\n*${tagline}*\n\n</div>\n\n> ${about}\n\n`);
    lines.push(`## I. Selected work\n\n${projects(data)}\n\n## II. Tools of the trade\n\n${tech(data)}\n\n`);
    lines.push(`## III. Notes\n\n${data.currentWork ? `**Now:** ${esc(data.currentWork)}  \n` : ''}${data.learning ? `**Learning:** ${esc(data.learning)}  \n` : ''}${data.location ? `**Based:** ${esc(data.location)}  \n` : ''}${data.funFact ? `**Off-screen:** ${esc(data.funFact)}  \n` : ''}\n`);
  } else if (t === 'neon') {
    lines.push(`<div align="center">\n\n# <code>${name}</code>\n### <code>${title}</code>\n\n<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2500&pause=700&color=8B5CF6&center=true&vCenter=true&width=700&lines=${encodeURIComponent(tagline)}" alt="tagline" />\n\n</div>\n\n`);
    lines.push(`## // ABOUT\n\n> ${about}\n\n## // STACK\n\n${tech(data)}\n\n## // PROJECTS\n\n${projects(data)}\n\n## // TELEMETRY\n\n\`repos\` ${data.publicRepos ?? 0} · \`followers\` ${data.followers ?? 0} · \`stars\` ${data.totalStars ?? 0}\n\n`);
  } else {
    lines.push(`<div align="center">\n\n# ${name}\n**${title}**\n\n_${tagline}_\n\n</div>\n\n`);
    lines.push(`## PLAYER PROFILE\n\n${about}\n\n> STATUS: ONLINE\n> \n> REPOSITORIES: ${data.publicRepos ?? 0}\n> FOLLOWERS: ${data.followers ?? 0}\n> STARS: ${data.totalStars ?? 0}\n\n`);
    lines.push(`## INVENTORY\n\n${tech(data)}\n\n## QUEST LOG\n\n${projects(data)}\n\n`);
  }

  if (data.showStatsCard || data.showTopLanguages || data.showStreakStats) {
    lines.push(`## GitHub activity\n\n<div align="center">\n`);
    if (data.showStatsCard) lines.push(`<img src="https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(username)}&show_icons=true&hide_border=true&theme=transparent" alt="GitHub stats" />\n`);
    if (data.showTopLanguages) lines.push(`<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(username)}&layout=compact&hide_border=true&theme=transparent" alt="Top languages" />\n`);
    if (data.showStreakStats) lines.push(`<img src="https://streak-stats.demolab.com?user=${encodeURIComponent(username)}&hide_border=true&theme=transparent" alt="GitHub streak" />\n`);
    lines.push('</div>\n\n');
  }
  if (data.showTrophies) lines.push(`<p align="center"><img src="https://github-profile-trophy.vercel.app/?username=${encodeURIComponent(username)}&theme=flat&no-frame=true&no-bg=true&column=6" alt="GitHub trophies" /></p>\n\n`);
  if (data.showVisitorCounter) lines.push(`<p align="center"><img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(username)}&label=PROFILE+VIEWS&color=6E56CF&style=flat-square" alt="Profile views" /></p>\n\n`);
  if (data.customMarkdown?.trim()) lines.push(`\n${data.customMarkdown.trim()}\n`);
  lines.push(`\n---\n\n<div align="center"><sub>Designed with <a href="https://github.com/cser-utkarsh-raj/GitPix">GitPix</a> · Built by <a href="https://github.com/cser-utkarsh-raj">.dot</a></sub></div>`);
  return lines.join('\n').replace(/\n{4,}/g, '\n\n\n');
}
