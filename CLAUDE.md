# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResumeIQ — an ATS (Applicant Tracking System) score analyzer. Users upload a PDF resume, paste a job description, and receive an AI-generated score and improvement suggestions.

Two backend implementations of the same API:
- `backend/` — Python/FastAPI (original, reference only)
- `express-backend/` — Node.js/Express (active development)

Both connect to the same Supabase table (`users_resume`) and the same Hugging Face AI model.

## Running the Project

### Express backend (Node.js) — primary
```bash
cd express-backend
node index.js          # or: npm start
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev            # starts on http://localhost:5173
npm run build          # tsc + vite build
npm run lint           # eslint
```

### FastAPI backend (Python) — reference only
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

## Environment Variables

### `express-backend/.env`
```
SUPABASE_URL=
SUPABASE_KEY=            # service role key (for backend REST calls)
SUPABASE_JWT_SECRET=     # from Supabase Dashboard → Project Settings → API → "JWT Secret"
HUGGINGFACE_API_TOKEN=
```
> `SUPABASE_JWT_SECRET` must be the long random string from Supabase — NOT an `eyJ...` key.

### `frontend/.env`
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## API Routes

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/upload-resume` | JWT required | `multipart/form-data`: `file` (PDF) | First-time upload |
| POST | `/replace-resume` | JWT required | `multipart/form-data`: `file` (PDF) | Replace existing resume |
| POST | `/analyze-resume` | JWT required | JSON: `{ job_description }` | ATS analysis for Google users |
| POST | `/analyze-guest` | None | `multipart/form-data`: `file`, `job_description`, `guest_id` | One-shot analysis, no DB write |

`user_id` is **never** sent in the request body for protected routes — it is derived from `decoded.sub` in the JWT by `authMiddleware`.

## Authentication Flow

**Google users:** Supabase OAuth (`signInWithOAuth`) → Supabase issues a JWT → frontend stores session → `Authorization: Bearer <token>` header on every API call → `authMiddleware` verifies with `SUPABASE_JWT_SECRET` (HS256) → sets `req.userId = decoded.sub`.

**Guest users:** Frontend generates `crypto.randomUUID()` on "Continue as Guest" click, stores it in `localStorage` under key `guest_id`. Guest calls go to `/analyze-guest` which skips `authMiddleware` entirely — resume is never written to Supabase.

**`ProtectedRoute`** in `App.tsx` allows access if `session` (Google) **or** `isGuest` is truthy; redirects to `/login` otherwise.

## Express Backend Architecture

**Entry point:** `index.js` — registers `authMiddleware` and multer per-route, then mounts handlers from `routes/resumeRoutes.js`. Auth runs before multer so a rejected token never allocates a file buffer.

**Services:**
- `services/pdfExtractor.js` — pdf-parse v2 class API: `new PDFParse({ data: buffer })` then `.getText()`. The old `pdfParse(buffer)` v1 call does not work.
- `services/supabaseClient.js` — raw Supabase REST via native `fetch`. Functions: `saveResume`, `getResume`, `updateResume`.
- `services/huggingfaceService.js` — OpenAI-compatible chat completions to `meta-llama/Llama-3.3-70B-Instruct`. Uses `AbortSignal.timeout(60000)`.
- `services/analyticsService.js` — fire-and-forget POST to `analytics` Supabase table. Errors are swallowed so analytics never break the main response.

**Module system:** ES modules throughout (`"type": "module"`). All imports use `.js` extensions.

## Request Flow

**Upload/Replace (Google users):**
`multipart/form-data` → `authMiddleware` sets `req.userId` → multer puts PDF in `req.file.buffer` → `PDFParse` extracts text → Supabase REST saves/updates row → analytics logged

**Analyze (Google users):**
JSON body → fetch resume text from Supabase → HuggingFace LLM → extract JSON substring (first `{` to last `}`) → return `ats_score`, `summary`, `suggestions`, `missing_skills` → analytics logged

**Analyze (guest):**
`multipart/form-data` (no auth) → multer → `PDFParse` extracts text in memory → HuggingFace LLM → return analysis (no DB write) → analytics logged with `user_type: "guest"`

## Frontend Architecture

**Vite proxy:** All `/api/*` requests in dev are proxied to `http://localhost:3000` with the `/api` prefix stripped — defined in `vite.config.ts`. `api.ts` uses `const BASE = "/api"`.

**`api.ts` auto-retry:** `uploadResume` catches a 400 "already exists" error and automatically retries with `/replace-resume`.

**`AuthContext`** (`context/AuthContext.tsx`) exposes: `session`, `loading`, `isGuest`, `guestId`, `signInWithGoogle`, `continueAsGuest`, `signOut`. `isGuest` is `guestId !== null && session === null`.

## Supabase Tables

- `users_resume` — `user_id` (UUID), `resume_text`, `filename`. Lookup key: `user_id`.
- `analytics` — `id`, `user_type` (`'google'|'guest'`), `user_id` (UUID or guest UUID string), `action` (`'upload_resume'|'analyze'`), `created_at`. No FK constraint on `user_id`.
