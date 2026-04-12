interface Improvement {
  tag: string;
  tagColor: "yellow" | "blue";
  description: string;
}

const improvements: Improvement[] = [
  {
    tag: "QUANTIFY RESULTS",
    tagColor: "yellow",
    description:
      "Add metrics to your 2022 Senior Lead role to demonstrate business impact.",
  },
  {
    tag: "MISSING SKILL",
    tagColor: "blue",
    description:
      "Incorporate \"Cross-functional collaboration\" in your professional summary.",
  },
];

const tagStyles = {
  yellow: {
    badge: "bg-[#795300]/40 border border-[#ffba38]/30 text-[#ffba38]",
    arrow: "#ffba38",
  },
  blue: {
    badge: "bg-[#3f51b5]/30 border border-[#3f51b5]/40 text-[#bcc2ff]",
    arrow: "#bcc2ff",
  },
};

const PriorityImprovementsCard = () => {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#795300]/30 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" fill="#ffba38" />
            <path
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#ffba38"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="text-[#f2f4f6] font-bold text-sm">Priority Improvements</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4">
        {improvements.map((item, i) => {
          const styles = tagStyles[item.tagColor];
          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                {/* Arrow icon */}
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="mt-0.5 flex-shrink-0"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke={styles.arrow}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Badge */}
                <span
                  className={`inline-block text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full ${styles.badge}`}
                >
                  {item.tag}
                </span>
              </div>
              <p className="text-[#8f909a] text-xs leading-relaxed pl-5">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityImprovementsCard;
