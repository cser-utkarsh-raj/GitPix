import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Health check API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Validate GitHub Token & Fetch User Profile
app.post('/api/github/validate-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || token.trim() === '') {
      return res.status(400).json({ error: 'GitHub Token is required' });
    }

    const cleanToken = token.trim();

    // Verify token against GitHub API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      if (userRes.status === 401) {
        return res.status(401).json({ error: 'Invalid GitHub Personal Access Token or Token Expired' });
      }
      return res.status(userRes.status).json({ error: 'Failed to authenticate with GitHub API' });
    }

    const userData = await userRes.json();
    const scopesHeader = userRes.headers.get('x-oauth-scopes') || '';

    // Fetch user public repos for language and activity context
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(userData.login)}/repos?sort=updated&per_page=12`,
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'User-Agent': 'GitHub-Profile-Studio',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    const languageCounts: Record<string, number> = {};
    const topRepos = repos.slice(0, 6).map((r: any) => {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
      return {
        name: r.name,
        description: r.description || '',
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || '',
        url: r.html_url,
      };
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    res.json({
      valid: true,
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || '',
      company: userData.company || '',
      location: userData.location || '',
      blog: userData.blog || '',
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      scopes: scopesHeader,
      topRepos,
      topLanguages,
    });
  } catch (err: any) {
    console.error('Error validating GitHub token:', err);
    res.status(500).json({ error: 'Internal server error validating token' });
  }
});

// 3. Fetch Public GitHub User Data (No token required)
app.get('/api/github/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`, {
      headers: {
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: `GitHub user "${username}" not found` });
      }
      return res.status(userRes.status).json({ error: 'Failed to fetch GitHub profile' });
    }

    const userData = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username.trim())}/repos?sort=updated&per_page=10`,
      {
        headers: {
          'User-Agent': 'GitHub-Profile-Studio',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    const languageCounts: Record<string, number> = {};
    const topRepos = repos.slice(0, 5).map((repo: any) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      return {
        name: repo.name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || '',
        url: repo.html_url,
      };
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    res.json({
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || '',
      company: userData.company || '',
      location: userData.location || '',
      blog: userData.blog || '',
      twitter: userData.twitter_username || '',
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      topRepos,
      topLanguages,
    });
  } catch (err: any) {
    console.error('Error fetching GitHub user:', err);
    res.status(500).json({ error: 'Internal server error while fetching GitHub user' });
  }
});

// 4. Push README directly to User's GitHub Repository (github.com/username/username)
app.post('/api/github/push-readme', async (req, res) => {
  try {
    const { token, markdownContent, commitMessage } = req.body;

    if (!token || !markdownContent) {
      return res.status(400).json({ error: 'Token and Markdown content are required' });
    }

    const cleanToken = token.trim();

    // Get authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      return res.status(401).json({ error: 'GitHub authentication failed. Check your token.' });
    }

    const user = await userRes.json();
    const username = user.login;
    const repoName = username;

    // Check if repository username/username exists
    let repoRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let createdNewRepo = false;

    // If repository does not exist, create it automatically!
    if (repoRes.status === 404) {
      console.log(`Repository ${username}/${repoName} not found. Creating it automatically...`);
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'User-Agent': 'GitHub-Profile-Studio',
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName,
          description: 'My GitHub Profile README - Created with AI Profile Studio',
          private: false,
          auto_init: true,
        }),
      });

      if (!createRes.ok) {
        const createErr = await createRes.json();
        return res.status(createRes.status).json({
          error: `Could not create special profile repository ${username}/${repoName}: ${createErr.message || 'Check token scope permissions (needs repo scope).'}`,
        });
      }

      createdNewRepo = true;
      // Wait a moment for GitHub to initialize default commit
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Check if README.md exists in repo to get SHA for updating
    let currentSha: string | null = null;
    const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/README.md`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      currentSha = readmeData.sha || null;
    }

    // Prepare content payload
    const base64Content = Buffer.from(markdownContent, 'utf-8').toString('base64');

    const updateBody: any = {
      message: commitMessage || 'Update GitHub Profile README via AI Profile Studio 🚀',
      content: base64Content,
    };
    if (currentSha) {
      updateBody.sha = currentSha;
    }

    // Commit file
    const putRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/README.md`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'User-Agent': 'GitHub-Profile-Studio',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateBody),
    });

    if (!putRes.ok) {
      const putErr = await putRes.json();
      return res.status(putRes.status).json({
        error: `Failed to commit README.md: ${putErr.message || 'Make sure your token has repo scope permission.'}`,
      });
    }

    const putData = await putRes.json();

    res.json({
      success: true,
      createdNewRepo,
      commitSha: putData.content?.sha || putData.commit?.sha,
      repoUrl: `https://github.com/${username}/${repoName}`,
      profileUrl: `https://github.com/${username}`,
      commitUrl: putData.commit?.html_url || `https://github.com/${username}/${repoName}`,
    });
  } catch (err: any) {
    console.error('Error pushing README to GitHub:', err);
    res.status(500).json({ error: err.message || 'Internal server error pushing to GitHub' });
  }
});

// 5. Full Gemini AI Profile README Generator
app.post('/api/ai/generate-full-readme', async (req, res) => {
  try {
    const { username, displayName, role, vibe, keySkills, currentWork, bioStyle, userContext } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is missing. Please configure GEMINI_API_KEY in server environment secrets.',
      });
    }

    const systemInstruction = `You are a world-class senior developer advocate and elite open-source designer.
Your task is to craft a breathtaking, production-quality, non-generic, high-impact GitHub Profile README markdown file.

Rules:
1. Output ONLY pure valid GitHub-Flavored Markdown. Do not wrap in backticks or markdown fence quotes.
2. Use dynamic GitHub widgets (readme-typing-svg, github-readme-stats, github-readme-streak-stats, shields.io badges).
3. Do not make up fake employers or degrees. Keep it authentic to user's real context.
4. Include clean spacing, responsive alignment tags, and sleek badge choices.`;

    const prompt = `Generate a complete, bespoke GitHub Profile README for:
- GitHub Username: ${username || 'developer'}
- Display Name: ${displayName || username || 'Developer'}
- Target Role/Title: ${role || 'Full Stack Engineer'}
- Desired Vibe/Tone: ${vibe || 'Cyberpunk Hacker'} (e.g., Cyberpunk Hacker, Senior Architect, Minimalist Engineer, Tokyo Night, Creative Hacker)
- Key Tech Stack: ${Array.isArray(keySkills) && keySkills.length > 0 ? keySkills.join(', ') : 'TypeScript, React, Node.js, Python, Docker, PostgreSQL'}
- Currently Working On: ${currentWork || 'innovative web applications & open-source projects'}
- Extra Details / Bio Context: ${userContext || 'Passionate about clean architecture, developer tools, and high-performance apps.'}

Include:
- An animated header SVG using \`readme-typing-svg\` or capsule render.
- An engaging, personalized "About Me" section with bullet points.
- Categorized Shields.io tech stack badges.
- GitHub Stats card & Top Languages widget with theme matching the vibe (e.g. \`radical\`, \`tokyonight\`, \`cyber\`, or \`slate\`).
- Featured projects showcase section.
- Connect / Socials badge section.
- A random dev joke badge or quote.

Output ONLY raw Markdown text ready to save as README.md.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    let markdown = response.text || '';
    // Clean codeblock markers if model accidentally returned markdown code fences
    markdown = markdown.replace(/^```markdown\n|^```\n/i, '').replace(/\n```$/g, '').trim();

    res.json({ markdown });
  } catch (err: any) {
    console.error('Gemini AI Full README Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate full AI profile README' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GitHub Profile Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
