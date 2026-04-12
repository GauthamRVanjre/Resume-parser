const Footer = () => {
  return (
    <footer className="w-full border-t border-[#454652]/30 bg-[#070e1d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#3f51b5] flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="#fff" strokeWidth="1.5" fill="none" />
                <circle cx="7" cy="7" r="2" fill="#fff" />
              </svg>
            </div>
            <span className="text-[#f2f4f6] font-bold text-sm">Executive Architect</span>
          </div>

          {/* Copyright */}
          <p className="text-[#454652] text-xs text-center">
            © 2024 Executive Architect. Precision in decision.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms", "Contact"].map((link, i, arr) => (
              <span key={link} className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-[#8f909a] hover:text-[#c5c5d4] text-xs transition-colors"
                >
                  {link}
                </a>
                {i < arr.length - 1 && (
                  <span className="text-[#454652] text-xs">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
