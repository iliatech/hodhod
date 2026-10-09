// Copy/adapt this file into your existing vanilla HTML/CSS/JS frontend.
const API_BASE = window.BUILDX_API_BASE || "http://localhost:8000";

async function api(path, options = {}) {
  const { token, ...rest } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {}),
    },
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.detail || "خطای ارتباط با سرور");
  return data;
}

async function register(email, full_name, password) {
  return api("/api/auth/register", { method: "POST", body: JSON.stringify({ email, full_name, password }) });
}
async function login(email, password) {
  return api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
async function saveProfile(token, profile) {
  return api("/api/profile", { method: "PUT", token, body: JSON.stringify(profile) });
}
async function startResumeInterview(token, target_role) {
  return api("/api/agent/conversations", { method: "POST", token, body: JSON.stringify({ target_role }) });
}
async function answerInterview(token, conversationId, message) {
  return api(`/api/agent/conversations/${conversationId}/messages`, {
    method: "POST", token, body: JSON.stringify({ message }),
  });
}
async function finishResume(token, conversationId, target_role, job_description = "") {
  return api(`/api/agent/conversations/${conversationId}/generate-resume`, {
    method: "POST", token, body: JSON.stringify({ target_role, job_description }),
  });
}
async function listResumes(token) {
  return api("/api/resumes", { token });
}
async function findJobs(token, q = "", location = "") {
  const params = new URLSearchParams({ q, location });
  return api(`/api/jobs?${params}`, { token });
}
async function matchJob(token, jobId) {
  return api(`/api/jobs/${jobId}/match`, { method: "POST", token });
}

// Export for module usage, or remove these lines when including via a normal <script>.
window.BuildXAPI = {
  api, register, login, saveProfile, startResumeInterview,
  answerInterview, finishResume, listResumes, findJobs, matchJob
};
