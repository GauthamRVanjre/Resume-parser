import type { ResultState } from "./AtsScoreCard";

interface PriorityImprovementsCardProps {
  state: ResultState;
  suggestions?: string[];
}

const tagColors = [
  { badge: "bg-[#795300]/40 border border-[#ffba38]/30 text-[#ffba38]", arrow: "#ffba38" },
  { badge: "bg-[#3f51b5]/30 border border-[#3f51b5]/40 text-[#bcc2ff]", arrow: "#bcc2ff" },
  { badge: "bg-[#005048]/30 border border-[#70d8c8]/30 text-[#70d8c8]", arrow: "#70d8c8" },
];

const Skeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {[0, 1].map((i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-[#222a3d] rounded" />
          <div className="h-4 w-28 bg-[#222a3d] rounded-full" />
        </div>
        <div className="h-3 w-full bg-[#1a233a] rounded ml-5" />
        <div className="h-3 w-3/4 bg-[#1a233a] rounded ml-5" />
      </div>
    ))}
  </div>
);

const PriorityImprovementsCard = ({ state, suggestions = [] }: PriorityImprovementsCardProps) => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#795300]/30 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" fill="#ffba38" />
            <path
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#ffba38" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="text-[#f2f4f6] font-bold text-sm">Priority Improvements</span>
      </div>

      {/* Body */}
      {state === "loading" && <Skeleton />}

      {state === "idle" && (
        <p className="text-[#454652] text-xs leading-relaxed">
          AI suggestions will appear here after analysis.
        </p>
      )}

      {state === "error" && (
        <p className="text-[#ffb4ab] text-xs">Could not load suggestions.</p>
      )}

      {state === "success" && (
        <div className="flex flex-col gap-4 max-h-48 overflow-y-auto">
          {suggestions.length === 0 ? (
            <p className="text-[#70d8c8] text-xs font-medium">No improvements needed — great resume!</p>
          ) : (
            suggestions.map((suggestion, i) => {
              const color = tagColors[i % tagColors.length];
              return (
                <div key={i} className="flex flex-col gap-1.5 ">
                  <div className="flex items-start gap-2">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke={color.arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`inline-block text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full ${color.badge}`}>
                      SUGGESTION {i + 1}
                    </span>
                  </div>
                  <p className="text-[#8f909a] text-xs leading-relaxed pl-5">{suggestion}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PriorityImprovementsCard;
