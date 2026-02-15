"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pin, Zap, Shield } from "lucide-react";
import { DebateMessage } from "@/lib/types";

interface Props {
  persona: "a" | "b";
  messages: DebateMessage[];
  isSpeaking: boolean;
  heat: number;
  onPin: (id: string) => void;
  onStartDebate?: () => void;
  hasMessages: boolean;
  isApiMissing?: boolean;
  onDemoMode?: () => void;
}

const CONFIG = {
  a: {
    name: "Risk-Taker You",
    motto: "Fortune favours the bold",
    icon: Zap,
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    accentText: "text-cyan-400",
    accentRing: "ring-cyan-500/40",
    avatarBg: "bg-cyan-500/20",
    bubbleBg: "bg-cyan-950/40 border-cyan-500/15",
    traits: ["Action-oriented", "Opportunity-focused", "Challenges fear", "Values speed", "Sees upside"],
  },
  b: {
    name: "Pragmatist You",
    motto: "Measure twice, cut once",
    icon: Shield,
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/20",
    accentText: "text-violet-400",
    accentRing: "ring-violet-500/40",
    avatarBg: "bg-violet-500/20",
    bubbleBg: "bg-violet-950/40 border-violet-500/15",
    traits: ["Risk-aware", "Plans ahead", "Challenges impulse", "Values stability", "Sees downside"],
  },
};

export default function PersonaPanel({
  persona,
  messages,
  isSpeaking,
  heat,
  onPin,
  onStartDebate,
  hasMessages,
  isApiMissing,
  onDemoMode,
}: Props) {
  const c = CONFIG[persona];
  const Icon = c.icon;
  const label = persona === "a" ? "A" : "B";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-border/50 flex items-center gap-3 ${c.accentBg}`}>
        {/* Avatar with speaking ring */}
        <div className="relative">
          <div
            className={`w-9 h-9 rounded-full ${c.avatarBg} flex items-center justify-center ${c.accentText} text-xs font-bold transition-all ${
              isSpeaking ? `ring-2 ${c.accentRing} animate-persona-speak` : ""
            }`}
          >
            {label}
          </div>
          {isSpeaking && (
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${c.accentText}`} />
            {c.name}
          </div>
          <div className="text-[10px] text-muted-foreground italic">{c.motto}</div>
        </div>
        {/* Heat indicator */}
        <div className="flex gap-px">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1 h-3 rounded-full transition-colors duration-500 ${
                i <= heat ? "bg-orange-500" : "bg-muted-foreground/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Messages or empty state */}
      <ScrollArea className="flex-1">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center min-h-[300px]">
            <div className={`w-14 h-14 rounded-full ${c.avatarBg} flex items-center justify-center mb-4`}>
              <Icon className={`h-6 w-6 ${c.accentText}`} />
            </div>
            <p className="text-sm text-muted-foreground mb-3 max-w-[220px] leading-relaxed">
              {persona === "a"
                ? "I push for action. I challenge fear. I see the upside others miss."
                : "I protect the downside. I ask hard questions. I make sure we're prepared."}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-5">
              {c.traits.map((t) => (
                <Badge key={t} variant="outline" className={`text-[10px] ${c.accentBorder} ${c.accentText}`}>
                  {t}
                </Badge>
              ))}
            </div>
            {isApiMissing ? (
              <Button size="sm" variant="outline" onClick={onDemoMode} className="text-xs">
                Try Demo Mode
              </Button>
            ) : onStartDebate ? (
              <Button size="sm" onClick={onStartDebate} className="text-xs gap-1">
                <Icon className="h-3 w-3" /> Start Debate
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="p-3 space-y-2.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl text-sm border ${c.bubbleBg} animate-in fade-in slide-in-from-bottom-1 duration-300`}
              >
                <p className="leading-relaxed text-foreground/90">{msg.content}</p>

                {msg.assumptions && msg.assumptions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {msg.assumptions.map((a, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] bg-yellow-500/5 border-yellow-500/20 text-yellow-400/80">
                        Assumption: {a}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end mt-1.5">
                  <button
                    onClick={() => onPin(msg.id)}
                    className={`p-1 rounded-md transition-colors ${
                      msg.pinned
                        ? "text-yellow-400 bg-yellow-500/10"
                        : "text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/50"
                    }`}
                    title={msg.pinned ? "Unpin highlight" : "Pin as highlight"}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
