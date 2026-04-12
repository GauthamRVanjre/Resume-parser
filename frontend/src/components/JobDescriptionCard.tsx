import { useState } from "react";

interface JobDescriptionCardProps {
  value: string;
  onChange: (val: string) => void;
}

const JobDescriptionCard = ({ value, onChange }: JobDescriptionCardProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="glass-panel rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#222a3d] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <rect
              x="2" y="7" width="20" height="14" rx="2"
              stroke="#70d8c8" strokeWidth="1.5"
            />
            <path
              d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
              stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round"
            />
            <line x1="12" y1="12" x2="12" y2="16" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="14" x2="14" y2="14" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[#f2f4f6] font-semibold text-sm">Target Job Description</span>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Paste the job requirements here to find the perfect narrative fit."
        rows={7}
        className={`w-full bg-[#131b2e] rounded-lg p-3 text-[#c5c5d4] text-xs leading-relaxed resize-none outline-none placeholder-[#454652] transition-all ${
          focused ? "ring-1 ring-[#70d8c8]/40" : "ring-1 ring-[#454652]/30"
        }`}
      />
    </div>
  );
};

export default JobDescriptionCard;
