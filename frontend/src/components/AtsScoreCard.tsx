const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export type ResultState = "idle" | "loading" | "success" | "error";

interface AtsScoreCardProps {
  state: ResultState;
  score?: number;
  summary?: string;
  error?: string;
}

const ScorePlaceholder = () => (
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-pulse">
    <div className="w-[140px] h-[140px] rounded-full bg-[#222a3d] flex-shrink-0" />
    <div className="flex flex-col gap-3 flex-1 w-full">
      <div className="h-5 w-40 bg-[#222a3d] rounded" />
      <div className="h-3 w-full bg-[#1a233a] rounded" />
      <div className="h-3 w-4/5 bg-[#1a233a] rounded" />
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-24 bg-[#222a3d] rounded-full" />
        <div className="h-6 w-36 bg-[#222a3d] rounded-full" />
      </div>
    </div>
  </div>
);

const AtsScoreCard = ({ state, score = 0, summary, error }: AtsScoreCardProps) => {
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);
  const isIdle = state === "idle";
  const isLoading = state === "loading";

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <ScorePlaceholder />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="glass-panel rounded-xl p-6 flex items-center gap-3">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
          <circle cx="12" cy="12" r="10" stroke="#ffb4ab" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-[#ffb4ab] text-sm">{error ?? "Analysis failed. Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 120 120" className="overflow-visible">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Track */}
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#222a3d" strokeWidth="9" />
            {/* Progress */}
            {!isIdle && (
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#70d8c8"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                filter="url(#glow)"
                style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isIdle ? (
              <span className="text-2xl font-extrabold text-[#454652]">—</span>
            ) : (
              <span className="text-3xl font-extrabold text-[#f2f4f6] leading-none">{score}%</span>
            )}
            <span className="text-[10px] font-semibold text-[#8f909a] tracking-widest mt-0.5">ATS SCORE</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div>
            <h3 className="text-[#f2f4f6] font-bold text-lg mb-2">Narrative Strength</h3>
            {isIdle ? (
              <p className="text-[#454652] text-sm leading-relaxed">
                Upload your resume and paste a job description, then run the analysis to see your ATS score here.
              </p>
            ) : (
              <p className="text-[#c5c5d4] text-sm leading-relaxed">{summary}</p>
            )}
          </div>

          {!isIdle && (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#005048]/40 border border-[#70d8c8]/30 text-[#70d8c8] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70d8c8]" />
                {score >= 70 ? "GOOD MATCH" : score >= 40 ? "PARTIAL MATCH" : "WEAK MATCH"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#3f51b5]/20 border border-[#3f51b5]/40 text-[#bcc2ff] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="#bcc2ff" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="#bcc2ff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                ATS SCORE: {score}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsScoreCard;
