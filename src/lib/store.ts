import { SessionData } from "./types";

// Use globalThis to persist across hot reloads and route handlers in dev
const globalStore = globalThis as unknown as {
  __parallelYouSessions?: Map<string, SessionData>;
};

if (!globalStore.__parallelYouSessions) {
  globalStore.__parallelYouSessions = new Map<string, SessionData>();
}

const sessions = globalStore.__parallelYouSessions;

export function getSession(id: string): SessionData | undefined {
  return sessions.get(id);
}

export function setSession(session: SessionData): void {
  sessions.set(session.id, session);
}

export function getAllSessions(): SessionData[] {
  return Array.from(sessions.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getUserSessions(userId: string): SessionData[] {
  return Array.from(sessions.values())
    .filter((session) => session.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}
