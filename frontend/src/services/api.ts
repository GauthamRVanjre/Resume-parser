const BASE = "/api";

export interface AnalysisResult {
  ats_score: number;
  summary: string;
  suggestions: string[];
  missing_skills: string[];
}

interface UploadResponse {
  status: string;
  message: string;
  filename: string;
  text_length: number;
}

function buildForm(file: File, userId: string): FormData {
  const form = new FormData();
  form.append("file", file);
  form.append("user_id", userId);
  return form;
}

/** Uploads a resume. Automatically retries with /replace-resume if one already exists. */
export async function uploadResume(file: File, userId: string): Promise<UploadResponse> {
  const res = await fetch(`${BASE}/upload-resume`, {
    method: "POST",
    body: buildForm(file, userId),
  });

  if (!res.ok) {
    const err: { error?: string } = await res.json();
    // Resume already exists — replace it
    if (res.status === 400 && err.error?.includes("already exists")) {
      const replaceRes = await fetch(`${BASE}/replace-resume`, {
        method: "POST",
        body: buildForm(file, userId),
      });
      if (!replaceRes.ok) {
        const replaceErr: { error?: string } = await replaceRes.json();
        throw new Error(replaceErr.error ?? "Failed to replace resume");
      }
      return replaceRes.json() as Promise<UploadResponse>;
    }
    throw new Error(err.error ?? "Failed to upload resume");
  }

  return res.json() as Promise<UploadResponse>;
}

/** Sends user_id + job description to the AI analysis endpoint. */
export async function analyzeResume(
  userId: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, job_description: jobDescription }),
  });

  if (!res.ok) {
    const err: { error?: string } = await res.json();
    throw new Error(err.error ?? "Analysis failed");
  }

  const data: { status: string; analysis: AnalysisResult } = await res.json();
  return data.analysis;
}
