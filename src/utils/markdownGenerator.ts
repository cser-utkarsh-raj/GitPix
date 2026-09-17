import { ProfileData } from '../types';
import { TECH_BADGES, buildBadgeUrl } from '../data/techStackData';

export function generateMarkdown(data: ProfileData): string {
  const lines: string[] = [];

  // 1. Header Banner
  if (data.headerType === 'typing' && data.typingText && data.typingText.length > 0) {
    const linesParam = data.typingText.map((t) => encodeURIComponent(t)).join(';');
    lines.push(
      `<div align="center">\n  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=${
        data.theme === 'cyberpunk' ? '00F0FF' : data.theme === 'tokyo-night' ? '7AA2F7' : '38BDF8'
      }&center=true&vCenter=true&lines=${linesParam}" alt="Typing SVG" /></a>\n</div>\n`
    );
  } else if (data.headerType === 'capsule') {
    lines.push(
      `<div align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=${encodeURIComponent(
        data.displayName || 'Welcome to my Profile!'
      )}&fontSize=42&fontColor=ffffff" alt="Header Capsule" />\n</div>\n`
    );
  } else if (data.headerType === 'banner') {
    lines.push(
      `<h1 align="center">${data.bannerText || `Hi 👋, I'm ${data.displayName}`}</h1>\n`
    );
  }

  // 2. Main Title & Tagline
  lines.push(`<h1 align="center">${data.displayName || data.username || 'Developer Profile'}</h1>`);
  if (data.title) {
    lines.push(`<h3 align="center">${data.title}</h3>`);
  }
  if (data.tagline) {
    lines.push(`<p align="center"><em>${data.tagline}</em></p>\n`);
  }

  // 3. Visitor counter & Quick badges
  if (data.showVisitorCounter && data.username) {
    lines.push(
      `<p align="center">\n  <img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(
        data.username
      )}&label=Profile%20Views&color=0e75b6&style=${data.badgeStyle}" alt="Visitor Count" />\n</p>\n`
    );
  }

  lines.push(`---`);
  lines.push(``);

  // 4. About Me Section
  lines.push(`### 🚀 About Me`);
  lines.push(``);

  if (data.aboutBio) {
    lines.push(`${data.aboutBio}\n`);
  }

  if (data.currentWork) {
    if (data.currentWorkLink) {
      lines.push(`- 🔭 Currently working on **[${data.currentWork}](${data.currentWorkLink})**`);
    } else {
      lines.push(`- 🔭 Currently working on **${data.currentWork}**`);
    }
  }

  if (data.learning) {
    lines.push(`- 🌱 Currently learning **${data.learning}**`);
  }

  if (data.askMeAbout) {
    lines.push(`- 💬 Ask me about **${data.askMeAbout}**`);
  }

  if (data.funFact) {
    lines.push(`- ⚡ Fun fact: **${data.funFact}**`);
  }

  if (data.location) {
    lines.push(`- 📍 Based in **${data.location}**`);
  }

  if (data.company) {
    lines.push(`- 💼 Working at **${data.company}**`);
  }

  lines.push(``);

  // 5. Tech Stack Section
  if (data.selectedTech && data.selectedTech.length > 0) {
    lines.push(`### 🛠️ Languages & Tools`);
    lines.push(``);
    lines.push(`<p align="left">`);

    const selectedBadgeObjs = data.selectedTech
      .map((id) => TECH_BADGES.find((b) => b.id === id))
      .filter((b): b is NonNullable<typeof b> => b !== undefined);

    selectedBadgeObjs.forEach((badge) => {
      const badgeUrl = buildBadgeUrl(badge, data.badgeStyle);
      lines.push(`  <img src="${badgeUrl}" alt="${badge.name}" />`);
    });

    lines.push(`</p>`);
    lines.push(``);
  }

  // 6. Dynamic Stats Cards & GitHub Widgets
  const hasStats =
    data.showStatsCard || data.showStreakStats || data.showTopLanguages || data.showTrophies;

  if (hasStats && data.username) {
    lines.push(`### 📊 GitHub Stats`);
    lines.push(``);

    if (data.showTrophies) {
      lines.push(
        `<p align="center">\n  <a href="https://github.com/ryo-ma/github-profile-trophy"><img src="https://github-profile-trophy.vercel.app/?username=${encodeURIComponent(
          data.username
        )}&theme=${data.statsTheme}&no-frame=true&column=6" alt="${data.username} Trophies" /></a>\n</p>\n`
      );
    }

    lines.push(`<p align="center">`);
    if (data.showStatsCard) {
      lines.push(
        `  <img src="https://github-readme-stats.vercel.app/api?username=${encodeURIComponent(
          data.username
        )}&show_icons=true&theme=${data.statsTheme}&count_private=true" alt="${
          data.username
        }'s GitHub stats" />`
      );
    }

    if (data.showTopLanguages) {
      lines.push(
        `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${encodeURIComponent(
          data.username
        )}&layout=compact&theme=${data.statsTheme}" alt="Top Languages" />`
      );
    }

    if (data.showStreakStats) {
      lines.push(
        `  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${encodeURIComponent(
          data.username
        )}&theme=${data.statsTheme}" alt="GitHub Streak" />`
      );
    }
    lines.push(`</p>`);
    lines.push(``);
  }

  // 7. Featured Projects / Repositories
  if (data.projects && data.projects.length > 0) {
    lines.push(`### 🌟 Featured Projects`);
    lines.push(``);

    data.projects.forEach((proj) => {
      lines.push(`#### [${proj.title}](${proj.demoUrl || proj.repoUrl || '#'})`);
      lines.push(`${proj.description}`);
      if (proj.techStack && proj.techStack.length > 0) {
        lines.push(`*Built with: ${proj.techStack.join(', ')}*`);
      }
      lines.push(``);
    });
  }

  // 8. Custom Markdown Block
  if (data.customMarkdown && data.customMarkdown.trim() !== '') {
    lines.push(data.customMarkdown.trim());
    lines.push(``);
  }

  // 9. Dev Joke
  if (data.showDevJoke) {
    lines.push(`### 💡 Random Dev Joke`);
    lines.push(``);
    lines.push(
      `![Jokes Card](https://readme-jokes-five.vercel.app/api?theme=dark&bg_color=0D1117&color=58A6FF&line_color=C9D1D9)`
    );
    lines.push(``);
  }

  // 10. Buy me a coffee
  if (data.coffeeUsername) {
    lines.push(
      `<p align="center">\n  <a href="https://www.buymeacoffee.com/${encodeURIComponent(
        data.coffeeUsername
      )}"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>\n</p>\n`
    );
  }

  // 11. Socials & Connect
  const activeSocials = data.socials ? data.socials.filter((s) => s.url && s.url.trim() !== '') : [];
  if (activeSocials.length > 0) {
    lines.push(`### 📬 Connect with Me`);
    lines.push(``);
    lines.push(`<p align="left">`);

    activeSocials.forEach((social) => {
      let icon = social.platform;
      let color = '181717';
      if (social.platform === 'linkedin') color = '0A66C2';
      if (social.platform === 'twitter') color = '1DA1F2';
      if (social.platform === 'discord') color = '5865F2';
      if (social.platform === 'youtube') color = 'FF0000';
      if (social.platform === 'medium') color = '000000';
      if (social.platform === 'devto') color = '0A0A0A';

      lines.push(
        `  <a href="${social.url}" target="_blank">\n    <img src="https://img.shields.io/badge/${encodeURIComponent(
          social.platform.toUpperCase()
        )}-${color}?style=${data.badgeStyle}&logo=${icon}&logoColor=white" alt="${
          social.platform
        }" />\n  </a>`
      );
    });

    lines.push(`</p>`);
    lines.push(``);
  }

  // Footer attribution / Sync note
  lines.push(`---`);
  lines.push(
    `<p align="center">✨ Generated with <a href="https://github.com">GitHub Profile Studio</a></p>`
  );

  return lines.join('\n');
}
