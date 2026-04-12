# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResumeIQ — an ATS (Applicant Tracking System) score analyzer. Users upload a PDF resume, paste a job description, and receive an AI-generated score and improvement suggestions.

Two backend implementations of the same API:
- `backend/` — Python/FastAPI (original)
- `express-backend/` — Node.js/Express (port, active development)

Both connect to the same Supabase table (`users_resume`) and the same Hugging Face AI model.

## Running the Backends

### Express (Node.js) — primary
```bash
cd express-backend
node index.js          # or: npm start
```

### FastAPI (Python) — reference
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

## Environment Variables

Both backends require a `.env` file with:
```
SUPABASE_URL=
SUPABASE_KEY=
HUGGINGFACE_API_TOKEN=
```

## API Routes

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/upload-resume` | `multipart/form-data`: `file` (PDF), `user_id` | First-time upload |
| POST | `/replace-resume` | `multipart/form-data`: `file` (PDF), `user_id` | Replace existing resume |
| POST | `/analyze-resume` | JSON: `{ user_id, job_description }` | ATS analysis |

## Express Backend Architecture

**Entry point:** `index.js` — creates the Express app, registers multer middleware for file routes, mounts all route handlers from `routes/resumeRoutes.js`.

**Multer** is configured with `memoryStorage()` so uploaded PDFs stay in RAM as `req.file.buffer` — never written to disk. It is applied per-route in `index.js`, not inside the route handlers.

**Route handlers** (`routes/resumeRoutes.js`) are plain `async function`s. All three routes (`uploadResume`, `replaceResume`, `analyzeResume`) live in one file.

**Services:**
- `pdfExtractor.js` — uses `pdf-parse` v2 class API: `new PDFParse({ data: buffer })` then `.getText()`. Note: v2 is a complete rewrite of v1; the old `pdfParse(buffer)` call no longer works.
- `supabaseClient.js` — raw Supabase REST calls via native `fetch`. Three functions: `saveResume` (POST), `getResume` (GET), `updateResume` (PATCH).
- `huggingfaceService.js` — calls HF router (`meta-llama/Llama-3.3-70B-Instruct`) using OpenAI-compatible chat completions format via native `fetch`. Uses `AbortSignal.timeout(60000)` for the 60s timeout.

**Module system:** ES modules throughout (`"type": "module"` in `package.json`). All imports use `import`/`export` syntax with `.js` extensions.

## Architecture — Request Flow

**Upload/Replace:**
`multipart/form-data` → multer parses `req.file.buffer` → `PDFParse` extracts text → Supabase REST saves/updates row

**Analyze:**
JSON body → fetch resume text from Supabase → send to HF AI → extract JSON substring (find first `{` / last `}`) → return `ats_score`, `summary`, `suggestions`, `missing_skills`

## Supabase Integration

Direct REST API (no SDK). All calls hit `{SUPABASE_URL}/rest/v1/users_resume` with `apikey` and `Authorization: Bearer` headers. `user_id` is the lookup key (`eq.{user_id}` filter param).
