"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Pause,
  Play,
  AlertTriangle,
  KeyRound,
  Sparkles,
  MessageSquare,
  X,
} from "lucide-react";
import { DebateMessage, SessionState } from "@/lib/types";

interface Props {
  state: SessionState;
  loading: boolean;
  paused: boolean;
  assumptions: string[];
  userMessages: DebateMessage[];
  isApiMissing: boolean;
  onDemoMode: () => void;
  // Auto-highlight
  suggestedHighlight: DebateMessage | null;
  onAcceptHighlight: (id: string) => void;
  onDismissHighlight: () => void;
}

export default function StagePanel({
  state,
  loading,
  paused,
  assumptions,
  userMessages,
  isApiMissing,
  onDemoMode,
  suggestedHighlight,
  onAcceptHighlight,
  onDismissHighlight,
}: Props) {
  return (
    <div className="flex flex-col h-full border-x border-border/50">
      {/* Status bar */}
      <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">Generating...</span>
          </>
        ) : paused ? (
          <>
            <Pause className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-xs text-yellow-400">Paused</span>
          </>
        ) : state === "debate_running" ? (
          <>
            <Play className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs text-green-400">Live</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground capitalize">{state.replace("_", " ")}</span>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* API missing state */}
          {isApiMissing && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="pt-5 text-center space-y-3">
                <KeyRound className="h-8 w-8 mx-auto text-yellow-500/60" />
                <h3 className="text-sm font-medium">Connect a model to start</h3>
                <ol className="text-xs text-muted-foreground text-left space-y-1.5 max-w-[260px] mx-auto">
                  <li>
                    1. Create <code className="text-[10px] bg-muted px-1 py-0.5 rounded">.env.local</code> in
                    project root
                  </li>
                  <li>
                    2. Add <code className="text-[10px] bg-muted px-1 py-0.5 rounded">OPENAI_API_KEY=sk-...</code>
                  </li>
                  <li>3. Restart the dev server</li>
                </ol>
                <Button size="sm" variant="outline" onClick={onDemoMode} className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" /> Try Demo Mode
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User challenges (push-back / reframe messages) */}
          {userMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Your challenges
              </p>
              {userMessages.map((m) => (
                <Card key={m.id} className="border-primary/20 bg-primary/5">
                  <CardContent className="py-2.5 px-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs leading-relaxed">{m.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Assumptions */}
          {assumptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Assumptions discovered
              </p>
              <div className="flex flex-wrap gap-1.5">
                {assumptions.map((a, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[10px] bg-muted/50 cursor-default"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Auto-highlight suggestion */}
          {suggestedHighlight && (
            <Card className="border-yellow-500/20 bg-yellow-500/5 animate-in fade-in duration-500">
              <CardContent className="py-3 px-3 space-y-2">
                <p className="text-[10px] text-yellow-400 uppercase tracking-wider font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Suggested highlight
                </p>
                <p className="text-xs leading-relaxed text-foreground/80">
                  &ldquo;{suggestedHighlight.content.slice(0, 120)}
                  {suggestedHighlight.content.length > 120 ? "..." : ""}&rdquo;
                </p>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAcceptHighlight(suggestedHighlight.id)}
                    className="text-[10px] h-6 px-2 gap-1"
                  >
                    <Sparkles className="h-2.5 w-2.5" /> Pin
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDismissHighlight}
                    className="text-[10px] h-6 px-2"
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state when nothing is happening */}
          {!isApiMissing && assumptions.length === 0 && userMessages.length === 0 && !suggestedHighlight && (
            <div className="flex flex-col items-center justify-center text-center pt-12 space-y-2">
              <AlertTriangle className="h-6 w-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                The stage is set. Debate insights will appear here.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
