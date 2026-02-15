"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionData, DebateMessage } from "@/lib/types";
import { demoSession } from "@/lib/demoTranscript";
import DebateDirectorStrip from "@/components/DebateDirectorStrip";
import PersonaPanel from "@/components/PersonaPanel";
import StagePanel from "@/components/StagePanel";
import HighlightsPanel from "@/components/HighlightsPanel";
import ControlDock from "@/components/ControlDock";

const MAX_TURNS = 10;

export default function DebateStagePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [heatA, setHeatA] = useState(3);
  const [heatB, setHeatB] = useState(3);
  const [isApiMissing, setIsApiMissing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [suggestedHighlight, setSuggestedHighlight] = useState<DebateMessage | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- Demo Mode ----------
  function activateDemoMode() {
    setDemoMode(true);
    setIsApiMissing(false);
    setPaused(true);
    // Load demo transcript progressively
    setSession({ ...demoSession, messages: [], turnCount: 0, state: "debate_running" });
  }

  // Progressive demo reveal
  useEffect(() => {
    if (!demoMode || !session) return;
    const revealed = session.messages.length;
    if (revealed >= demoSession.messages.length) return;

    const timer = setTimeout(() => {
      const nextMsg = demoSession.messages[revealed];
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, nextMsg],
          turnCount: prev.turnCount + 1,
          assumptions: demoSession.assumptions.slice(0, prev.turnCount + 1),
        };
      });
      if (nextMsg.role === "persona_a") setHeatA(Math.min(5, 2 + revealed));
      if (nextMsg.role === "persona_b") setHeatB(Math.min(5, 1 + revealed));
    }, 800);

    return () => clearTimeout(timer);
  }, [demoMode, session?.messages.length]);

  // ---------- API Calls ----------
  const callTurn = useCallback(
    async (userAction?: string, userMessage?: string) => {
      if (loading || demoMode) return;
      setLoading(true);

      try {
        const res = await fetch("/api/session/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, userAction, userMessage }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (data.error?.includes("OPENAI_API_KEY") || data.error?.includes("not configured")) {
            setIsApiMissing(true);
            setPaused(true);
            return;
          }
          throw new Error(data.error);
        }

        setSession(data.session);
        const lastMsg = data.session.messages[data.session.messages.length - 1];
        if (lastMsg?.role === "persona_a") setHeatA(data.heat || 3);
        if (lastMsg?.role === "persona_b") setHeatB(data.heat || 3);

        if (data.shouldEnd) {
          toast.info("Debate complete — ready for verdict!");
          setPaused(true);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Turn failed";
        if (msg.includes("OPENAI_API_KEY") || msg.includes("not configured") || msg.includes("Session not found")) {
          setIsApiMissing(true);
          setPaused(true);
        } else {
          toast.error(msg);
          setPaused(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, demoMode, sessionId]
  );

  // Auto-play
  useEffect(() => {
    if (!paused && !loading && session && !demoMode) {
      if ((session.turnCount || 0) < MAX_TURNS && session.state === "debate_running") {
        autoPlayRef.current = setTimeout(() => callTurn(), 1500);
      }
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [paused, loading, session, callTurn, demoMode]);

  // Initial turn
  useEffect(() => {
    if (sessionId === "demo") {
      activateDemoMode();
    } else {
      callTurn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-suggest highlights every 2 turns
  useEffect(() => {
    if (!session) return;
    const msgs = session.messages.filter((m) => m.role === "persona_a" || m.role === "persona_b");
    if (msgs.length > 0 && msgs.length % 2 === 0) {
      const candidate = msgs[msgs.length - 1];
      if (!candidate.pinned && !dismissedSuggestions.has(candidate.id)) {
        setSuggestedHighlight(candidate);
      }
    }
  }, [session?.messages.length]);

  // ---------- Handlers ----------
  function togglePin(msgId: string) {
    if (!session) return;
    setSession({
      ...session,
      messages: session.messages.map((m) =>
        m.id === msgId ? { ...m, pinned: !m.pinned } : m
      ),
    });
  }

  function acceptHighlight(id: string) {
    togglePin(id);
    setSuggestedHighlight(null);
    setHighlightsOpen(true);
  }

  function dismissHighlight() {
    if (suggestedHighlight) {
      setDismissedSuggestions((prev) => new Set(prev).add(suggestedHighlight.id));
    }
    setSuggestedHighlight(null);
  }

  async function handleFastForward() {
    if (demoMode) {
      router.push(`/session/${sessionId}/verdict`);
      return;
    }
    setPaused(true);
    setLoading(true);
    try {
      const res = await fetch("/api/session/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/session/${sessionId}/verdict`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Synthesis failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------- Derived data ----------
  const messages = session?.messages || [];
  const messagesA = messages.filter((m) => m.role === "persona_a");
  const messagesB = messages.filter((m) => m.role === "persona_b");
  const userMessages = messages.filter((m) => m.role === "user");
  const pinnedMessages = messages.filter((m) => m.pinned);
  const assumptions = session?.assumptions || [];
  const turnCount = session?.turnCount || 0;
  const state = session?.state || "confirm";
  const decision = session?.summary || session?.decision || "Loading...";

  // Last message to determine who is speaking
  const lastMsg = messages[messages.length - 1];
  const speakingA = loading && (!lastMsg || lastMsg.role === "persona_b");
  const speakingB = loading && lastMsg?.role === "persona_a";

  // Hint
  const avgIntensity = Math.round((heatA + heatB) / 2);
  const hint = !messages.length
    ? ""
    : turnCount <= 2
    ? "Tip: Let both personas build their arguments before intervening"
    : avgIntensity >= 4
    ? "Recommended: Push back to test assumptions"
    : turnCount >= 6
    ? "Recommended: Fast-forward to verdict when ready"
    : "Recommended: Push back or Clarify to dig deeper";

  // ---------- Render ----------
  return (
    <div className="h-screen flex flex-col bg-background">
      <DebateDirectorStrip
        decision={decision}
        state={state}
        turnCount={turnCount}
        maxTurns={MAX_TURNS}
        intensity={avgIntensity}
      />

      {/* Desktop: 3-column layout */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Persona A */}
        <div className="flex-1 min-w-0">
          <PersonaPanel
            persona="a"
            messages={messagesA}
            isSpeaking={speakingA}
            heat={heatA}
            onPin={togglePin}
            onStartDebate={!demoMode && !isApiMissing ? () => callTurn() : undefined}
            hasMessages={messagesA.length > 0}
            isApiMissing={isApiMissing}
            onDemoMode={activateDemoMode}
          />
        </div>

        {/* Center stage */}
        <div className="w-72 xl:w-80 shrink-0">
          <StagePanel
            state={state}
            loading={loading}
            paused={paused}
            assumptions={assumptions}
            userMessages={userMessages}
            isApiMissing={isApiMissing}
            onDemoMode={activateDemoMode}
            suggestedHighlight={suggestedHighlight}
            onAcceptHighlight={acceptHighlight}
            onDismissHighlight={dismissHighlight}
          />
        </div>

        {/* Persona B */}
        <div className="flex-1 min-w-0">
          <PersonaPanel
            persona="b"
            messages={messagesB}
            isSpeaking={speakingB}
            heat={heatB}
            onPin={togglePin}
            hasMessages={messagesB.length > 0}
            isApiMissing={isApiMissing}
            onDemoMode={activateDemoMode}
          />
        </div>

        {/* Highlights drawer */}
        <HighlightsPanel
          pinnedMessages={pinnedMessages}
          assumptions={assumptions}
          open={highlightsOpen}
          onToggle={() => setHighlightsOpen(!highlightsOpen)}
        />
      </div>

      {/* Mobile: tabs */}
      <div className="flex-1 md:hidden flex flex-col overflow-hidden">
        <Tabs defaultValue="stage" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 mx-4 mt-2 shrink-0">
            <TabsTrigger value="a" className="text-xs gap-1 data-[state=active]:text-cyan-400">
              {speakingA && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              Risk-Taker
            </TabsTrigger>
            <TabsTrigger value="stage" className="text-xs">
              Stage
            </TabsTrigger>
            <TabsTrigger value="b" className="text-xs gap-1 data-[state=active]:text-violet-400">
              {speakingB && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              Pragmatist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="a" className="flex-1 overflow-hidden m-0">
            <PersonaPanel
              persona="a"
              messages={messagesA}
              isSpeaking={speakingA}
              heat={heatA}
              onPin={togglePin}
              onStartDebate={!demoMode && !isApiMissing ? () => callTurn() : undefined}
              hasMessages={messagesA.length > 0}
              isApiMissing={isApiMissing}
              onDemoMode={activateDemoMode}
            />
          </TabsContent>

          <TabsContent value="stage" className="flex-1 overflow-hidden m-0">
            <StagePanel
              state={state}
              loading={loading}
              paused={paused}
              assumptions={assumptions}
              userMessages={userMessages}
              isApiMissing={isApiMissing}
              onDemoMode={activateDemoMode}
              suggestedHighlight={suggestedHighlight}
              onAcceptHighlight={acceptHighlight}
              onDismissHighlight={dismissHighlight}
            />
          </TabsContent>

          <TabsContent value="b" className="flex-1 overflow-hidden m-0">
            <PersonaPanel
              persona="b"
              messages={messagesB}
              isSpeaking={speakingB}
              heat={heatB}
              onPin={togglePin}
              hasMessages={messagesB.length > 0}
              isApiMissing={isApiMissing}
              onDemoMode={activateDemoMode}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Control dock */}
      <ControlDock
        paused={paused}
        loading={loading}
        hasMessages={messages.length > 0}
        demoMode={demoMode}
        onTogglePause={() => setPaused(!paused)}
        onPushback={(msg) => callTurn("pushback", msg)}
        onClarify={() => callTurn("clarify")}
        onReframe={(msg) => callTurn("reframe", msg)}
        onUndo={() => callTurn("undo")}
        onFastForward={handleFastForward}
        hint={hint}
      />
    </div>
  );
}
