import { useRef, useState } from "react";

const UploadResumeCard = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="glass-panel rounded-xl p-5">
      <div
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          dragging ? "border-[#70d8c8]/60 bg-[#70d8c8]/5" : "border-[#454652]/60 hover:border-[#454652]"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* File icon */}
        <div className="w-12 h-12 rounded-lg bg-[#222a3d] flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              stroke="#70d8c8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke="#70d8c8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="9" y1="13" x2="15" y2="13" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="17" x2="13" y2="17" stroke="#70d8c8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center">
          {fileName ? (
            <p className="text-[#70d8c8] font-semibold text-sm">{fileName}</p>
          ) : (
            <>
              <p className="text-[#f2f4f6] font-semibold text-sm">Upload Resume</p>
              <p className="text-[#8f909a] text-xs mt-1">PDF or Word documents (Max 5MB)</p>
            </>
          )}
        </div>

        <button
          className="mt-1 border border-[#454652] text-[#c5c5d4] text-xs font-medium px-5 py-1.5 rounded-full hover:border-[#70d8c8] hover:text-[#70d8c8] transition-colors"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Select file
        </button>
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
