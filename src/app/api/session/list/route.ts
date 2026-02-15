import { NextResponse } from "next/server";
import { getUserSessions } from "@/lib/store";
import { auth } from "../../../../../auth";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get only this user's sessions
    const userSessions = getUserSessions(session.user.id);

    // Return simplified data for history page
    const historyItems = userSessions.map((s) => ({
      id: s.id,
      decision: s.decision,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(historyItems);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
