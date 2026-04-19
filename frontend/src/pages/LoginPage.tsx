import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


type Mode = "signin" | "signup";

const LoginPage = () => {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fn = mode === "signin" ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setSubmitting(false);

    if (err) { setError(err); return; }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center dot-grid-bg bg-[#0b1326] px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 rounded bg-[#3f51b5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="#fff" strokeWidth="1.5" fill="none" />
              <circle cx="7" cy="7" r="2" fill="#fff" />
            </svg>
          </div>
          <span className="text-[#f2f4f6] font-bold text-lg tracking-tight">Executive Architect</span>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          <h2 className="text-[#f2f4f6] font-extrabold text-xl mb-1 text-center">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-[#8f909a] text-xs text-center mb-6">
            {mode === "signin"
              ? "Sign in to access your resume analysis."
              : "Start optimizing your resume with AI."}
          </p>

          {/* Tab toggle */}
          <div className="flex bg-[#0b1326] rounded-xl p-1 mb-6 border border-[#454652]/30">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  mode === m
                    ? "bg-[#131b2e] text-[#f2f4f6] border border-[#454652]/30"
                    : "text-[#8f909a] hover:text-[#c5c5d4]"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#c5c5d4] text-xs font-semibold tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#0b1326] border border-[#454652]/60 rounded-xl px-4 py-3 text-[#f2f4f6] text-sm placeholder-[#454652] focus:outline-none focus:border-[#70d8c8]/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#c5c5d4] text-xs font-semibold tracking-widest uppercase">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#0b1326] border border-[#454652]/60 rounded-xl px-4 py-3 text-[#f2f4f6] text-sm placeholder-[#454652] focus:outline-none focus:border-[#70d8c8]/50 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#690005]/20 border border-[#ffb4ab]/30 rounded-xl px-4 py-3">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" stroke="#ffb4ab" strokeWidth="1.5" />
                  <path d="M12 8v4M12 16h.01" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-[#ffb4ab] text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full bg-[#3f51b5] hover:bg-[#3a4aa8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {mode === "signin" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Guest access */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#454652]/30" />
          <span className="text-[#454652] text-xs">or</span>
          <div className="flex-1 h-px bg-[#454652]/30" />
        </div>
        <button
          type="button"
          onClick={() => { continueAsGuest(); navigate("/"); }}
          className="mt-3 w-full border border-[#454652]/40 hover:border-[#454652]/70 text-[#8f909a] hover:text-[#c5c5d4] font-medium text-sm py-3 rounded-xl transition-colors"
        >
          Continue as Guest
        </button>

      </div>
    </div>
  );
};

export default LoginPage;
