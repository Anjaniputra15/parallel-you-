import { NextResponse } from "next/server";
import { SynthesizeRequest } from "@/lib/types";
import { getSession, setSession } from "@/lib/store";
import { callLLM, parseJSON } from "@/lib/llm";
import { synthesisPrompt } from "@/lib/prompts";
import { VerdictData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body: SynthesizeRequest = await request.json();
    const session = getSession(body.sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Early return if verdict already exists
    if (session.state === "verdict_ready" && session.verdict) {
      return NextResponse.json(session);
    }

    const pinnedMessages = session.messages
      .filter((m) => m.pinned)
      .map((m) => `[${m.role}]: ${m.content}`);

    const messages = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let verdict: VerdictData;
    try {
      const raw = await callLLM(synthesisPrompt(session.decision, messages, pinnedMessages));
      verdict = parseJSON<VerdictData>(raw);
    } catch (error) {
      // Reset state so user can retry
      session.state = "debate_running";
      setSession(session);
      throw error;
    }

    session.verdict = verdict;
    session.state = "verdict_ready";
    setSession(session);

    return NextResponse.json(session);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
