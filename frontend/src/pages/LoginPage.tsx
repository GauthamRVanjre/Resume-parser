import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"google" | null>(null);

  const handleGoogle = async () => {
    setLoading("google");
    await signInWithGoogle();
    // page redirects away via Supabase OAuth; loading state is intentionally not reset
  };

  const handleGuest = () => {
    continueAsGuest();
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
          <h2 className="text-[#f2f4f6] font-extrabold text-xl mb-1 text-center">Welcome</h2>
          <p className="text-[#8f909a] text-xs text-center mb-8">
            Optimize your resume with AI-powered ATS analysis.
          </p>

          <div className="flex flex-col gap-3">

            {/* Google Sign-in */}
            <button
              onClick={handleGoogle}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-semibold text-sm py-3 rounded-xl transition-colors border border-gray-200"
            >
              {loading === "google" ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Redirecting…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#454652]/40" />
              <span className="text-[#454652] text-xs">or</span>
              <div className="flex-1 h-px bg-[#454652]/40" />
            </div>

            {/* Guest */}
            <button
              onClick={handleGuest}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#131b2e] disabled:opacity-60 disabled:cursor-not-allowed border border-[#454652]/50 hover:border-[#454652]/80 text-[#8f909a] hover:text-[#c5c5d4] font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-[#454652] text-xs text-center mt-6">
            Guest results are not saved. Sign in to keep your resume.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
