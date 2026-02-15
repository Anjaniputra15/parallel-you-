"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pause,
  Play,
  MessageSquare,
  FastForward,
  Send,
  X,
  MoreHorizontal,
  HelpCircle,
  RefreshCw,
  Undo2,
  Scale,
  Lightbulb,
} from "lucide-react";

interface Props {
  paused: boolean;
  loading: boolean;
  hasMessages: boolean;
  demoMode: boolean;
  onTogglePause: () => void;
  onPushback: (msg: string) => void;
  onClarify: () => void;
  onReframe: (msg: string) => void;
  onUndo: () => void;
  onFastForward: () => void;
  hint: string;
}

export default function ControlDock({
  paused,
  loading,
  hasMessages,
  demoMode,
  onTogglePause,
  onPushback,
  onClarify,
  onReframe,
  onUndo,
  onFastForward,
  hint,
}: Props) {
  const [mode, setMode] = useState<"pushback" | "reframe" | null>(null);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);

  function handleSend() {
    if (!input.trim()) return;
    if (mode === "pushback") onPushback(input);
    if (mode === "reframe") onReframe(input);
    setInput("");
    setMode(null);
  }

  return (
    <div className="sticky bottom-0 z-20 bg-background/80 backdrop-blur-md border-t border-border/50">
      {/* Hint */}
      {hint && !mode && (
        <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 border-b border-border/30">
          <Lightbulb className="h-3 w-3 text-yellow-500/60" />
          <span className="text-[10px] text-muted-foreground">{hint}</span>
        </div>
      )}

      {/* Inline input */}
      {mode && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30">
          <span className="text-[10px] text-muted-foreground shrink-0 uppercase tracking-wider">
            {mode === "pushback" ? "Challenge" : "Reframe"}
          </span>
          <Input
            className="h-8 text-sm flex-1"
            placeholder={mode === "pushback" ? "Challenge both personas..." : "Restate your decision differently..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            autoFocus
          />
          <Button size="sm" className="h-8 w-8 p-0" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setMode(null); setInput(""); }}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Main controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-2.5">
        {/* Pause/Resume */}
        {!demoMode && (
          <Button
            size="sm"
            variant={paused ? "default" : "secondary"}
            onClick={onTogglePause}
            className="gap-1.5 text-xs"
            disabled={loading}
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        )}

        {/* Push back */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setMode("pushback")}
          disabled={loading || !hasMessages}
          className="gap-1.5 text-xs"
        >
          <MessageSquare className="h-3 w-3" />
          <span className="hidden sm:inline">Push back</span>
        </Button>

        {/* Fast-forward */}
        <Button
          size="sm"
          onClick={onFastForward}
          disabled={loading || (!hasMessages && !demoMode)}
          className="gap-1.5 text-xs"
        >
          <FastForward className="h-3 w-3" />
          <span className="hidden sm:inline">Verdict</span>
        </Button>

        {/* More menu */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowMore(!showMore)}
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {showMore && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
              <div className="absolute bottom-full right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg p-1 z-50 min-w-[140px] animate-in fade-in slide-in-from-bottom-1 duration-150">
                <button
                  onClick={() => { onClarify(); setShowMore(false); }}
                  disabled={loading || !hasMessages}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HelpCircle className="h-3 w-3" /> Clarify
                </button>
                <button
                  onClick={() => { setMode("reframe"); setShowMore(false); }}
                  disabled={loading}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-3 w-3" /> Reframe
                </button>
                <button
                  onClick={() => { onUndo(); setShowMore(false); }}
                  disabled={loading || !hasMessages}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Undo2 className="h-3 w-3" /> Undo last
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
