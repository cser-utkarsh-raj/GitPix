import { ProfileData } from '../types';

export const TEMPLATE_PRESETS: { id: string; name: string; description: string; data: Partial<ProfileData> }[] = [
  {
    id: 'cyberpunk-hacker',
    name: '⚡ Cyberpunk Hacker',
    description: 'Neon matrix vibes, typing SVG header, terminal stat cards, and futuristic theme.',
    data: {
      theme: 'cyberpunk',
      badgeStyle: 'for-the-badge',
      headerType: 'typing',
      displayName: 'Alex Mercer',
      title: 'Full Stack & Security Developer 🤖',
      tagline: 'Translating coffee into secure, scalable distributed systems.',
      aboutBio: '👋 Hey there! I am a passionate engineer crafting high-throughput backends, real-time web applications, and cyber tools. Big fan of open source, low-level Rust, and AI agents.',
      currentWork: 'building an AI-powered dev environment',
      currentWorkLink: 'https://github.com',
      learning: 'Distributed consensus algorithms & LLM fine-tuning',
      askMeAbout: 'TypeScript, Rust, Docker, System Architecture',
      funFact: 'I once solved a memory leak in my sleep (literally woke up with the fix).',
      typingText: [
        'Full Stack Software Engineer',
        'Open Source Enthusiast',
        'Rust & TypeScript Craftsman',
        'Building cool things for the web 🚀'
      ],
      selectedTech: ['typescript', 'rust', 'react', 'nextjs', 'nodejs', 'postgresql', 'docker', 'aws'],
      showStatsCard: true,
      showStreakStats: true,
      showTopLanguages: true,
      showTrophies: true,
      showVisitorCounter: true,
      showDevJoke: true,
      statsTheme: 'radical',
      projects: [
        {
          id: 'p1',
          title: '🔥 NeuralCode - AI Dev Engine',
          description: 'A high-performance localized AI coding assistant built with Rust & WebSockets.',
          techStack: ['Rust', 'TypeScript', 'WebSockets'],
          stars: 482,
        },
        {
          id: 'p2',
          title: '⚡ FastQuery DB',
          description: 'An in-memory key-value engine with sub-millisecond persistence.',
          techStack: ['Go', 'Docker', 'gRPC'],
          stars: 310,
        }
      ],
      socials: [
        { platform: 'github', username: 'alexmercer', url: 'https://github.com', showBadge: true },
        { platform: 'linkedin', username: 'alex-mercer-dev', url: 'https://linkedin.com', showBadge: true },
        { platform: 'twitter', username: 'alexmercer_code', url: 'https://twitter.com', showBadge: true },
      ]
    }
  },
  {
    id: 'minimalist-dev',
    name: '✨ Minimalist Engineer',
    description: 'Clean slate layout, subtle badges, focus on crisp typography and key projects.',
    data: {
      theme: 'slate',
      badgeStyle: 'flat-square',
      headerType: 'capsule',
      bannerText: 'Minimal & Focused',
      displayName: 'Elena Vance',
      title: 'Senior Frontend Architect',
      tagline: 'Designing accessible, lightning-fast web experiences.',
      aboutBio: 'Crafting thoughtful user interfaces and design systems. Obsessed with performance, clean code, and delightful web animations.',
      currentWork: 'a modern design system for enterprise apps',
      learning: 'WebGPU & Canvas Performance Optimizations',
      askMeAbout: 'React, Design Systems, Web Vitals, CSS Architecture',
      funFact: 'I collect mechanical keyboards and design custom keycaps.',
      typingText: ['Frontend Architect', 'UI/UX Specialist', 'Open Source Contributor'],
      selectedTech: ['typescript', 'react', 'nextjs', 'tailwindcss', 'vite', 'figma', 'jest'],
      showStatsCard: true,
      showStreakStats: false,
      showTopLanguages: true,
      showTrophies: false,
      showVisitorCounter: true,
      showDevJoke: false,
      statsTheme: 'slate',
      projects: [
        {
          id: 'p1',
          title: '🎨 Prism Design System',
          description: 'Accessible, dark-mode ready component library for React & Tailwind.',
          techStack: ['React', 'TypeScript', 'Tailwind CSS'],
          stars: 1250,
        }
      ],
      socials: [
        { platform: 'github', username: 'elenavance', url: 'https://github.com', showBadge: true },
        { platform: 'portfolio', username: 'elenavance.dev', url: 'https://elenavance.dev', showBadge: true },
      ]
    }
  },
  {
    id: 'tokyo-night',
    name: '🌸 Tokyo Night / Synthwave',
    description: 'Vibrant neon purple/pink aesthetics, trophies, badge grids, and fun stats.',
    data: {
      theme: 'tokyo-night',
      badgeStyle: 'flat',
      headerType: 'typing',
      displayName: 'Kaito Tanaka',
      title: 'AI & Full Stack Explorer 🌌',
      tagline: 'Bridging human imagination with artificial intelligence.',
      aboutBio: 'Full stack developer into AI, creative coding, and retro wave aesthetic. Building intelligent apps with Gemini & PyTorch.',
      currentWork: 'Autonomous AI Agents & Multimodal Interfaces',
      learning: 'AI Prompt Engineering & Computer Vision',
      askMeAbout: 'Python, PyTorch, React, Node.js',
      funFact: 'I produce lofi synthwave beats in my spare time 🎧',
      typingText: ['AI Researcher & Developer', 'Full Stack Craftsman', 'Creative Coder'],
      selectedTech: ['python', 'pytorch', 'tensorflow', 'openai', 'typescript', 'react', 'fastapi', 'postgresql'],
      showStatsCard: true,
      showStreakStats: true,
      showTopLanguages: true,
      showTrophies: true,
      showVisitorCounter: true,
      showDevJoke: true,
      statsTheme: 'tokyonight',
      projects: [
        {
          id: 'p1',
          title: '🤖 AgentSphere',
          description: 'Multi-agent orchestration platform with visual graph canvas.',
          techStack: ['Python', 'FastAPI', 'React', 'PyTorch'],
          stars: 890,
        }
      ],
      socials: [
        { platform: 'github', username: 'kaitotanaka', url: 'https://github.com', showBadge: true },
        { platform: 'discord', username: 'kaito#0001', url: 'https://discord.com', showBadge: true },
        { platform: 'twitter', username: 'kaito_ai', url: 'https://twitter.com', showBadge: true },
      ]
    }
  }
];
