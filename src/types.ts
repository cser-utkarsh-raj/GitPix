export type ThemeStyle = 
  | 'github-dark'
  | 'cyberpunk'
  | 'tokyo-night'
  | 'dracula'
  | 'nord'
  | 'synthwave'
  | 'slate'
  | 'emerald-hacker';

export type BadgeStyle = 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';

export interface TechBadge {
  id: string;
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'tools';
  badgeUrl: string;
  color: string;
  logo: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  description: string;
  repoName?: string;
  repoUrl?: string;
  demoUrl?: string;
  techStack: string[];
  stars?: number;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'portfolio' | 'email' | 'discord' | 'youtube' | 'medium' | 'devto';
  url: string;
  username: string;
  showBadge: boolean;
}

export interface ProfileData {
  username: string;
  displayName: string;
  title: string;
  avatarUrl: string;
  location: string;
  company: string;
  tagline: string;
  aboutBio: string;
  
  // Working status
  currentWork: string;
  currentWorkLink: string;
  learning: string;
  askMeAbout: string;
  funFact: string;

  // Customization
  theme: ThemeStyle;
  badgeStyle: BadgeStyle;
  headerType: 'typing' | 'capsule' | 'minimal' | 'banner';
  bannerText: string;
  typingText: string[];

  // Tech stack
  selectedTech: string[];

  // Dynamic widgets
  showStatsCard: boolean;
  showStreakStats: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  showVisitorCounter: boolean;
  showDevJoke: boolean;
  showSpotify: boolean;
  statsTheme: string;

  // Repos / projects
  projects: ProjectShowcase[];

  // Social links
  socials: SocialLink[];

  // Custom markdown sections
  customMarkdown: string;

  // Buy me a coffee
  coffeeUsername: string;
}
