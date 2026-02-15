"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GitFork, Activity } from "lucide-react";
import { SessionState } from "@/lib/types";

interface Props {
  decision: string;
  state: SessionState;
  turnCount: number;
  maxTurns: number;
  intensity: number; // 1-5
}

function phaseLabel(state: SessionState): string {
  switch (state) {
    case "confirm":
      return "Confirm";
    case "debate_running":
      return "Live";
    case "debate_paused":
      return "Paused";
    case "synthesis":
      return "Synthesis";
    case "verdict_ready":
      return "Verdict";
    default:
      return "Setup";
  }
}

function phaseBadgeClass(state: SessionState): string {
  switch (state) {
    case "debate_running":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "debate_paused":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "synthesis":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function intensityLabel(i: number): { text: string; cls: string } {
  if (i <= 2) return { text: "Low", cls: "text-blue-400" };
  if (i <= 3) return { text: "Med", cls: "text-yellow-400" };
  return { text: "High", cls: "text-orange-400" };
}

export default function DebateDirectorStrip({ decision, state, turnCount, maxTurns, intensity }: Props) {
  const { text: intText, cls: intCls } = intensityLabel(intensity);

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-3 px-4 py-2.5 max-w-screen-2xl mx-auto">
        {/* Back + logo */}
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <GitFork className="h-4 w-4 text-primary shrink-0" />

        {/* Decision */}
        <p className="text-sm truncate flex-1 min-w-0 text-muted-foreground">{decision}</p>

        {/* Phase badge */}
        <Badge variant="outline" className={`text-[10px] shrink-0 ${phaseBadgeClass(state)}`}>
          {phaseLabel(state)}
        </Badge>

        {/* Turn dots */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {Array.from({ length: maxTurns }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i < turnCount
                  ? "bg-primary"
                  : i === turnCount
                  ? "bg-primary/50 animate-pulse"
                  : "bg-muted-foreground/20"
              }`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1.5 tabular-nums">
            {turnCount}/{maxTurns}
          </span>
        </div>

        {/* Mobile turn count */}
        <span className="sm:hidden text-[10px] text-muted-foreground tabular-nums shrink-0">
          {turnCount}/{maxTurns}
        </span>

        {/* Intensity */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <Activity className={`h-3 w-3 ${intCls}`} />
          <span className={`text-[10px] ${intCls}`}>{intText}</span>
        </div>
      </div>
    </div>
  );
}
