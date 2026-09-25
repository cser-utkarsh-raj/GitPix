from collections import defaultdict
from pathlib import Path
from time import monotonic
import re
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
app = FastAPI(title='GitPix API', version='1.0.0', docs_url=None, redoc_url=None)
_cache = {}
_hits = defaultdict(list)
USERNAME_RE = re.compile(r'^[A-Za-z0-9-]{1,39}$')

def rate_limit(request: Request):
    ip = request.client.host if request.client else 'unknown'
    now = monotonic()
    recent = [t for t in _hits[ip] if now - t < 60]
    if len(recent) >= 30:
        raise HTTPException(429, 'Too many requests. Try again in a minute.')
    recent.append(now)
    _hits[ip] = recent

def security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    return response

@app.middleware('http')
async def headers(request: Request, call_next):
    response = await call_next(request)
    return security_headers(response)

@app.get('/api/health')
async def health():
    return {'status': 'ok'}

@app.get('/api/github/user/{username}')
async def github_user(username: str, request: Request):
    rate_limit(request)
    username = username.strip()
    if not USERNAME_RE.fullmatch(username):
        raise HTTPException(400, 'Invalid GitHub username.')
    cached = _cache.get(username.lower())
    if cached and monotonic() - cached['at'] < 300:
        return cached['data']
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'GitPix/1.0'}
    async with httpx.AsyncClient(timeout=8) as client:
        user_res = await client.get(f'https://api.github.com/users/{username}', headers=headers)
        if user_res.status_code == 404:
            raise HTTPException(404, 'GitHub user not found.')
        if user_res.status_code == 403:
            raise HTTPException(429, 'GitHub rate limit reached. Try again shortly.')
        user_res.raise_for_status()
        user = user_res.json()
        repo_res = await client.get(f'https://api.github.com/users/{username}/repos?sort=stars&direction=desc&per_page=6&type=owner', headers=headers)
        repos = repo_res.json() if repo_res.is_success else []
    languages, seen, projects = [], set(), []
    for repo in repos:
        lang = repo.get('language')
        if lang and lang.lower() not in seen:
            seen.add(lang.lower()); languages.append(lang)
        projects.append({'title': repo.get('name',''), 'name': repo.get('name',''), 'description': repo.get('description') or 'Open-source project', 'repoUrl': repo.get('html_url',''), 'stars': repo.get('stargazers_count',0)})
    data = {'profile': {'username': user.get('login',''), 'displayName': user.get('name') or user.get('login',''), 'avatarUrl': user.get('avatar_url',''), 'location': user.get('location') or '', 'company': user.get('company') or '', 'tagline': user.get('bio') or 'Building useful things and shipping them.', 'aboutBio': user.get('bio') or 'I enjoy turning ideas into clean, useful software.'}, 'projects': projects, 'languages': languages}
    _cache[username.lower()] = {'at': monotonic(), 'data': data}
    return data

if DIST.exists():
    app.mount('/assets', StaticFiles(directory=DIST / 'assets'), name='assets')

@app.get('/{full_path:path}')
async def spa(full_path: str):
    if full_path.startswith('api/'):
        raise HTTPException(404, 'Not found')
    index = DIST / 'index.html'
    if index.exists():
        return FileResponse(index)
    return JSONResponse({'error': 'Frontend build not found. Run npm run build.'}, status_code=503)
