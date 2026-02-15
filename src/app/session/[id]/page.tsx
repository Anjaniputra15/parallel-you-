"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { SessionData, DebateMessage } from "@/lib/types";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";

// ─── Design System Tokens ───
const T = {
  bg: "#0a0e14",
  surface: "#111820",
  surfaceElevated: "#171f2a",
  border: "#1e2a38",
  borderFocus: "#2a3a4e",
  textPrimary: "#e8ecf1",
  textSecondary: "#7a8ba0",
  textMuted: "#4a5a6e",
  personaA: "#f0a030",
  personaABg: "rgba(240,160,48,0.06)",
  personaABorder: "rgba(240,160,48,0.15)",
  personaAGlow: "rgba(240,160,48,0.25)",
  personaB: "#3ea8d0",
  personaBBg: "rgba(62,168,208,0.06)",
  personaBBorder: "rgba(62,168,208,0.15)",
  personaBGlow: "rgba(62,168,208,0.25)",
  green: "#3dd68c",
  amber: "#f0a030",
  red: "#e85454",
  purple: "#a07cf0",
};

const MAX_TURNS = 10;

// ─── Typing Animation Hook (per-message) ───
function useTypingAnimation(text: string, msgId: string | null, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const prevMsgId = useRef<string | null>(null);

  useEffect(() => {
    if (!msgId || !text) {
      setDisplayed("");
      setIsDone(false);
      return;
    }
    // Only restart animation when message ID changes
    if (msgId === prevMsgId.current) return;
    prevMsgId.current = msgId;

    setDisplayed("");
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, msgId, speed]);

  return { displayed, isDone };
}

// ─── Components ───

function HeatIndicator({ level }: { level: number }) {
  const flames = ["🔥", "🔥", "🔥", "🔥", "🔥"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 11, color: T.textMuted, marginRight: 4, fontFamily: "'DM Mono', monospace" }}>HEAT</span>
      {flames.map((f, i) => (
        <span
          key={i}
          style={{
            fontSize: 14,
            opacity: i < level ? 1 : 0.15,
            filter: i < level ? "none" : "grayscale(1)",
            transition: "all 0.4s ease",
            transform: i < level ? "scale(1.1)" : "scale(0.85)",
          }}
        >
          {f}
        </span>
      ))}
    </div>
  );
}

function ProgressBar({ current, total, color }: { current: number; total: number; color: string }) {
  const pct = (current / total) * 100;
  return (
    <div style={{
      width: "100%", height: 3, background: T.border, borderRadius: 2,
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}88)`,
        borderRadius: 2, transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: `0 0 12px ${color}40`,
      }} />
    </div>
  );
}

function Chip({ label, kind }: { label: string; kind: "context" | "assumption" | "general" }) {
  const styles = {
    context: { bg: "rgba(61,214,140,0.1)", border: "rgba(61,214,140,0.25)", color: T.green, icon: "◈" },
    assumption: { bg: "rgba(240,160,48,0.1)", border: "rgba(240,160,48,0.25)", color: T.amber, icon: "◇" },
    general: { bg: "rgba(122,139,160,0.08)", border: "rgba(122,139,160,0.2)", color: T.textSecondary, icon: "○" },
  };
  const s = styles[kind] || styles.general;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 8 }}>{s.icon}</span> {label}
    </span>
  );
}

function PersonaHeader({ side, isSpeaking }: { side: "A" | "B"; isSpeaking: boolean }) {
  const isA = side === "A";
  const color = isA ? T.personaA : T.personaB;
  const name = isA ? "Risk-Taker You" : "Pragmatist You";
  const motto = isA ? "Fortune favours the bold" : "Measure twice, cut once";
  const icon = isA ? "⚡" : "🛡";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
      borderBottom: `1px solid ${isA ? T.personaABorder : T.personaBBorder}`,
      background: isSpeaking ? (isA ? T.personaABg : T.personaBBg) : "transparent",
      transition: "background 0.5s ease",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        border: `2px solid ${isSpeaking ? color : color + "40"}`,
        boxShadow: isSpeaking ? `0 0 20px ${color}30` : "none",
        transition: "all 0.5s ease",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: T.textPrimary,
          fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", gap: 8,
        }}>
          {name}
          {isSpeaking && (
            <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 3, height: 12, borderRadius: 2, background: color,
                  animation: `pulse-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                }} />
              ))}
            </span>
          )}
        </div>
        <div style={{
          fontSize: 11, color: T.textMuted, fontStyle: "italic",
          fontFamily: "'DM Mono', monospace",
        }}>
          {motto}
        </div>
      </div>
      <div style={{
        padding: "3px 10px", borderRadius: 12, fontSize: 10,
        fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: "0.08em",
        background: isA ? T.personaABg : T.personaBBg,
        color: color, border: `1px solid ${isA ? T.personaABorder : T.personaBBorder}`,
        textTransform: "uppercase",
      }}>
        {isA ? "A" : "B"}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: DebateMessage;
  isLatest: boolean;
  typedText: string;
  showChips: boolean;
}

function MessageBubble({ message, isLatest, typedText, showChips }: MessageBubbleProps) {
  const text = isLatest ? typedText : message.content;
  const isA = message.role === "persona_a";
  const color = isA ? T.personaA : T.personaB;

  return (
    <div style={{
      padding: "14px 18px", margin: "0",
      background: "transparent",
      animation: isLatest ? "fadeSlideIn 0.4s ease-out" : "none",
      borderBottom: `1px solid ${T.border}44`,
    }}>
      <p style={{
        fontSize: 14, lineHeight: 1.7, color: T.textPrimary, margin: 0,
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}>
        {text}
        {isLatest && !showChips && (
          <span style={{
            display: "inline-block", width: 2, height: 16, background: color,
            marginLeft: 2, verticalAlign: "text-bottom",
            animation: "blink-cursor 0.8s steps(2) infinite",
          }} />
        )}
      </p>
      {showChips && message.assumptions && message.assumptions.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12,
          animation: "fadeIn 0.5s ease-out",
        }}>
          {message.assumptions.map((a, i) => <Chip key={i} label={a} kind="assumption" />)}
        </div>
      )}
    </div>
  );
}

interface ControlButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
  isActive?: boolean;
}

function ControlButton({ icon, label, onClick, color, disabled, isActive }: ControlButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "10px 18px", borderRadius: 12, border: `1px solid ${T.border}`,
        background: isActive ? (color || T.textMuted) + "15" : hover ? T.surfaceElevated : T.surface,
        color: isActive ? (color || T.textPrimary) : hover ? T.textPrimary : T.textSecondary,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s ease",
        fontFamily: "'DM Mono', monospace",
        fontSize: 11, fontWeight: 500, letterSpacing: "0.03em",
        minWidth: 72,
        boxShadow: isActive ? `0 0 16px ${color || T.textMuted}15` : "none",
        outline: "none",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── Inline Input Bar ───
function InlineInput({
  placeholder,
  onSubmit,
  onCancel,
  color,
}: {
  placeholder: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  color: string;
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div style={{
      display: "flex", gap: 8, flex: 1, alignItems: "center",
      background: T.surfaceElevated, borderRadius: 12, padding: "6px 12px",
      border: `1px solid ${color}40`,
    }}>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: T.textPrimary, fontSize: 13, fontFamily: "'Sora', sans-serif",
        }}
      />
      <button onClick={handleSubmit} style={{
        padding: "6px 16px", borderRadius: 8, border: "none",
        background: color, color: "#fff", fontSize: 12, fontWeight: 600,
        cursor: "pointer", fontFamily: "'Sora', sans-serif",
      }}>
        Send
      </button>
      <button onClick={onCancel} style={{
        padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`,
        background: "transparent", color: T.textSecondary, fontSize: 12,
        cursor: "pointer", fontFamily: "'DM Mono', monospace",
      }}>
        ✕
      </button>
    </div>
  );
}

// ─── Main Component ───
export default function PremiumDebatePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [heatA, setHeatA] = useState(3);
  const [heatB, setHeatB] = useState(3);
  const [phase, setPhase] = useState<"ready" | "debating" | "paused" | "synthesis" | "verdict">("ready");
  const [animatingMsgId, setAnimatingMsgId] = useState<string | null>(null);
  const [pushbackOpen, setPushbackOpen] = useState(false);
  const [reframeOpen, setReframeOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const scrollRefA = useRef<HTMLDivElement>(null);
  const scrollRefB = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenMessageId = useRef<string | null>(null);

  // Voice synthesis
  const { speak, cancel, isSpeaking, voices } = useSpeechSynthesis();

  // Voice commands
  useVoiceCommands({
    enabled: voiceCommandsEnabled && phase === "debating",
    commands: [
      {
        command: "pause",
        aliases: ["stop", "wait"],
        action: () => {
          setPaused(true);
          toast.success("Voice command: Paused");
        },
      },
      {
        command: "continue",
        aliases: ["resume", "go", "play"],
        action: () => {
          if (paused) {
            setPaused(false);
            toast.success("Voice command: Resumed");
          }
        },
      },
      {
        command: "push back",
        aliases: ["challenge", "disagree"],
        action: () => {
          setPushbackOpen(true);
          toast.success("Voice command: Push back");
        },
      },
      {
        command: "reframe",
        aliases: ["change perspective", "different angle"],
        action: () => {
          setReframeOpen(true);
          toast.success("Voice command: Reframe");
        },
      },
      {
        command: "undo",
        aliases: ["go back", "remove last"],
        action: () => {
          handleUndo();
          toast.success("Voice command: Undo");
        },
      },
    ],
  });

  // Fetch session data on mount (no turn fired)
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        const data = await res.json();
        if (res.ok) {
          setSession(data.session);
          // If session already has messages, jump to debating
          if (data.session.messages?.length > 0) {
            setPhase("debating");
          }
        }
      } catch {
        // Session will be created on first turn
      }
    }
    loadSession();
  }, [sessionId]);

  // Fetch or generate turns
  const callTurn = useCallback(
    async (userAction?: string, userMessage?: string) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await fetch("/api/session/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, userAction, userMessage }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setSession(data.session);
        const lastMsg = data.session.messages[data.session.messages.length - 1];
        if (lastMsg) {
          setAnimatingMsgId(lastMsg.id);
        }
        if (lastMsg?.role === "persona_a") setHeatA(data.heat || 3);
        if (lastMsg?.role === "persona_b") setHeatB(data.heat || 3);

        if (data.shouldEnd) {
          toast.info("Debate complete!");
          setPaused(true);
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Turn failed");
        setPaused(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  // Auto-play
  useEffect(() => {
    if (!paused && !loading && session && phase === "debating") {
      if ((session.turnCount || 0) < MAX_TURNS && session.state === "debate_running") {
        autoPlayRef.current = setTimeout(() => callTurn(), 1500);
      }
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [paused, loading, session, phase, callTurn]);

  // Auto-scroll both panels when messages change
  const messages = session?.messages || [];
  useEffect(() => {
    if (messages.length === 0) return;
    setTimeout(() => {
      scrollRefA.current?.scrollTo({ top: scrollRefA.current.scrollHeight, behavior: "smooth" });
      scrollRefB.current?.scrollTo({ top: scrollRefB.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [messages.length]);

  const messagesA = messages.filter((m) => m.role === "persona_a");
  const messagesB = messages.filter((m) => m.role === "persona_b");
  const latestMsg = messages[messages.length - 1];

  // Speaking indicator: true during loading AND typing animation
  const isAnimatingA = animatingMsgId != null && latestMsg?.id === animatingMsgId && latestMsg?.role === "persona_a";
  const isAnimatingB = animatingMsgId != null && latestMsg?.id === animatingMsgId && latestMsg?.role === "persona_b";
  const isSpeakingA = (loading && (!latestMsg || latestMsg.role === "persona_b")) || isAnimatingA;
  const isSpeakingB = (loading && latestMsg?.role === "persona_a") || isAnimatingB;

  const { displayed: typedText, isDone: typingDone } = useTypingAnimation(
    latestMsg?.content || "",
    phase === "debating" ? animatingMsgId : null,
    18
  );

  // Clear animating state when typing finishes
  useEffect(() => {
    if (typingDone && animatingMsgId) {
      setAnimatingMsgId(null);
    }
  }, [typingDone, animatingMsgId]);

  useEffect(() => {
    if (typingDone && phase === "debating") {
      const nextHeat = Math.min(5, Math.floor((session?.turnCount || 0) / 2) + 2);
      setHeatA(nextHeat);
      setHeatB(nextHeat - 1);
    }
  }, [typingDone, phase, session?.turnCount]);

  const startDebate = () => {
    setPhase("debating");
    setPaused(false);
    callTurn();
  };

  const handlePause = () => {
    if (phase === "debating") {
      setPhase("paused");
      setPaused(true);
    } else if (phase === "paused") {
      setPhase("debating");
      setPaused(false);
    }
  };

  async function handleFastForward() {
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

  function handleUndo() {
    if (!session || session.messages.length === 0) return;
    const updated = { ...session, messages: session.messages.slice(0, -1) };
    setSession(updated);
    toast.success("Removed last message");
  }

  // Auto-speak new messages when voice is enabled
  useEffect(() => {
    if (!voiceEnabled || !session || !session.messages.length) return;

    const lastMessage = session.messages[session.messages.length - 1];
    if (lastMessage.id === lastSpokenMessageId.current) return;

    // Only speak AI personas, not user messages
    if (lastMessage.role === "persona_a" || lastMessage.role === "persona_b") {
      lastSpokenMessageId.current = lastMessage.id;

      // Use different voices for different personas
      const voiceIndex = lastMessage.role === "persona_a" ? 0 : 1;
      const rate = lastMessage.role === "persona_a" ? 1.1 : 0.95; // Risk-taker speaks faster
      const pitch = lastMessage.role === "persona_a" ? 1.1 : 0.9;

      speak(lastMessage.content, voiceIndex, rate, pitch);
    }
  }, [session, voiceEnabled, speak]);

  const turnCount = session?.turnCount || 0;
  const roundNum = Math.floor(turnCount / 2) + 1;
  const totalRounds = Math.ceil(MAX_TURNS / 2);
  const progress = (turnCount / MAX_TURNS) * 100;
  const avgHeat = Math.round((heatA + heatB) / 2);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-bar { 0% { transform: scaleY(0.4); opacity: 0.5; } 100% { transform: scaleY(1); opacity: 1; } }
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .debate-panel::-webkit-scrollbar { width: 4px; }
        .debate-panel::-webkit-scrollbar-track { background: transparent; }
        .debate-panel::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        .debate-panel::-webkit-scrollbar-thumb:hover { background: ${T.borderFocus}; }
      `}</style>

      <div style={{
        width: "100%", height: "100dvh", background: T.bg,
        display: "flex", flexDirection: "column", overflow: "hidden",
        fontFamily: "'Sora', sans-serif",
      }}>
        {/* TOP BAR */}
        <div style={{
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 16,
          borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0,
        }}>
          <button onClick={() => router.push("/")} style={{
            background: "none", border: "none", color: T.textSecondary, cursor: "pointer",
            fontSize: 18, padding: "4px 8px", display: "flex", alignItems: "center",
          }}>←</button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: T.textPrimary,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: 500,
            }}>
              {session?.decision || "Loading..."}
            </div>
            <div style={{ marginTop: 6 }}>
              <ProgressBar current={progress} total={100} color={T.purple} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              fontSize: 11, color: T.textMuted, fontFamily: "'DM Mono', monospace",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 8, background: T.surfaceElevated,
                border: `1px solid ${T.border}`, color: T.textSecondary, fontWeight: 500,
              }}>
                ROUND {roundNum}/{totalRounds}
              </span>
              <span style={{
                padding: "3px 10px", borderRadius: 8, background: T.surfaceElevated,
                border: `1px solid ${T.border}`, color: T.purple, fontWeight: 500,
              }}>
                {phase === "ready" ? "READY" : phase === "paused" ? "PAUSED" : "LIVE"}
              </span>
            </div>
            <HeatIndicator level={avgHeat} />
          </div>
        </div>

        {/* MAIN STAGE */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Persona A */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            borderRight: `1px solid ${T.border}`,
            background: isSpeakingA ? `linear-gradient(180deg, ${T.personaABg}, transparent 40%)` : T.bg,
            transition: "background 0.6s ease",
          }}>
            <PersonaHeader side="A" isSpeaking={isSpeakingA} />
            <div ref={scrollRefA} className="debate-panel" style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              {phase === "ready" ? (
                <div style={{
                  padding: 32, textAlign: "center", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", height: "100%", gap: 16, opacity: 0.7,
                }}>
                  <span style={{ fontSize: 36 }}>⚡</span>
                  <p style={{
                    fontSize: 14, color: T.textSecondary, lineHeight: 1.6,
                    fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic", maxWidth: 240,
                  }}>
                    I push for action. I challenge fear.<br />I see the upside others miss.
                  </p>
                </div>
              ) : (
                messagesA.map((msg) => {
                  const isLatest = msg.id === latestMsg?.id && animatingMsgId === msg.id;
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isLatest={isLatest && phase === "debating"}
                      typedText={isLatest ? typedText : msg.content}
                      showChips={isLatest ? typingDone : true}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Center Divider */}
          <div style={{
            width: 56, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: T.surface, borderLeft: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}`,
            gap: 12, flexShrink: 0,
          }}>
            {phase === "ready" && (
              <div style={{
                writingMode: "vertical-rl", textOrientation: "mixed",
                fontSize: 11, color: T.textMuted, fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.15em",
              }}>VS</div>
            )}
            {phase === "debating" && (
              <>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: isSpeakingA ? T.personaA : T.personaB,
                  boxShadow: `0 0 12px ${isSpeakingA ? T.personaAGlow : T.personaBGlow}`,
                  animation: "glow-pulse 1.5s ease infinite",
                }} />
                <div style={{
                  writingMode: "vertical-rl",
                  fontSize: 10, color: T.textMuted, fontFamily: "'DM Mono', monospace",
                }}>LIVE</div>
              </>
            )}
            {phase === "paused" && (
              <div style={{
                writingMode: "vertical-rl",
                fontSize: 10, color: T.amber, fontFamily: "'DM Mono', monospace",
                fontWeight: 700, letterSpacing: "0.15em",
              }}>PAUSED</div>
            )}
          </div>

          {/* Persona B */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            background: isSpeakingB ? `linear-gradient(180deg, ${T.personaBBg}, transparent 40%)` : T.bg,
            transition: "background 0.6s ease",
          }}>
            <PersonaHeader side="B" isSpeaking={isSpeakingB} />
            <div ref={scrollRefB} className="debate-panel" style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              {phase === "ready" ? (
                <div style={{
                  padding: 32, textAlign: "center", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", height: "100%", gap: 16, opacity: 0.7,
                }}>
                  <span style={{ fontSize: 36 }}>🛡</span>
                  <p style={{
                    fontSize: 14, color: T.textSecondary, lineHeight: 1.6,
                    fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic", maxWidth: 240,
                  }}>
                    I protect the downside. I ask hard questions.<br />I make sure we&apos;re prepared.
                  </p>
                </div>
              ) : (
                messagesB.map((msg) => {
                  const isLatest = msg.id === latestMsg?.id && animatingMsgId === msg.id;
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isLatest={isLatest && phase === "debating"}
                      typedText={isLatest ? typedText : msg.content}
                      showChips={isLatest ? typingDone : true}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* CONTROL BAR */}
        <div style={{
          padding: "14px 24px", borderTop: `1px solid ${T.border}`,
          background: T.surface, display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          {phase === "ready" && (
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <button
                onClick={startDebate}
                style={{
                  padding: "14px 48px", borderRadius: 14,
                  background: `linear-gradient(135deg, ${T.personaA}, ${T.red})`,
                  color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Sora', sans-serif",
                  boxShadow: `0 4px 24px ${T.personaA}30`,
                  letterSpacing: "0.02em",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
              >
                ⚡ Let Them Argue
              </button>
            </div>
          )}

          {(phase === "debating" || phase === "paused") && (
            <>
              {pushbackOpen ? (
                <InlineInput
                  placeholder="Challenge their reasoning..."
                  onSubmit={(text) => {
                    setPushbackOpen(false);
                    callTurn("pushback", text);
                  }}
                  onCancel={() => setPushbackOpen(false)}
                  color={T.red}
                />
              ) : reframeOpen ? (
                <InlineInput
                  placeholder="Reframe the debate as..."
                  onSubmit={(text) => {
                    setReframeOpen(false);
                    callTurn("reframe", text);
                  }}
                  onCancel={() => setReframeOpen(false)}
                  color={T.green}
                />
              ) : (
                <>
                  <ControlButton
                    icon={phase === "paused" ? "▶" : "⏸"}
                    label={phase === "paused" ? "Resume" : "Pause"}
                    onClick={handlePause}
                    color={T.amber}
                    isActive={phase === "paused"}
                  />
                  <ControlButton
                    icon="✋"
                    label="Push Back"
                    onClick={() => { setPaused(true); setPhase("paused"); setPushbackOpen(true); }}
                    color={T.red}
                    disabled={loading}
                  />
                  <ControlButton
                    icon="🔄"
                    label="Reframe"
                    onClick={() => { setPaused(true); setPhase("paused"); setReframeOpen(true); }}
                    color={T.green}
                    disabled={loading}
                  />
                  <ControlButton
                    icon="↩"
                    label="Undo"
                    onClick={() => callTurn("undo")}
                    color={T.textSecondary}
                    disabled={loading || messages.length === 0}
                  />
                  <ControlButton icon="🔍" label="Clarify" onClick={() => callTurn("clarify")} color={T.personaB} disabled={loading} />

                  <div style={{ flex: 1 }} />

                  <ControlButton
                    icon={voiceEnabled ? "🔊" : "🔇"}
                    label={voiceEnabled ? "Voice On" : "Voice Off"}
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      if (voiceEnabled) cancel();
                      toast.success(voiceEnabled ? "Voice output disabled" : "Voice output enabled");
                    }}
                    color={voiceEnabled ? T.green : T.textMuted}
                    isActive={voiceEnabled}
                  />
                  <ControlButton
                    icon={voiceCommandsEnabled ? "🎤" : "🎙️"}
                    label={voiceCommandsEnabled ? "Commands On" : "Commands Off"}
                    onClick={() => {
                      setVoiceCommandsEnabled(!voiceCommandsEnabled);
                      toast.success(voiceCommandsEnabled ? "Voice commands disabled" : 'Voice commands enabled - say "pause", "continue", etc.');
                    }}
                    color={voiceCommandsEnabled ? T.personaA : T.textMuted}
                    isActive={voiceCommandsEnabled}
                  />
                  <ControlButton
                    icon="⏭"
                    label="Verdict"
                    onClick={handleFastForward}
                    color={T.purple}
                    disabled={loading}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
