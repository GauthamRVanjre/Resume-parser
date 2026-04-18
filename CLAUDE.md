# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResumeIQ — an ATS (Applicant Tracking System) score analyzer. Users upload a PDF resume, paste a job description, and receive an AI-generated score and improvement suggestions.

Two backend implementations of the same API:
- `backend/` — Python/FastAPI (original)
- `express-backend/` — Node.js/Express (port, active development)

Both connect to the same Supabase table (`users_resume`) and the same Hugging Face AI model.

## Running the Project

### Frontend (React + Vite)
```bash
cd frontend
npm run dev     # dev server on :5173 — proxies /api/* to localhost:3000
npm run build   # tsc -b && vite build
npm run lint    # eslint
```

### Express (Node.js) — primary backend
```bash
cd express-backend
node index.js          # or: npm start  (port 3000)
```

### FastAPI (Python) — reference backend
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

## Environment Variables

### Express backend — `express-backend/.env`
```
SUPABASE_URL=
SUPABASE_KEY=
HUGGINGFACE_API_TOKEN=
SUPABASE_JWT_SECRET=
PORT=3000
```

### Frontend — `frontend/.env`
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## API Routes

All routes require `Authorization: Bearer <supabase_jwt>`. `user_id` is derived from the JWT on the backend — it is **not** passed in the request body.

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/upload-resume` | `multipart/form-data`: `file` (PDF) | First-time upload |
| POST | `/replace-resume` | `multipart/form-data`: `file` (PDF) | Replace existing resume |
| POST | `/analyze-resume` | JSON: `{ job_description }` | ATS analysis |

## Authentication Flow

**Frontend:** Supabase JS SDK (`@supabase/supabase-js`) handles auth in `context/AuthContext.tsx`. It exposes `session`, `signIn`, `signUp`, `signOut`. `signUp` auto-signs the user in, which requires email confirmation to be **disabled** in the Supabase dashboard.

**API calls:** `services/api.ts` reads the JWT from the Supabase session and sends it as `Authorization: Bearer <token>`. The `user_id` field is never sent — the backend always derives it from the token.

**Backend:** `middleware/auth.js` verifies the JWT using `SUPABASE_JWT_SECRET` (HS256), then sets `req.userId = decoded.sub`. This middleware is applied to all three routes in `index.js` before multer or the route handler.

**Routing:** `App.tsx` wraps routes in `AuthProvider → BrowserRouter`. A `ProtectedRoute` component checks for an active session and redirects unauthenticated users to `/login`. It renders a blank screen during the initial session load to prevent flash.

## Frontend Architecture

**`lib/supabaseClient.ts`** — creates the Supabase client using `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

**`services/api.ts`** — three functions: `uploadResume`, `replaceResume`, `analyzeResume`. Upload auto-retries with `/replace-resume` if the backend returns 400 "already exists". All functions read the JWT from the caller and attach it to the `Authorization` header.

**`pages/AnalyzePage.tsx`** — main UI: left column has `UploadResumeCard` + `JobDescriptionCard` + analyze button; right column shows `AtsScoreCard`, `KeywordMatchCard`, `PriorityImprovementsCard`.

**`pages/LoginPage.tsx`** — sign-in / sign-up tabs using `AuthContext`.

**Vite proxy:** Requests to `/api/*` are rewritten (strip `/api`) and forwarded to `http://localhost:3000`, so the frontend never makes cross-origin calls during development.

## Express Backend Architecture

**Entry point:** `index.js` — creates the Express app, applies `authMiddleware` globally, registers multer per file-upload route, mounts all route handlers from `routes/resumeRoutes.js`.

**Multer** is configured with `memoryStorage()` so uploaded PDFs stay in RAM as `req.file.buffer` — never written to disk. It is applied per-route in `index.js`, not inside the route handlers.

**Route handlers** (`routes/resumeRoutes.js`) are plain `async function`s. All three routes (`uploadResume`, `replaceResume`, `analyzeResume`) live in one file.

**Services:**
- `pdfExtractor.js` — uses `pdf-parse` v2 class API: `new PDFParse({ data: buffer })` then `.getText()`. Note: v2 is a complete rewrite of v1; the old `pdfParse(buffer)` call no longer works.
- `supabaseClient.js` — raw Supabase REST calls via native `fetch`. Three functions: `saveResume` (POST), `getResume` (GET), `updateResume` (PATCH).
- `huggingfaceService.js` — calls HF router (`meta-llama/Llama-3.3-70B-Instruct`) using OpenAI-compatible chat completions format via native `fetch`. Uses `AbortSignal.timeout(60000)` for the 60s timeout.

**Module system:** ES modules throughout (`"type": "module"` in `package.json`). All imports use `import`/`export` syntax with `.js` extensions.

## Architecture — Request Flow

**Upload/Replace:**
`Authorization` header → `authMiddleware` sets `req.userId` → multer parses `req.file.buffer` → `PDFParse` extracts text → Supabase REST saves/updates row

**Analyze:**
`Authorization` header → `authMiddleware` → fetch resume text from Supabase by `req.userId` → send to HF AI → extract JSON substring (find first `{` / last `}`) → return `ats_score`, `summary`, `suggestions`, `missing_skills`

## Supabase Integration

Direct REST API (no SDK on the backend). All calls hit `{SUPABASE_URL}/rest/v1/users_resume` with `apikey` and `Authorization: Bearer` headers. `user_id` is the lookup key (`eq.{user_id}` filter param).
