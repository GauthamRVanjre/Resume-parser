interface Keyword {
  name: string;
  percentage: number;
  status: "match" | "partial" | "missing";
}

const keywords: Keyword[] = [
  { name: "Strategic Planning", percentage: 82, status: "match" },
  { name: "Cloud Architecture", percentage: 89, status: "match" },
  { name: "Budget Oversight", percentage: 44, status: "partial" },
  { name: "Agile Delivery", percentage: 0, status: "missing" },
];

const barColor = (status: Keyword["status"]) => {
  if (status === "match") return "bg-[#70d8c8]";
  if (status === "partial") return "bg-[#ffba38]";
  return "bg-[#ffb4ab]";
};

const percentageColor = (status: Keyword["status"]) => {
  if (status === "match") return "text-[#70d8c8]";
  if (status === "partial") return "text-[#ffba38]";
  return "text-[#ffb4ab]";
};

const KeywordMatchCard = () => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#005048]/50 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#70d8c8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[#f2f4f6] font-bold text-sm">Keyword Match</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {keywords.map((kw) => (
          <div key={kw.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#c5c5d4] text-xs font-medium">{kw.name}</span>
              {kw.status === "missing" ? (
                <span className="flex items-center gap-1 text-[#ffb4ab] text-xs font-semibold">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#ffb4ab" strokeWidth="2" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#ffb4ab" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Missing
                </span>
              ) : (
                <span className={`text-xs font-bold ${percentageColor(kw.status)}`}>
                  {kw.percentage}%
                </span>
              )}
            </div>

            {/* Bar track */}
            <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden">
              {kw.status !== "missing" && (
                <div
                  className={`h-full rounded-full transition-all ${barColor(kw.status)}`}
                  style={{ width: `${kw.percentage}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordMatchCard;
