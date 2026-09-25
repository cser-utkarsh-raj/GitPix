# GitPix

**GitHub Profile README Designer.**

GitPix helps developers design a polished GitHub profile README without writing the layout from scratch. Pick a visual system, import public GitHub profile data, customize the content, preview the result, and export a ready-to-use `README.md`.

## What it does

- Six visual template systems: Crimson Ronin, Terminal Ops, Bento Grid, Quiet Build, Aurora and Monochrome.
- Public GitHub profile import — no personal access token required.
- Live GitHub-Flavored Markdown preview.
- Editable profile, stack, project and GitHub-stat modules.
- Copy Markdown or download `README.md`.
- Local autosave so unfinished designs survive refreshes.
- Responsive editor for desktop and mobile.
- FastAPI proxy for GitHub API calls with validation, caching, rate limiting and security headers.

## Stack

- **Frontend:** React + JavaScript, Vite, React Markdown, Lucide
- **Backend:** Python + FastAPI + HTTPX
- **Deployment:** Render-ready configuration included

## Local development

```bash
npm install
npm run dev
```

The Vite development server runs on `http://localhost:5173`.

For the production service:

```bash
npm run build
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```

## Product principles

GitPix is intentionally focused. The core product does not require an account, database, AI API key, or GitHub write permission. GitHub data is public profile data and the generated README stays in the browser until the user copies or downloads it.

## License

MIT
