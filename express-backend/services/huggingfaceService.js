// services/huggingfaceService.js
// Sends resume + job description to Hugging Face AI for ATS analysis
// Port of: backend/services/huggingface_service.py

import * as dotenv from "dotenv";
dotenv.config();

const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const API_URL = "https://router.huggingface.co/v1/chat/completions";

const HEADERS = {
  Authorization: `Bearer ${HF_API_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * Sends resume + job description to AI model
 * Returns: ATS score + suggestions (raw string from model)
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<string|object>}
 */
async function analyzeResume(resumeText, jobDescription) {
  const payload = {
    model: "meta-llama/Llama-3.3-70B-Instruct",
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS (Applicant Tracking System) analyzer. " +
          "You compare resumes against job descriptions and provide " +
          "detailed scoring and improvement suggestions. " +
          "Always respond ONLY in valid JSON format with no extra text.",
      },
      {
        role: "user",
        content: `Compare this resume against the job description.

Return ONLY this JSON format, no other text:
{
    "ats_score": <number 0-100>,
    "summary": "<one line summary>",
    "suggestions": [
        "<suggestion 1>",
        "<suggestion 2>",
        "<suggestion 3>",
        "<suggestion 4>",
        "<suggestion 5>"
    ],
    "missing_skills": ["<skill1>", "<skill2>", "<skill3>"]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`,
      },
    ],
    max_tokens: 1000,
    temperature: 0.3,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000), // 60s timeout
  });

  const text = await response.text();

  if (!text) return { error: "Empty response from AI model" };

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    return { error: "Invalid response", raw: text.slice(0, 500) };
  }

  // Extract the assistant's message content
  try {
    return result.choices[0].message.content;
  } catch {
    if (result.error) return { error: result.error };
    return { error: "Unexpected response format", raw: String(result).slice(0, 500) };
  }
}

export { analyzeResume };
