export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'csharp';

export type ExecutionRunStatus = 'Queued' | 'Running' | 'Completed' | 'Limit exceeded' | 'Failed (platform)' | 'Stopped';

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Algorithms' | 'Data Structures' | 'System Design' | 'Debugging' | 'Concurrency';
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<Language, string>;
  referenceCode?: Record<Language, string>;
  testCases: TestCase[];
  timeLimitSec: number;
  memoryLimitMB: number;
  author?: string;
  version: string;
  usageCount?: number;
  tags?: string[];
  published?: boolean;
}

export interface TestResult {
  testCaseId: string;
  name: string;
  passed: boolean;
  isHidden: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionTimeMs: number;
  error?: string;
}

export interface ExecutionResult {
  runId: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryUsedMB: number;
  testResults: TestResult[];
  visiblePassed: number;
  visibleTotal: number;
  hiddenPassed: number;
  hiddenTotal: number;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'MEMORY_LIMIT';
  runStatus?: ExecutionRunStatus;
  queuePosition?: number;
}

export interface RubricCategory {
  id: string;
  name: string; // Problem Solving, Code Quality, Communication, Testing
  score: number; // 1 to 4
  feedback: string;
}

export interface Scorecard {
  id: string;
  interviewId: string;
  interviewerName: string;
  submittedAt: string;
  categories: RubricCategory[];
  summary: string;
  recommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
}

export interface IntegritySignal {
  id: string;
  type: 'PASTE_EVENT' | 'WINDOW_BLUR' | 'WINDOW_FOCUS' | 'UNUSUAL_CADENCE' | 'DEVTOOLS_OPEN';
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  type: 'Live' | 'Async';
  status: 'Draft' | 'Scheduled' | 'Live' | 'Ended' | 'Scorecard Due' | 'Completed' | 'Archived' | 'Cancelled';
  scheduledDate: string;
  durationMinutes: number;
  interviewerNames: string[];
  questionIds: string[];
  activeQuestionId: string;
  code: Record<Language, string>;
  selectedLanguage: Language;
  notes: string;
  scorecard?: Scorecard;
  integritySignals: IntegritySignal[];
  sessionStartedAt?: string;
  sessionEndedAt?: string;
  totalRuns: number;
  firstRunTimeMs?: number;
  visibleTestsPassed: number;
  visibleTestsTotal: number;
  questionHistory?: Record<string, string>; // questionId -> last code for that question
}

export interface AssessmentAttempt {
  id: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  status: 'Invited' | 'Not Started' | 'In Progress' | 'Submitted' | 'Timed out' | 'Graded' | 'Reviewed' | 'Expired';
  timeRemainingSeconds: number;
  totalTimeMinutes: number;
  startedAt?: string;
  submittedAt?: string;
  questionIds: string[];
  currentQuestionIndex: number;
  answers: Record<string, { code: string; language: Language; testResults?: ExecutionResult }>;
  integritySignals: IntegritySignal[];
  score?: number; // percentage
}

// ─── Access & Roles (Candidate, Interviewer, Admin) ───────────────────────────
export type UserRole = 'Candidate' | 'Interviewer' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  allowedRoles: UserRole[];
  organization: string;
  team?: string;
  mfaEnabled: boolean;
  status: 'active' | 'invited' | 'deactivated';
  lastActive: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  role: UserRole;
  action: string;
  category: 'Account' | 'Interviews' | 'Code' | 'Evaluation' | 'Questions' | 'Data' | 'Settings';
  target: string;
  result: 'Success' | 'Failure';
  ipAddress: string;
  device: string;
  requestId: string;
  details?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
  scopes: string[];
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Failing' | 'Disabled';
  deliveriesCount: number;
}

