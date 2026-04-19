import { Router } from "express";

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; // service role key

/**
 * POST /auth/signup
 * Body: { email, password }
 * Uses the standard Supabase signup endpoint (works with anon or service role key).
 * Returns 409 if the email is already registered.
 */
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const signupData = await signupRes.json();

  if (!signupRes.ok) {
    const msg = signupData?.msg ?? signupData?.message ?? "Signup failed";
    const status = signupRes.status === 422 ? 409 : signupRes.status;
    return res.status(status).json({ error: msg });
  }

  // Supabase returns the session directly from /auth/v1/signup when email confirmation is off
  if (signupData.access_token) {
    return res.json({
      access_token: signupData.access_token,
      refresh_token: signupData.refresh_token,
      expires_in: signupData.expires_in,
      user: signupData.user,
    });
  }

  // Fallback: sign in to get a session (e.g. if Supabase returned user but no token)
  const signinRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const signinData = await signinRes.json();

  if (!signinRes.ok) {
    return res.status(signinRes.status).json({ error: "Account created but sign-in failed" });
  }

  return res.json({
    access_token: signinData.access_token,
    refresh_token: signinData.refresh_token,
    expires_in: signinData.expires_in,
    user: signinData.user,
  });
});

/**
 * POST /auth/signin
 * Body: { email, password }
 * Proxies the Supabase password grant to keep credentials off the client SDK.
 */
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const signinRes = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await signinRes.json();

  if (!signinRes.ok) {
    const msg = data?.error_description ?? data?.msg ?? "Invalid credentials";
    return res.status(401).json({ error: msg });
  }

  return res.json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    user: data.user,
  });
});

export default router;
