import { TechBadge } from '../types';

export const TECH_BADGES: TechBadge[] = [
  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'languages', color: '3178C6', logo: 'typescript', badgeUrl: '' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', color: 'F7DF1E', logo: 'javascript', badgeUrl: '' },
  { id: 'python', name: 'Python', category: 'languages', color: '3776AB', logo: 'python', badgeUrl: '' },
  { id: 'cpp', name: 'C++', category: 'languages', color: '00599C', logo: 'cplusplus', badgeUrl: '' },
  { id: 'rust', name: 'Rust', category: 'languages', color: '000000', logo: 'rust', badgeUrl: '' },
  { id: 'go', name: 'Go', category: 'languages', color: '00ADD8', logo: 'go', badgeUrl: '' },
  { id: 'java', name: 'Java', category: 'languages', color: 'ED8B00', logo: 'openjdk', badgeUrl: '' },
  { id: 'csharp', name: 'C#', category: 'languages', color: '239120', logo: 'c-sharp', badgeUrl: '' },
  { id: 'php', name: 'PHP', category: 'languages', color: '777BB4', logo: 'php', badgeUrl: '' },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', color: '7F52FF', logo: 'kotlin', badgeUrl: '' },
  { id: 'swift', name: 'Swift', category: 'languages', color: 'F05138', logo: 'swift', badgeUrl: '' },
  { id: 'ruby', name: 'Ruby', category: 'languages', color: 'CC342D', logo: 'ruby', badgeUrl: '' },
  { id: 'html5', name: 'HTML5', category: 'languages', color: 'E34F26', logo: 'html5', badgeUrl: '' },
  { id: 'css3', name: 'CSS3', category: 'languages', color: '1572B6', logo: 'css3', badgeUrl: '' },

  // Frontend
  { id: 'react', name: 'React', category: 'frontend', color: '61DAFB', logo: 'react', badgeUrl: '' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '000000', logo: 'nextdotjs', badgeUrl: '' },
  { id: 'vue', name: 'Vue.js', category: 'frontend', color: '4FC08D', logo: 'vuedotjs', badgeUrl: '' },
  { id: 'nuxt', name: 'Nuxt.js', category: 'frontend', color: '00DC82', logo: 'nuxtdotjs', badgeUrl: '' },
  { id: 'angular', name: 'Angular', category: 'frontend', color: 'DD0031', logo: 'angular', badgeUrl: '' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', color: 'FF3E00', logo: 'svelte', badgeUrl: '' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', color: '06B6D4', logo: 'tailwindcss', badgeUrl: '' },
  { id: 'sass', name: 'Sass', category: 'frontend', color: 'CC6699', logo: 'sass', badgeUrl: '' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', color: '7952B3', logo: 'bootstrap', badgeUrl: '' },
  { id: 'redux', name: 'Redux', category: 'frontend', color: '764ABC', logo: 'redux', badgeUrl: '' },
  { id: 'vite', name: 'Vite', category: 'frontend', color: '646CFF', logo: 'vite', badgeUrl: '' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '339933', logo: 'nodedotjs', badgeUrl: '' },
  { id: 'express', name: 'Express.js', category: 'backend', color: '000000', logo: 'express', badgeUrl: '' },
  { id: 'nestjs', name: 'NestJS', category: 'backend', color: 'E0234E', logo: 'nestjs', badgeUrl: '' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', color: '009688', logo: 'fastapi', badgeUrl: '' },
  { id: 'django', name: 'Django', category: 'backend', color: '092E20', logo: 'django', badgeUrl: '' },
  { id: 'flask', name: 'Flask', category: 'backend', color: '000000', logo: 'flask', badgeUrl: '' },
  { id: 'spring', name: 'Spring Boot', category: 'backend', color: '6DB33F', logo: 'springboot', badgeUrl: '' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', color: 'E10098', logo: 'graphql', badgeUrl: '' },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '4169E1', logo: 'postgresql', badgeUrl: '' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '47A248', logo: 'mongodb', badgeUrl: '' },
  { id: 'mysql', name: 'MySQL', category: 'database', color: '4479A1', logo: 'mysql', badgeUrl: '' },
  { id: 'redis', name: 'Redis', category: 'database', color: 'DC382D', logo: 'redis', badgeUrl: '' },
  { id: 'supabase', name: 'Supabase', category: 'database', color: '3FCF8E', logo: 'supabase', badgeUrl: '' },
  { id: 'firebase', name: 'Firebase', category: 'database', color: 'FFCA28', logo: 'firebase', badgeUrl: '' },
  { id: 'sqlite', name: 'SQLite', category: 'database', color: '003B57', logo: 'sqlite', badgeUrl: '' },

  // DevOps & Cloud
  { id: 'docker', name: 'Docker', category: 'devops', color: '2496ED', logo: 'docker', badgeUrl: '' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', color: '326CE5', logo: 'kubernetes', badgeUrl: '' },
  { id: 'aws', name: 'AWS', category: 'devops', color: '232F3E', logo: 'amazon-aws', badgeUrl: '' },
  { id: 'gcp', name: 'Google Cloud', category: 'devops', color: '4285F4', logo: 'googlecloud', badgeUrl: '' },
  { id: 'azure', name: 'Azure', category: 'devops', color: '0089D6', logo: 'microsoftazure', badgeUrl: '' },
  { id: 'vercel', name: 'Vercel', category: 'devops', color: '000000', logo: 'vercel', badgeUrl: '' },
  { id: 'githubactions', name: 'GitHub Actions', category: 'devops', color: '2088FF', logo: 'githubactions', badgeUrl: '' },
  { id: 'linux', name: 'Linux', category: 'devops', color: 'FCC624', logo: 'linux', badgeUrl: '' },

  // AI & Machine Learning
  { id: 'pytorch', name: 'PyTorch', category: 'ai', color: 'EE4C2C', logo: 'pytorch', badgeUrl: '' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai', color: 'FF6F00', logo: 'tensorflow', badgeUrl: '' },
  { id: 'openai', name: 'OpenAI', category: 'ai', color: '412991', logo: 'openai', badgeUrl: '' },
  { id: 'huggingface', name: 'Hugging Face', category: 'ai', color: 'FFD21E', logo: 'huggingface', badgeUrl: '' },
  { id: 'scikitlearn', name: 'scikit-learn', category: 'ai', color: 'F7931E', logo: 'scikitlearn', badgeUrl: '' },

  // Tools & Testing
  { id: 'git', name: 'Git', category: 'tools', color: 'F05032', logo: 'git', badgeUrl: '' },
  { id: 'github', name: 'GitHub', category: 'tools', color: '181717', logo: 'github', badgeUrl: '' },
  { id: 'vscode', name: 'VS Code', category: 'tools', color: '007ACC', logo: 'visualstudiocode', badgeUrl: '' },
  { id: 'postman', name: 'Postman', category: 'tools', color: 'FF6C37', logo: 'postman', badgeUrl: '' },
  { id: 'figma', name: 'Figma', category: 'tools', color: 'F24E1E', logo: 'figma', badgeUrl: '' },
  { id: 'jest', name: 'Jest', category: 'tools', color: 'C21325', logo: 'jest', badgeUrl: '' },
];

export function buildBadgeUrl(badge: TechBadge, style: string = 'flat'): string {
  // Construct Shields.io badge URL
  const logoColor = badge.color === '000000' || badge.color === '181717' ? 'white' : 'white';
  return `https://img.shields.io/badge/${encodeURIComponent(badge.name)}-${badge.color}?style=${style}&logo=${badge.logo}&logoColor=${logoColor}`;
}
