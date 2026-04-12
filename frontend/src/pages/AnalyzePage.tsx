import { useState } from "react";
import JobDescriptionCard from "../components/JobDescriptionCard";
import UploadResumeCard from "../components/UploadResumeCard";
import AtsScoreCard from "../components/AtsScoreCard";
import KeywordMatchCard from "../components/KeywordMatchCard";
import PriorityImprovementsCard from "../components/PriorityImprovementsCard";

const AnalyzePage = () => {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <main className="flex-1 w-full dot-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f2f4f6] tracking-tight leading-tight">
            Optimizer Lab
          </h1>
          <p className="text-[#8f909a] text-sm sm:text-base mt-1.5">
            Align your narrative with the professional requirements.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">

          {/* Left column — inputs */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <UploadResumeCard />
            <JobDescriptionCard value={jobDescription} onChange={setJobDescription} />

            {/* Run Analysis button */}
            <button className="w-full flex items-center justify-center gap-2 bg-[#131b2e] hover:bg-[#1a233a] border border-[#454652]/50 hover:border-[#70d8c8]/30 text-[#f2f4f6] font-semibold text-sm py-3.5 rounded-xl transition-all group">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[#70d8c8] group-hover:scale-110 transition-transform"
              >
                <polygon
                  points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                  stroke="#70d8c8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Run Deep Analysis
            </button>
          </div>

          {/* Right column — results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <AtsScoreCard score={75} />

            {/* Bottom row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KeywordMatchCard />
              <PriorityImprovementsCard />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AnalyzePage;
