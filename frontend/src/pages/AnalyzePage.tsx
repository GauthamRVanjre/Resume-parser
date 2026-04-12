import { useState } from "react";
import JobDescriptionCard from "../components/JobDescriptionCard";
import UploadResumeCard, { type UploadState } from "../components/UploadResumeCard";
import AtsScoreCard, { type ResultState } from "../components/AtsScoreCard";
import KeywordMatchCard from "../components/KeywordMatchCard";
import PriorityImprovementsCard from "../components/PriorityImprovementsCard";
import { uploadResume, analyzeResume, type AnalysisResult } from "../services/api";
import { useUserId } from "../hooks/useUserId";

const AnalyzePage = () => {
  const userId = useUserId();

  const [jobDescription, setJobDescription] = useState("");

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Analysis state
  const [resultState, setResultState] = useState<ResultState>("idle");
  const [resultError, setResultError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const canAnalyze =
    uploadState === "uploaded" && jobDescription.trim().length > 0 && resultState !== "loading";

  // ── File selected → call /upload-resume (auto-retries /replace-resume) ──
  const handleFileSelect = async (file: File) => {
    setUploadState("uploading");
    setUploadError("");
    try {
      await uploadResume(file, userId);
      setUploadedFileName(file.name);
      setUploadState("uploaded");
      // Reset analysis if a new resume was uploaded
      setResultState("idle");
      setAnalysis(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  };

  // ── Run Deep Analysis → call /analyze-resume ──
  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setResultState("loading");
    setResultError("");
    try {
      const result = await analyzeResume(userId, jobDescription);
      setAnalysis(result);
      setResultState("success");
    } catch (err) {
      setResultError(err instanceof Error ? err.message : "Analysis failed");
      setResultState("error");
    }
  };

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
            <UploadResumeCard
              onFileSelect={handleFileSelect}
              uploadState={uploadState}
              uploadError={uploadError}
              fileName={uploadedFileName}
            />
            <JobDescriptionCard value={jobDescription} onChange={setJobDescription} />

            {/* Run Analysis button */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`w-full flex items-center justify-center gap-2 border font-semibold text-sm py-3.5 rounded-xl transition-all group ${
                canAnalyze
                  ? "bg-[#131b2e] hover:bg-[#1a233a] border-[#454652]/50 hover:border-[#70d8c8]/40 text-[#f2f4f6] cursor-pointer"
                  : "bg-[#0b1326] border-[#454652]/20 text-[#454652] cursor-not-allowed"
              }`}
            >
              {resultState === "loading" ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#454652" strokeWidth="2" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="#70d8c8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg
                    width="18" height="18" fill="none" viewBox="0 0 24 24"
                    className={`transition-transform ${canAnalyze ? "text-[#70d8c8] group-hover:scale-110" : ""}`}
                  >
                    <polygon
                      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                      stroke={canAnalyze ? "#70d8c8" : "#454652"}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                    />
                  </svg>
                  Run Deep Analysis
                </>
              )}
            </button>

            {/* Hint text */}
            {uploadState !== "uploaded" && (
              <p className="text-[#454652] text-xs text-center -mt-1">
                Upload a resume to enable analysis
              </p>
            )}
            {uploadState === "uploaded" && jobDescription.trim().length === 0 && (
              <p className="text-[#454652] text-xs text-center -mt-1">
                Paste a job description to enable analysis
              </p>
            )}
          </div>

          {/* Right column — results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <AtsScoreCard
              state={resultState}
              score={analysis?.ats_score}
              summary={analysis?.summary}
              error={resultError}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KeywordMatchCard
                state={resultState}
                missingSkills={analysis?.missing_skills}
              />
              <PriorityImprovementsCard
                state={resultState}
                suggestions={analysis?.suggestions}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AnalyzePage;
