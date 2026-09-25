from base64 import b64encode
from collections import defaultdict
from time import monotonic
import os
import re
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, Field

app = FastAPI(title="GitPix API", version="2.1.0", docs_url=None, redoc_url=None)
_cache = {}
_hits = defaultdict(list)
USERNAME_RE = re.compile(r"^[A-Za-z0-9-]{1,39}$")
AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
AI_PROVIDER = os.getenv("AI_PROVIDER", "openai-compatible").lower()
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "").strip()
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "").strip()

class AIGenerateRequest(BaseModel):
    profile: dict
    template: str = Field(default="ronin", max_length=32)
    instructions: str = Field(default="", max_length=2000)

class PublishRequest(BaseModel):
    markdown: str = Field(min_length=1, max_length=120000)


def rate_limit(request: Request, bucket="public", limit=30):
    ip = request.client.host if request.client else "unknown"
    key = f"{bucket}:{ip}"
    now = monotonic()
    recent = [t for t in _hits[key] if now - t < 60]
    if len(recent) >= limit:
        raise HTTPException(429, "Too many requests. Try again in a minute.")
    recent.append(now)
    _hits[key] = recent


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'"
    return response

@app.get("/api/health")
async def health(): return {"status": "ok", "service": "gitpix"}

async def fetch_github_profile(username: str):
    if not USERNAME_RE.fullmatch(username.strip()): raise HTTPException(400, "Invalid GitHub username.")
    username = username.strip()
    cached = _cache.get(username.lower())
    if cached and monotonic() - cached["at"] < 300: return cached["data"]
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "GitPix/2.1"}
    async with httpx.AsyncClient(timeout=10) as client:
        user_res = await client.get(f"https://api.github.com/users/{username}", headers=headers)
        if user_res.status_code == 404: raise HTTPException(404, "GitHub user not found.")
        if user_res.status_code == 403: raise HTTPException(429, "GitHub rate limit reached. Try again shortly.")
        user_res.raise_for_status(); user = user_res.json()
        repo_res = await client.get(f"https://api.github.com/users/{username}/repos?sort=stars&direction=desc&per_page=12&type=owner", headers=headers)
        repos = repo_res.json() if repo_res.is_success else []
    languages, seen, projects = [], set(), []; total_stars = 0
    for repo in repos:
        lang = repo.get("language")
        if lang and lang.lower() not in seen: seen.add(lang.lower()); languages.append(lang)
        total_stars += int(repo.get("stargazers_count") or 0)
        projects.append({"title": repo.get("name", ""), "name": repo.get("name", ""), "description": repo.get("description") or "Open-source project", "repoUrl": repo.get("html_url", ""), "stars": repo.get("stargazers_count", 0), "forks": repo.get("forks_count", 0), "language": lang or ""})
    data = {"profile": {"username": user.get("login", ""), "displayName": user.get("name") or user.get("login", ""), "avatarUrl": user.get("avatar_url", ""), "location": user.get("location") or "", "company": user.get("company") or "", "website": user.get("blog") or "", "twitter": user.get("twitter_username") or "", "tagline": user.get("bio") or "Building useful things and shipping them.", "aboutBio": user.get("bio") or "I enjoy turning ideas into clean, useful software.", "publicRepos": user.get("public_repos", 0), "followers": user.get("followers", 0), "following": user.get("following", 0), "totalStars": total_stars}, "projects": projects, "languages": languages}
    _cache[username.lower()] = {"at": monotonic(), "data": data}; return data

@app.get("/api/github/user/{username}")
async def github_user(username: str, request: Request): rate_limit(request); return await fetch_github_profile(username)

@app.get("/api/github/connection")
async def github_connection(request: Request):
    token = request.cookies.get("gitpix_github_token")
    if not token: return {"connected": False}
    async with httpx.AsyncClient(timeout=8) as client: res = await client.get("https://api.github.com/user", headers={"Accept": "application/vnd.github+json", "Authorization": f"Bearer {token}", "User-Agent": "GitPix/2.1"})
    if not res.is_success: return {"connected": False}
    user = res.json(); return {"connected": True, "username": user.get("login"), "name": user.get("name") or user.get("login")}

@app.get("/api/github/oauth/start")
async def github_oauth_start(request: Request):
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET: raise HTTPException(503, "GitHub publishing is not configured yet.")
    state = os.urandom(32).hex(); callback = str(request.base_url).rstrip("/") + "/api/github/oauth/callback"
    response = RedirectResponse(f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={callback}&scope=public_repo&state={state}")
    response.set_cookie("gitpix_oauth_state", state, max_age=600, httponly=True, secure=request.url.scheme == "https", samesite="lax"); return response

@app.get("/api/github/oauth/callback")
async def github_oauth_callback(request: Request, code: str = "", state: str = ""):
    expected = request.cookies.get("gitpix_oauth_state")
    if not code or not state or not expected or state != expected: raise HTTPException(400, "Invalid or expired GitHub OAuth state.")
    callback = str(request.base_url).rstrip("/") + "/api/github/oauth/callback"
    async with httpx.AsyncClient(timeout=10) as client:
        token_res = await client.post("https://github.com/login/oauth/access_token", data={"client_id": GITHUB_CLIENT_ID, "client_secret": GITHUB_CLIENT_SECRET, "code": code, "redirect_uri": callback, "state": state}, headers={"Accept": "application/json", "User-Agent": "GitPix/2.1"})
    token = token_res.json().get("access_token") if token_res.is_success else None
    if not token: raise HTTPException(502, "GitHub authorization failed.")
    response = RedirectResponse("/"); response.delete_cookie("gitpix_oauth_state"); response.set_cookie("gitpix_github_token", token, max_age=60*60*24*30, httponly=True, secure=request.url.scheme == "https", samesite="lax"); return response

@app.post("/api/github/disconnect")
async def github_disconnect(response: Request):
    result = JSONResponse({"connected": False}); result.delete_cookie("gitpix_github_token"); return result

@app.post("/api/github/publish")
async def github_publish(payload: PublishRequest, request: Request):
    rate_limit(request, "publish", 10); token = request.cookies.get("gitpix_github_token")
    if not token: raise HTTPException(401, "Connect GitHub before publishing.")
    headers = {"Accept": "application/vnd.github+json", "Authorization": f"Bearer {token}", "User-Agent": "GitPix/2.1"}
    async with httpx.AsyncClient(timeout=15) as client:
        me = await client.get("https://api.github.com/user", headers=headers)
        if not me.is_success: raise HTTPException(401, "Your GitHub connection has expired. Reconnect.")
        username = me.json().get("login"); repo_url = f"https://api.github.com/repos/{username}/{username}"; repo = await client.get(repo_url, headers=headers)
        if repo.status_code == 404:
            created = await client.post("https://api.github.com/user/repos", headers=headers, json={"name": username, "private": False, "description": "GitHub profile README published with GitPix", "auto_init": True})
            if not created.is_success: raise HTTPException(502, "Could not create the profile repository. Check your GitHub permissions.")
        elif not repo.is_success: raise HTTPException(502, "Could not access the profile repository.")
        file_url = f"{repo_url}/contents/README.md"; existing = await client.get(file_url, headers=headers)
        body = {"message": "chore: update GitHub profile README with GitPix", "content": b64encode(payload.markdown.encode("utf-8")).decode("ascii")}
        if existing.is_success: body["sha"] = existing.json().get("sha")
        elif existing.status_code != 404: raise HTTPException(502, "Could not inspect the existing profile README.")
        pushed = await client.put(file_url, headers=headers, json=body)
        if not pushed.is_success: raise HTTPException(502, "GitHub rejected the README update.")
    return {"ok": True, "username": username, "url": f"https://github.com/{username}#readme"}


def clean_ai_markdown(text: str) -> str:
    text = re.sub(r"^```(?:markdown|md)?\s*", "", text.strip(), flags=re.I); text = re.sub(r"\s*```$", "", text.strip()); text = re.sub(r"<script\b[^>]*>.*?</script>", "", text, flags=re.I | re.S); text = re.sub(r"\son\w+\s*=\s*([\"']).*?\1", "", text, flags=re.I | re.S); return text.strip()[:120000]

@app.post("/api/ai/generate")
async def ai_generate(payload: AIGenerateRequest, request: Request):
    rate_limit(request, "ai", 12)
    if not AI_API_KEY: raise HTTPException(503, "AI generation is not configured. Add AI_API_KEY to the Vercel environment variables.")
    system = "You are GitPix, a meticulous GitHub Profile README designer. Generate ONLY the final Markdown README, never a preamble, never a code fence, and never invent facts. Use the supplied public GitHub data as the source of truth. Preserve the requested visual style through headings, HTML alignment, badges, tables, spacing, and tasteful image services. Never include secrets or private data."
    prompt = f"Create a polished GitHub profile README in the {payload.template} visual system.\n\nGitHub data:\n{payload.profile}\n\nAdditional user instructions:\n{payload.instructions or 'Use your judgment, but keep it concise and distinctive.'}"
    try:
        async with httpx.AsyncClient(timeout=45) as client:
            if AI_PROVIDER == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{AI_MODEL}:generateContent?key={AI_API_KEY}"; res = await client.post(url, json={"systemInstruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.7, "maxOutputTokens": 6000}})
                if not res.is_success: raise HTTPException(502, "The AI provider rejected the request.")
                text = res.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            else:
                res = await client.post(f"{AI_BASE_URL}/chat/completions", headers={"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}, json={"model": AI_MODEL, "temperature": 0.7, "max_tokens": 6000, "messages": [{"role": "system", "content": system}, {"role": "user", "content": prompt}]})
                if not res.is_success: raise HTTPException(502, "The AI provider rejected the request.")
                text = res.json().get("choices", [{}])[0].get("message", {}).get("content", "")
    except HTTPException: raise
    except Exception as exc: raise HTTPException(502, f"AI generation failed: {exc}")
    if not text.strip(): raise HTTPException(502, "The AI provider returned an empty README.")
    return {"markdown": clean_ai_markdown(text)}
