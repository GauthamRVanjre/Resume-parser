// services/supabaseClient.js
// Handles all communication with Supabase DB via REST API (no SDK)
// Port of: backend/services/supabase_client.py

import * as dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// ── SAVE RESUME ──────────────────────────────────────
// Called when user uploads a resume for the FIRST time
async function saveResume(userId, resumeText, filename) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users_resume`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      user_id: userId,
      resume_text: resumeText,
      resume_filename: filename,
    }),
  });

  const text = await response.text();
  return text ? JSON.parse(text) : { status: "saved", code: response.status };
}

// ── GET RESUME ───────────────────────────────────────
// Returns the resume row for a user, or null if not found
async function getResume(userId) {
  const params = new URLSearchParams({
    user_id: `eq.${userId}`,
    select: "*",
  });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/users_resume?${params}`,
    {
      method: "GET",
      headers: { ...HEADERS, Prefer: "return=representation" },
    }
  );

  const data = await response.json();
  if (data && data.length > 0) return data[0];
  return null;
}

// ── UPDATE RESUME ────────────────────────────────────
// Called when user replaces their existing resume
async function updateResume(userId, resumeText, filename) {
  const params = new URLSearchParams({ user_id: `eq.${userId}` });

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/users_resume?${params}`,
    {
      method: "PATCH",
      headers: { ...HEADERS, Prefer: "return=representation" },
      body: JSON.stringify({
        resume_text: resumeText,
        resume_filename: filename,
      }),
    }
  );

  const text = await response.text();
  return text ? JSON.parse(text) : { status: "updated", code: response.status };
}

export { saveResume, getResume, updateResume };
