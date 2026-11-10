/**
 * CodeRoom Frontend API Service
 *
 * All data operations go through these typed fetch helpers.
 * The Vite dev proxy routes /api/* to http://localhost:3001.
 *
 * In production replace BASE_URL with the deployed API origin.
 */

import type {
  Interview,
  Question,
  AssessmentAttempt,
  Language,
  ExecutionResult,
  IntegritySignal,
  UserProfile,
  AuditLogEntry,
  ApiKey,
  WebhookEndpoint,
  UserRole,
} from '../types';

const BASE_URL = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Interviews ─────────────────────────────────────────────────────────────
export const InterviewsAPI = {
  list: () => request<Interview[]>('/interviews'),

  get: (id: string) => request<Interview>(`/interviews/${id}`),

  create: (data: Partial<Interview>) =>
    request<Interview>('/interviews', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, patch: Partial<Interview>) =>
    request<Interview>(`/interviews/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  delete: (id: string) => request<void>(`/interviews/${id}`, { method: 'DELETE' }),

  addIntegritySignal: (id: string, signal: Omit<IntegritySignal, 'id'>) =>
    request<Interview>(`/interviews/${id}/integrity-signal`, {
      method: 'POST',
      body: JSON.stringify(signal),
    }),
};

// ─── Questions ──────────────────────────────────────────────────────────────
export const QuestionsAPI = {
  list: () => request<Question[]>('/questions'),

  get: (id: string) => request<Question>(`/questions/${id}`),

  create: (data: Partial<Question>) =>
    request<Question>('/questions', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, patch: Partial<Question>) =>
    request<Question>(`/questions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  delete: (id: string) => request<void>(`/questions/${id}`, { method: 'DELETE' }),
};

// ─── Assessments ────────────────────────────────────────────────────────────
export const AssessmentsAPI = {
  list: () => request<AssessmentAttempt[]>('/assessments'),

  get: (id: string) => request<AssessmentAttempt>(`/assessments/${id}`),

  update: (id: string, patch: Partial<AssessmentAttempt>) =>
    request<AssessmentAttempt>(`/assessments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  addIntegritySignal: (id: string, signal: Omit<IntegritySignal, 'id'>) =>
    request<AssessmentAttempt>(`/assessments/${id}/integrity-signal`, {
      method: 'POST',
      body: JSON.stringify(signal),
    }),
};

// ─── Code Execution ─────────────────────────────────────────────────────────
export const ExecuteAPI = {
  run: (params: {
    code: string;
    language: Language;
    questionId: string;
    interviewId?: string;
    assessmentId?: string;
  }) =>
    request<ExecutionResult>('/execute', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  stop: (runId: string) =>
    request<{ success: boolean; message: string }>(`/execute/${runId}/stop`, {
      method: 'POST',
    }),
};

// ─── Administration, Governance & Audit (Section 5, 8, 9) ───────────────────
export const AdminAPI = {
  getStaff: () => request<UserProfile[]>('/admin/staff'),

  inviteStaff: (data: { name?: string; email: string; role: UserRole; team?: string }) =>
    request<UserProfile>('/admin/staff/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStaff: (id: string, patch: Partial<UserProfile>) =>
    request<UserProfile>(`/admin/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  getAuditLogs: () => request<AuditLogEntry[]>('/admin/audit'),

  purgeCandidate: (candidateEmail: string) =>
    request<{ success: boolean; message: string; auditEntry: AuditLogEntry }>('/admin/purge-candidate', {
      method: 'POST',
      body: JSON.stringify({ candidateEmail }),
    }),

  getApiKeys: () => request<ApiKey[]>('/admin/apikeys'),

  createApiKey: (name: string, scopes: string[]) =>
    request<ApiKey>('/admin/apikeys', {
      method: 'POST',
      body: JSON.stringify({ name, scopes }),
    }),

  deleteApiKey: (id: string) =>
    request<void>(`/admin/apikeys/${id}`, { method: 'DELETE' }),

  getWebhooks: () => request<WebhookEndpoint[]>('/admin/webhooks'),

  createWebhook: (url: string, events: string[]) =>
    request<WebhookEndpoint>('/admin/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url, events }),
    }),

  deleteWebhook: (id: string) =>
    request<void>(`/admin/webhooks/${id}`, { method: 'DELETE' }),
};

// ─── WebSocket collaboration helper ─────────────────────────────────────────
export type WsMessageType =
  | { type: 'CODE_EDIT'; code: string; language: Language; senderId: string }
  | { type: 'LOCK_TOGGLE'; locked: boolean }
  | { type: 'CHAT_MESSAGE'; sender: string; text: string; time: string }
  | { type: 'RUN_RESULT'; result: ExecutionResult }
  | { type: 'CONNECTED'; sessionId: string; message: string };

export function createSessionSocket(
  sessionId: string,
  onMessage: (msg: WsMessageType) => void,
  onError?: (err: Event) => void,
): WebSocket {
  const ws = new WebSocket(`ws://localhost:3001?sessionId=${sessionId}`);

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data) as WsMessageType;
      onMessage(msg);
    } catch (e) {
      console.error('[WS] Parse error:', e);
    }
  };

  ws.onerror = (err) => {
    console.error('[WS] Connection error:', err);
    onError?.(err);
  };

  ws.onclose = () => {
    console.log('[WS] Disconnected from session:', sessionId);
  };

  return ws;
}

