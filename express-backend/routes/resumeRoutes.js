// routes/resumeRoutes.js
// Handles: POST /upload-resume, POST /replace-resume, POST /analyze-resume
// user_id is no longer read from req.body — it comes from req.userId,
// which is set by authMiddleware after verifying the Supabase JWT.

import { extractTextFromPdf } from "../services/pdfExtractor.js";
import { saveResume, getResume, updateResume } from "../services/supabaseClient.js";
import { analyzeResume as callHuggingFace } from "../services/huggingfaceService.js";

// ── UPLOAD RESUME (First time) ────────────────────────────────────────────────
export async function uploadResume(req, res) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Reject if a resume already exists for this user
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

// ── ANALYZE RESUME ────────────────────────────────────────────────────────────
// Expects JSON body: { job_description }  (user_id comes from req.userId via JWT)
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
