import * as dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// Fire-and-forget — a failed analytics write must never break the main response.
export function logAction(userId, userType, action) {
  fetch(`${SUPABASE_URL}/rest/v1/analytics`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ user_id: userId, user_type: userType, action }),
  }).catch(() => {});
}
