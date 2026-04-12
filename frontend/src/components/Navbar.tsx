import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Desktop nav */}
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
            <a
              href="#"
              className="text-[#70d8c8] text-sm font-semibold border-b border-[#70d8c8] pb-0.5"
            >
              Analysis
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-[#c5c5d4] hover:text-[#f2f4f6] text-sm font-medium transition-colors px-3 py-1.5">
              Login
            </button>
            <button className="bg-[#3f51b5] hover:bg-[#3a4aa8] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
              Get Started
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
            <a href="#" className="text-[#70d8c8] text-sm font-semibold px-1">
              Analysis
            </a>
            <div className="flex items-center gap-3 pt-2 border-t border-[#454652]/30">
              <button className="text-[#c5c5d4] text-sm font-medium">Login</button>
              <button className="bg-[#3f51b5] text-white text-sm font-semibold px-4 py-2 rounded-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
