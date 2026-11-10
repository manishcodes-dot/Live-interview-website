import {
  Interview,
  Question,
  AssessmentAttempt,
  UserProfile,
  AuditLogEntry,
  ApiKey,
  WebhookEndpoint,
} from '../types/index';
import {
  INITIAL_INTERVIEWS,
  INITIAL_QUESTIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_API_KEYS,
  INITIAL_WEBHOOKS,
} from '../data/mockData';

/**
 * In-memory store for the API server.
 * In production this would be backed by PostgreSQL + Redis.
 * Seed from mock data on cold start.
 */

let interviewsStore: Interview[] = [...INITIAL_INTERVIEWS];
let questionsStore: Question[] = [...INITIAL_QUESTIONS];
let assessmentsStore: AssessmentAttempt[] = [...INITIAL_ASSESSMENTS];
let staffStore: UserProfile[] = [...INITIAL_STAFF_MEMBERS];
let auditStore: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
let apiKeysStore: ApiKey[] = [...INITIAL_API_KEYS];
let webhooksStore: WebhookEndpoint[] = [...INITIAL_WEBHOOKS];

export const db = {
  // ─── Interviews ──────────────────────────────────────────────────────
  getInterviews: (): Interview[] => interviewsStore,

  getInterviewById: (id: string): Interview | undefined =>
    interviewsStore.find((i) => i.id === id),

  createInterview: (interview: Interview): Interview => {
    interviewsStore.unshift(interview);
    return interview;
  },

  updateInterview: (id: string, patch: Partial<Interview>): Interview | null => {
    const idx = interviewsStore.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    interviewsStore[idx] = { ...interviewsStore[idx], ...patch };
    return interviewsStore[idx];
  },

  deleteInterview: (id: string): boolean => {
    const before = interviewsStore.length;
    interviewsStore = interviewsStore.filter((i) => i.id !== id);
    return interviewsStore.length < before;
  },

  // ─── Questions ───────────────────────────────────────────────────────
  getQuestions: (): Question[] => questionsStore,

  getQuestionById: (id: string): Question | undefined =>
    questionsStore.find((q) => q.id === id),

  createQuestion: (question: Question): Question => {
    questionsStore.unshift(question);
    return question;
  },

  updateQuestion: (id: string, patch: Partial<Question>): Question | null => {
    const idx = questionsStore.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    questionsStore[idx] = { ...questionsStore[idx], ...patch };
    return questionsStore[idx];
  },

  deleteQuestion: (id: string): boolean => {
    const before = questionsStore.length;
    questionsStore = questionsStore.filter((q) => q.id !== id);
    return questionsStore.length < before;
  },

  // ─── Assessments ─────────────────────────────────────────────────────
  getAssessments: (): AssessmentAttempt[] => assessmentsStore,

  getAssessmentById: (id: string): AssessmentAttempt | undefined =>
    assessmentsStore.find((a) => a.id === id),

  createAssessment: (assessment: AssessmentAttempt): AssessmentAttempt => {
    assessmentsStore.unshift(assessment);
    return assessment;
  },

  updateAssessment: (id: string, patch: Partial<AssessmentAttempt>): AssessmentAttempt | null => {
    const idx = assessmentsStore.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    assessmentsStore[idx] = { ...assessmentsStore[idx], ...patch };
    return assessmentsStore[idx];
  },

  // ─── Staff & Roles (Section 2, 8.2) ──────────────────────────────────
  getStaff: (): UserProfile[] => staffStore,

  getStaffById: (id: string): UserProfile | undefined =>
    staffStore.find((u) => u.id === id),

  createStaff: (user: UserProfile): UserProfile => {
    staffStore.push(user);
    return user;
  },

  updateStaff: (id: string, patch: Partial<UserProfile>): UserProfile | null => {
    const idx = staffStore.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    staffStore[idx] = { ...staffStore[idx], ...patch };
    return staffStore[idx];
  },

  // ─── Audit Log (Section 5, 8.5) ──────────────────────────────────────
  getAuditLogs: (): AuditLogEntry[] => auditStore,

  addAuditLog: (entry: AuditLogEntry): AuditLogEntry => {
    auditStore.unshift(entry);
    return entry;
  },

  // ─── Integrations (Section 8.7) ──────────────────────────────────────
  getApiKeys: (): ApiKey[] => apiKeysStore,

  createApiKey: (key: ApiKey): ApiKey => {
    apiKeysStore.unshift(key);
    return key;
  },

  deleteApiKey: (id: string): boolean => {
    const before = apiKeysStore.length;
    apiKeysStore = apiKeysStore.filter((k) => k.id !== id);
    return apiKeysStore.length < before;
  },

  getWebhooks: (): WebhookEndpoint[] => webhooksStore,

  createWebhook: (wh: WebhookEndpoint): WebhookEndpoint => {
    webhooksStore.unshift(wh);
    return wh;
  },

  deleteWebhook: (id: string): boolean => {
    const before = webhooksStore.length;
    webhooksStore = webhooksStore.filter((w) => w.id !== id);
    return webhooksStore.length < before;
  },
};

