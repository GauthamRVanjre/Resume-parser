import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const LoginPage = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();



  return (
    <div className="min-h-screen flex items-center justify-center dot-grid-bg bg-[#0b1326] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 rounded bg-[#3f51b5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1L13 4V10L7 13L1 10V4L7 1Z"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="7" cy="7" r="2" fill="#fff" />
            </svg>
          </div>
          <span className="text-[#f2f4f6] font-bold text-lg tracking-tight">
            Resume parser
          </span>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          {/* Guest access */}
          <div className="mt-4 flex items-center gap-3"></div>
          <button
            type="button"
            onClick={() => {
              continueAsGuest();
              navigate("/");
            }}
            className="mt-3 w-full border border-[#454652]/40 hover:border-[#454652]/70 text-[#8f909a] hover:text-[#c5c5d4] font-medium text-sm py-3 rounded-xl transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
