import { useRef, useState } from "react";

export type UploadState = "idle" | "uploading" | "uploaded" | "error";

interface UploadResumeCardProps {
  onFileSelect: (file: File) => void;
  uploadState: UploadState;
  uploadError?: string;
  fileName?: string;
}

const UploadResumeCard = ({
  onFileSelect,
  uploadState,
  uploadError,
  fileName,
}: UploadResumeCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => onFileSelect(file);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const isUploading = uploadState === "uploading";

  return (
    <div className="glass-panel rounded-xl p-5">
      <div
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-colors ${
          isUploading
            ? "border-[#70d8c8]/30 cursor-not-allowed"
            : uploadState === "error"
            ? "border-[#ffb4ab]/50 cursor-pointer hover:border-[#ffb4ab]/70"
            : uploadState === "uploaded"
            ? "border-[#70d8c8]/50 bg-[#70d8c8]/5 cursor-pointer"
            : dragging
            ? "border-[#70d8c8]/60 bg-[#70d8c8]/5 cursor-pointer"
            : "border-[#454652]/60 hover:border-[#454652] cursor-pointer"
        }`}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!isUploading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* Icon area */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          uploadState === "uploaded" ? "bg-[#005048]/50" :
          uploadState === "error"    ? "bg-[#690005]/30" :
          "bg-[#222a3d]"
        }`}>
          {isUploading ? (
            /* Spinner */
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#454652" strokeWidth="2" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke="#70d8c8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : uploadState === "uploaded" ? (
            /* Checkmark */
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" stroke="#70d8c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : uploadState === "error" ? (
            /* Error X */
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="#ffb4ab" strokeWidth="1.5" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            /* File icon */
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline points="14 2 14 8 20 8" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="9" y1="13" x2="15" y2="13" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="17" x2="13" y2="17" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Status text */}
        <div className="text-center">
          {isUploading && (
            <p className="text-[#70d8c8] font-semibold text-sm animate-pulse">Uploading…</p>
          )}
          {uploadState === "uploaded" && (
            <>
              <p className="text-[#70d8c8] font-semibold text-sm">{fileName}</p>
              <p className="text-[#8f909a] text-xs mt-1">Uploaded successfully · click to replace</p>
            </>
          )}
          {uploadState === "error" && (
            <>
              <p className="text-[#ffb4ab] font-semibold text-sm">Upload failed</p>
              <p className="text-[#8f909a] text-xs mt-1">{uploadError ?? "Please try again"}</p>
            </>
          )}
          {uploadState === "idle" && (
            <>
              <p className="text-[#f2f4f6] font-semibold text-sm">Upload Resume</p>
              <p className="text-[#8f909a] text-xs mt-1">PDF or Word documents (Max 5MB)</p>
            </>
          )}
        </div>

        {!isUploading && (
          <button
            className="mt-1 border border-[#454652] text-[#c5c5d4] text-xs font-medium px-5 py-1.5 rounded-full hover:border-[#70d8c8] hover:text-[#70d8c8] transition-colors"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            {uploadState === "uploaded" ? "Replace file" : "Select file"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
};

export default UploadResumeCard;
