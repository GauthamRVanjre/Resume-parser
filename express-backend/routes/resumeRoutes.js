// routes/resumeRoutes.js
// Handles: POST /upload-resume, POST /replace-resume, POST /analyze-resume, POST /analyze-guest
// For authenticated routes, user_id comes from req.userId (set by authMiddleware via JWT).
// /analyze-guest requires no auth — file + job_description + guest_id in multipart body.

import { extractTextFromPdf } from "../services/pdfExtractor.js";
import { saveResume, getResume, updateResume } from "../services/supabaseClient.js";
import { analyzeResume as callHuggingFace } from "../services/huggingfaceService.js";
import { logAction } from "../services/analyticsService.js";

// ── UPLOAD RESUME (First time) ────────────────────────────────────────────────
export async function uploadResume(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const existing = await getResume(req.userId);
  if (existing) {
    return res.status(400).json({
      error: "Resume already exists. Use /replace-resume instead.",
    });
  }

  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch {
    return res.status(400).json({ error: "Could not read PDF file." });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Could not extract text from PDF. Is it a valid resume?",
    });
  }

  await saveResume(req.userId, resumeText, req.file.originalname);
  logAction(req.userId, "google", "upload_resume");

  return res.json({
    status: "success",
    message: "Resume uploaded and saved.",
    filename: req.file.originalname,
    text_length: resumeText.length,
  });
}

// ── REPLACE RESUME ────────────────────────────────────────────────────────────
export async function replaceResume(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const existing = await getResume(req.userId);
  if (!existing) {
    return res.status(404).json({
      error: "No existing resume found. Use /upload-resume first.",
    });
  }

  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch {
    return res.status(400).json({ error: "Could not read PDF file." });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Could not extract text from PDF. Is it a valid resume?",
    });
  }

  await updateResume(req.userId, resumeText, req.file.originalname);

  return res.json({
    status: "success",
    message: "Resume replaced successfully.",
    filename: req.file.originalname,
    text_length: resumeText.length,
  });
}

// ── ANALYZE RESUME (authenticated) ───────────────────────────────────────────
export async function analyzeResume(req, res) {
  const { job_description } = req.body;

  if (!job_description) {
    return res.status(400).json({ error: "job_description is required" });
  }

  const resumeData = await getResume(req.userId);
  if (!resumeData) {
    return res.status(404).json({
      error: "No resume found. Please upload a resume first.",
    });
  }

  const aiResponse = await callHuggingFace(resumeData.resume_text, job_description);
  logAction(req.userId, "google", "analyze");

  return parseAndRespond(res, aiResponse);
}

// ── ANALYZE GUEST (no auth, no DB save) ──────────────────────────────────────
// Accepts multipart/form-data: file (PDF), job_description (text), guest_id (text)
export async function analyzeGuest(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { job_description, guest_id } = req.body;

  if (!job_description) {
    return res.status(400).json({ error: "job_description is required" });
  }

  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch {
    return res.status(400).json({ error: "Could not read PDF file." });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Could not extract text from PDF. Is it a valid resume?",
    });
  }

  const aiResponse = await callHuggingFace(resumeText, job_description);
  logAction(guest_id ?? null, "guest", "analyze");

  return parseAndRespond(res, aiResponse);
}

// ── shared response helper ────────────────────────────────────────────────────
function parseAndRespond(res, aiResponse) {
  try {
    const responseStr = String(aiResponse);
    const start = responseStr.indexOf("{");
    const end = responseStr.lastIndexOf("}") + 1;

    if (start !== -1 && end > start) {
      const parsed = JSON.parse(responseStr.slice(start, end));
      return res.json({ status: "success", analysis: parsed });
    }

    return res.json({
      status: "success",
      analysis: { raw_response: responseStr, note: "AI response was not in expected format" },
    });
  } catch (err) {
    console.error("AI response parse error:", err);
    return res.json({
      status: "success",
      analysis: { raw_response: String(aiResponse), note: "Could not parse AI response as JSON" },
    });
  }
}
