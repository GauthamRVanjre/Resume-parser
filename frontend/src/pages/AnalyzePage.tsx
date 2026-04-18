import { useState } from "react";
import JobDescriptionCard from "../components/JobDescriptionCard";
import UploadResumeCard, { type UploadState } from "../components/UploadResumeCard";
import AtsScoreCard, { type ResultState } from "../components/AtsScoreCard";
import KeywordMatchCard from "../components/KeywordMatchCard";
import PriorityImprovementsCard from "../components/PriorityImprovementsCard";
import { uploadResume, analyzeResume, analyzeGuest, type AnalysisResult } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AnalyzePage = () => {
  const { session, isGuest, guestId } = useAuth();
  const token = session?.access_token ?? "";

  const [jobDescription, setJobDescription] = useState("");

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  // Holds the file in memory for guests (sent to backend only on analyze)
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Analysis state
  const [resultState, setResultState] = useState<ResultState>("idle");
  const [resultError, setResultError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const canAnalyze =
    uploadState === "uploaded" && jobDescription.trim().length > 0 && resultState !== "loading";

    console.log("token in AnalyzePage:", token, "token length:", token.length);

  // ── File selected ─────────────────────────────────────────────────────────
  // Guests: store the file locally — no upload yet (sent on analyze).
  // Google users: upload immediately to save the resume to the DB.
  const handleFileSelect = async (file: File) => {
    setUploadState("uploading");
    setUploadError("");
    setResultState("idle");
    setAnalysis(null);

    if (isGuest) {
      setPendingFile(file);
      setUploadedFileName(file.name);
      setUploadState("uploaded");
      return;
    }

    try {
      await uploadResume(file, token);
      setUploadedFileName(file.name);
      setUploadState("uploaded");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  };

  // ── Run Deep Analysis ─────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setResultState("loading");
    setResultError("");

    try {
      let result: AnalysisResult;

      if (isGuest && pendingFile && guestId) {
        result = await analyzeGuest(pendingFile, jobDescription, guestId);
      } else {
        result = await analyzeResume(token, jobDescription);
      }

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

        {/* Guest banner */}
        {isGuest && (
          <div className="mb-6 flex items-center gap-3 bg-[#1a233a] border border-[#454652]/40 rounded-xl px-4 py-3">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="#70d8c8" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-[#8f909a] text-xs">
              You're in guest mode — results are not saved.{" "}
              <a href="/login" className="text-[#70d8c8] hover:underline">Sign in with Google</a>{" "}
              to keep your resume across sessions.
            </p>
          </div>
        )}

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
                    className={`transition-transform ${canAnalyze ? "group-hover:scale-110" : ""}`}
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
