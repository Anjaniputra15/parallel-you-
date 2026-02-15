import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { CreateSessionRequest, SessionData } from "@/lib/types";
import { setSession } from "@/lib/store";
import { callLLM, parseJSON } from "@/lib/llm";
import { summaryPrompt } from "@/lib/prompts";
import { auth } from "../../../../../auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateSessionRequest = await request.json();

    if (!body.decision?.trim()) {
      return NextResponse.json({ error: "Decision is required" }, { status: 400 });
    }

    const id = uuidv4().slice(0, 8);

    let summary = body.decision;
    let assumptions: string[] = [];

    try {
      const raw = await callLLM(summaryPrompt(body.decision, body.context));
      const parsed = parseJSON<{ summary: string; assumptions: string[] }>(raw);
      summary = parsed.summary;
      assumptions = parsed.assumptions;
    } catch {
      // If LLM fails, use decision as summary
      assumptions = ["No AI summary available — using your input as-is"];
    }

    const debateSession: SessionData = {
      id,
      userId: session.user.id, // Link to authenticated user
      decision: body.decision,
      context: body.context || "",
      constraints: body.constraints || "",
      optimizingFor: body.optimizingFor || "",
      calibration: body.calibration || {
        riskTolerance: 50,
        timeHorizon: 50,
        socialImpact: 50,
        moneySensitivity: 50,
      },
      state: "confirm",
      messages: [],
      assumptions,
      summary,
      createdAt: Date.now(),
      turnCount: 0,
    };

    setSession(debateSession);

    return NextResponse.json(debateSession);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
