import type { ResultState } from "./AtsScoreCard";

interface KeywordMatchCardProps {
  state: ResultState;
  missingSkills?: string[];
}

const Skeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[80, 65, 90, 45].map((w, i) => (
      <div key={i}>
        <div className="flex justify-between mb-1">
          <div className="h-3 rounded bg-[#222a3d]" style={{ width: `${w}%` }} />
          <div className="h-3 w-8 rounded bg-[#222a3d]" />
        </div>
        <div className="h-1.5 bg-[#1a233a] rounded-full" />
      </div>
    ))}
  </div>
);

const KeywordMatchCard = ({ state, missingSkills = [] }: KeywordMatchCardProps) => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#005048]/50 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" stroke="#70d8c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[#f2f4f6] font-bold text-sm">Keyword Match</span>
      </div>

      {/* Body */}
      {state === "loading" && <Skeleton />}

      {state === "idle" && (
        <p className="text-[#454652] text-xs leading-relaxed">
          Missing keywords will appear here after analysis.
        </p>
      )}

      {state === "error" && (
        <p className="text-[#ffb4ab] text-xs">Could not load keyword data.</p>
      )}

      {state === "success" && (
        <div className="flex flex-col gap-2">
          {missingSkills.length === 0 ? (
            <div className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="#70d8c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#70d8c8] text-xs font-medium">No missing skills detected!</span>
            </div>
          ) : (
            missingSkills.map((skill, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-[#c5c5d4] text-xs font-medium truncate">{skill}</span>
                <span className="flex-shrink-0 flex items-center gap-1 text-[#ffb4ab] text-[10px] font-semibold">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#ffb4ab" strokeWidth="2" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Missing
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordMatchCard;
