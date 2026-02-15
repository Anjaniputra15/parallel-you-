export type SessionState =
  | "intake"
  | "confirm"
  | "debate_running"
  | "debate_paused"
  | "synthesis"
  | "verdict_ready";

export interface Calibration {
  riskTolerance: number;
  timeHorizon: number;
  socialImpact: number;
  moneySensitivity: number;
}

export interface DebateMessage {
  id: string;
  role: "persona_a" | "persona_b" | "user" | "system";
  content: string;
  timestamp: number;
  pinned?: boolean;
  assumptions?: string[];
}

export interface SessionData {
  id: string;
  userId: string; // User ID from authentication
  decision: string;
  context: string;
  constraints: string;
  optimizingFor: string;
  calibration: Calibration;
  state: SessionState;
  messages: DebateMessage[];
  assumptions: string[];
  summary?: string;
  verdict?: VerdictData;
  createdAt: number;
  turnCount: number;
}

export interface VerdictData {
  bestPointsA: string[];
  bestPointsB: string[];
  sharedFacts: string[];
  openQuestions: string[];
  recommendedNextStep: string;
  userDecision?: string;
  userReason?: string;
}

export interface CreateSessionRequest {
  decision: string;
  context: string;
  constraints: string;
  optimizingFor: string;
  calibration: Calibration;
}

export interface TurnRequest {
  sessionId: string;
  userAction?: "pushback" | "clarify" | "reframe" | "undo";
  userMessage?: string;
}

export interface SynthesizeRequest {
  sessionId: string;
}
