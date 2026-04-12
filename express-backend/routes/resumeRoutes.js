// routes/resumeRoutes.js
// Handles: POST /upload-resume, POST /replace-resume, POST /analyze-resume
// Port of: backend/routes/resume.py + backend/routes/analyze.py

import { extractTextFromPdf } from "../services/pdfExtractor.js";
import { saveResume, getResume, updateResume } from "../services/supabaseClient.js";
import { analyzeResume as callHuggingFace } from "../services/huggingfaceService.js";

// ── UPLOAD RESUME (First time) ───────────────────────
export async function uploadResume(req, res) {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id is required" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Step 1: Reject if resume already exists
  const existing = await getResume(user_id);
  if (existing) {
    return res.status(400).json({
      error: "Resume already exists. Use /replace-resume instead.",
    });
  }

  // Step 2: Extract text from PDF buffer (req.file.buffer comes from multer)
  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch (err) {
    return res.status(400).json({ error: "Could not read PDF file." });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Could not extract text from PDF. Is it a valid resume?",
    });
  }

  // Step 3: Save to Supabase
  const result = await saveResume(user_id, resumeText, req.file.originalname);

  return res.json({
    status: "success",
    message: "Resume uploaded and saved.",
    filename: req.file.originalname,
    text_length: resumeText.length,
  });
}

// ── REPLACE RESUME ───────────────────────────────────
export async function replaceResume(req, res) {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id is required" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Step 1: Must have an existing resume to replace
  const existing = await getResume(user_id);
  if (!existing) {
    return res.status(404).json({
      error: "No existing resume found. Use /upload-resume first.",
    });
  }

  // Step 2: Extract text from new PDF
  let resumeText;
  try {
    resumeText = await extractTextFromPdf(req.file.buffer);
  } catch (err) {
    return res.status(400).json({ error: "Could not read PDF file." });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    return res.status(400).json({
      error: "Could not extract text from PDF. Is it a valid resume?",
    });
  }

  // Step 3: Update existing row in Supabase
  const result = await updateResume(user_id, resumeText, req.file.originalname);

  return res.json({
    status: "success",
    message: "Resume replaced successfully.",
    filename: req.file.originalname,
    text_length: resumeText.length,
  });
}

// ── ANALYZE RESUME ───────────────────────────────────
// Expects JSON body: { user_id, job_description }
export async function analyzeResume(req, res) {
  const { user_id, job_description } = req.body;

  if (!user_id || !job_description) {
    return res.status(400).json({ error: "user_id and job_description are required" });
  }

  // Step 1: Fetch user's resume from Supabase
  const resumeData = await getResume(user_id);
  if (!resumeData) {
    return res.status(404).json({
      error: "No resume found. Please upload a resume first.",
    });
  }

  // Step 2: Send resume + JD to Hugging Face AI
  const aiResponse = await callHuggingFace(resumeData.resume_text, job_description);

  // Step 3: Parse the AI response (model may return extra text around the JSON)
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
