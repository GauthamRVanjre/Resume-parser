import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const userEmail = session?.user.email ?? "";

  return (
    <nav className="w-full border-b border-[#454652]/30 bg-[#0b1326]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3f51b5] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="#fff" strokeWidth="1.5" fill="none" />
                <circle cx="7" cy="7" r="2" fill="#fff" />
              </svg>
            </div>
            <span className="text-[#f2f4f6] font-bold text-base tracking-tight">Executive Architect</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#c5c5d4] hover:text-[#f2f4f6] text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
            <a href="#" className="text-[#70d8c8] text-sm font-semibold border-b border-[#70d8c8] pb-0.5">
              Analysis
            </a>
          </div>

          {/* Desktop actions — user email + sign out */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[#8f909a] text-xs font-medium truncate max-w-[200px]" title={userEmail}>
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-[#c5c5d4] hover:text-[#ffb4ab] text-sm font-medium px-3 py-1.5 border border-[#454652]/40 hover:border-[#ffb4ab]/40 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#c5c5d4] hover:text-[#f2f4f6] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#454652]/30 py-4 flex flex-col gap-4">
            {["Features", "Pricing"].map((item) => (
              <a key={item} href="#" className="text-[#c5c5d4] text-sm font-medium px-1">
                {item}
              </a>
            ))}
            <a href="#" className="text-[#70d8c8] text-sm font-semibold px-1">Analysis</a>

            <div className="flex items-center justify-between pt-2 border-t border-[#454652]/30">
              <span className="text-[#8f909a] text-xs truncate max-w-[180px]">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-[#c5c5d4] hover:text-[#ffb4ab] text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
