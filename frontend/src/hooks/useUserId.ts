import { useState } from "react";

const STORAGE_KEY = "resumeiq_user_id";

/** Returns a stable UUID for this browser session, persisted in localStorage. */
export function useUserId(): string {
  const [userId] = useState<string>(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, newId);
    return newId;
  });
  return userId;
}
