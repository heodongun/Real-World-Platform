export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Language = 'KOTLIN' | 'JAVA' | 'PYTHON';

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  language: Language;
  tags: string[];
  starterCode?: string | null;
}

export type SubmissionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type ExecutionStatus = 'SUCCESS' | 'FAILED' | 'ERROR' | 'TIMEOUT';

export interface SubmissionFeedback {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  score: number;
  status: ExecutionStatus;
  testResults?: TestResults;
  output?: string;
  message: string;
}

export interface TestResults {
  passed: number;
  failed: number;
  total: number;
  details: TestResult[];
  coverage?: CoverageReport;
}

export interface TestResult {
  testId: string;
  name: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  error?: string | null;
  duration: number;
}

export interface CoverageReport {
  line: number;
  branch: number;
  uncoveredLines: number[];
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  status: SubmissionStatus;
  files: Record<string, string>;
  score: number;
  feedback?: SubmissionFeedback | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  successRate: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExecutionResult {
  executionId: string;
  status: ExecutionStatus;
  output: string;
  error?: string | null;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
}

export interface ExecutionResponse {
  success: boolean;
  data: ExecutionResult;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  verificationCode: string;
}

export interface SubmissionPayload {
  problemId: string;
  files: Record<string, string>;
}

export interface ExecuteCodePayload {
  language: Language;
  files: Record<string, string>;
  testCommand: string;
}
