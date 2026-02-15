import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { TurnRequest, DebateMessage } from "@/lib/types";
import { getSession, setSession } from "@/lib/store";
import { callLLM, parseJSON } from "@/lib/llm";
import { generateTurnPrompt, directorSystemPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const body: TurnRequest = await request.json();
    const session = getSession(body.sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Handle undo
    if (body.userAction === "undo") {
      if (session.messages.length > 0) {
        session.messages.pop();
        session.turnCount = Math.max(0, session.turnCount - 1);
        setSession(session);
      }
      return NextResponse.json(session);
    }

    // Start debate if in confirm state
    if (session.state === "confirm") {
      session.state = "debate_running";
    }

    if (session.state !== "debate_running") {
      return NextResponse.json({ error: "Debate is not running" }, { status: 400 });
    }

    // Add user message if pushback/reframe
    if (body.userAction && body.userMessage) {
      const userMsg: DebateMessage = {
        id: uuidv4().slice(0, 8),
        role: "user",
        content: `[${body.userAction.toUpperCase()}]: ${body.userMessage}`,
        timestamp: Date.now(),
      };
      session.messages.push(userMsg);

      if (body.userAction === "reframe") {
        session.decision = body.userMessage;
      }
    }

    // Determine next speaker
    const lastPersonaMsg = [...session.messages]
      .reverse()
      .find((m) => m.role === "persona_a" || m.role === "persona_b");
    const nextSpeaker = !lastPersonaMsg || lastPersonaMsg.role === "persona_b" ? "persona_a" : "persona_b";

    const prevMessages = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const systemPrompt = directorSystemPrompt(
      session.decision,
      session.context,
      session.constraints,
      session.optimizingFor,
      session.calibration
    );

    const turnPrompt = generateTurnPrompt(
      session.decision,
      session.context,
      session.constraints,
      session.optimizingFor,
      session.calibration,
      prevMessages,
      nextSpeaker,
      body.userAction,
      body.userMessage
    );

    const raw = await callLLM(turnPrompt, systemPrompt);
    const parsed = parseJSON<{ content: string; assumptions: string[]; heat: number }>(raw);

    const newMsg: DebateMessage = {
      id: uuidv4().slice(0, 8),
      role: nextSpeaker,
      content: parsed.content,
      timestamp: Date.now(),
      assumptions: parsed.assumptions,
    };

    session.messages.push(newMsg);
    session.turnCount++;

    // Add new assumptions
    if (parsed.assumptions) {
      for (const a of parsed.assumptions) {
        if (!session.assumptions.includes(a)) {
          session.assumptions.push(a);
        }
      }
    }

    // Check if debate should end
    const shouldEnd = session.turnCount >= 10;

    setSession(session);

    return NextResponse.json({
      session,
      heat: parsed.heat || 3,
      shouldEnd,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
