const BASE = import.meta.env.VITE_BASE_URL || "/api";

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

function buildForm(file: File): FormData {
  const form = new FormData();
  form.append("file", file);
  // user_id removed — backend derives it from the verified JWT (req.userId)
  return form;
}

function bearerHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Uploads a resume. Automatically retries with /replace-resume if one already exists.
 * Do NOT set Content-Type manually for multipart — the browser sets it with the boundary.
 */
export async function uploadResume(file: File, token: string): Promise<UploadResponse> {
  const res = await fetch(`${BASE}/upload-resume`, {
    method: "POST",
    headers: bearerHeader(token),
    body: buildForm(file),
  });

  if (!res.ok) {
    const err: { error?: string } = await res.json();
    if (res.status === 400 && err.error?.includes("already exists")) {
      const replaceRes = await fetch(`${BASE}/replace-resume`, {
        method: "POST",
        headers: bearerHeader(token),
        body: buildForm(file),
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

/** One-shot guest analysis — uploads PDF and analyzes in a single request, no DB write. */
export async function analyzeGuest(
  file: File,
  jobDescription: string,
  guestId: string
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("job_description", jobDescription);
  form.append("guest_id", guestId);

  const res = await fetch(`${BASE}/analyze-guest`, { method: "POST", body: form });

  if (!res.ok) {
    const err: { error?: string } = await res.json();
    throw new Error(err.error ?? "Guest analysis failed");
  }

  const data: { status: string; analysis: AnalysisResult } = await res.json();
  return data.analysis;
}

/** Sends the JWT + job description to the AI analysis endpoint. */
export async function analyzeResume(token: string, jobDescription: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...bearerHeader(token),
    },
    body: JSON.stringify({ job_description: jobDescription }),
    // user_id removed from body — backend reads req.userId set by auth middleware
  });

  if (!res.ok) {
    const err: { error?: string } = await res.json();
    throw new Error(err.error ?? "Analysis failed");
  }

  const data: { status: string; analysis: AnalysisResult } = await res.json();
  return data.analysis;
}
