const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export type ApiUser = { id: number; email: string; full_name: string };
export type Profile = { target_role: string; location: string; experience_years: number; skills: string[]; education: any[]; work_history: any[]; preferences: Record<string, any> };
export type Job = { id: number; title: string; company: string; location: string; description: string; url: string; skills: string[]; source?: string };

export function getToken() { if (typeof window === "undefined") return null; return localStorage.getItem("hodhod_token"); }
export function getSavedUser(): ApiUser | null { if (typeof window === "undefined") return null; try { const v = localStorage.getItem("hodhod_user"); return v ? JSON.parse(v) : null; } catch { return null; } }
export function saveSession(token: string, user: ApiUser) { localStorage.setItem("hodhod_token", token); localStorage.setItem("hodhod_user", JSON.stringify(user)); }
export function clearSession() { localStorage.removeItem("hodhod_token"); localStorage.removeItem("hodhod_user"); }
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
  catch { throw new Error(`اتصال به سرور برقرار نشد. آدرس بک‌اند را بررسی کن: ${API_URL}`); }
  if (!response.ok) {
    let message = `خطای سرور (${response.status})`;
    try { const body = await response.json(); message = typeof body.detail === "string" ? body.detail : message; } catch {}
    if (response.status === 401 && typeof window !== "undefined") { clearSession(); }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
