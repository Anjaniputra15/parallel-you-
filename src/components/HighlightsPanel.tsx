"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Pin, ChevronRight, ChevronLeft, Zap, Shield, HelpCircle } from "lucide-react";
import { DebateMessage } from "@/lib/types";

interface Props {
  pinnedMessages: DebateMessage[];
  assumptions: string[];
  open: boolean;
  onToggle: () => void;
}

export default function HighlightsPanel({ pinnedMessages, assumptions, open, onToggle }: Props) {
  const pinnedA = pinnedMessages.filter((m) => m.role === "persona_a");
  const pinnedB = pinnedMessages.filter((m) => m.role === "persona_b");
  const hasContent = pinnedMessages.length > 0 || assumptions.length > 0;

  return (
    <>
      {/* Toggle tab (always visible on desktop) */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center w-6 border-l border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors shrink-0"
        title={open ? "Close highlights" : "Open highlights"}
      >
        {open ? (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            {pinnedMessages.length > 0 && (
              <span className="text-[9px] text-yellow-400 font-medium">{pinnedMessages.length}</span>
            )}
          </div>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="w-64 border-l border-border/50 flex flex-col bg-background shrink-0 animate-in slide-in-from-right-2 duration-200">
          <div className="px-3 py-2.5 border-b border-border/50 flex items-center gap-2">
            <Pin className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-xs font-medium">Highlights</span>
            <Badge variant="secondary" className="text-[9px] ml-auto">
              {pinnedMessages.length}
            </Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {!hasContent && (
                <p className="text-[11px] text-muted-foreground text-center py-6">
                  Pin messages during the debate to collect highlights here.
                </p>
              )}

              {/* Pinned from A */}
              {pinnedA.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" /> Risk-Taker
                  </p>
                  {pinnedA.map((m) => (
                    <div
                      key={m.id}
                      className="text-[11px] p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/10 leading-relaxed animate-in fade-in slide-in-from-left-1 duration-300"
                    >
                      {m.content.slice(0, 150)}
                      {m.content.length > 150 ? "..." : ""}
                    </div>
                  ))}
                </div>
              )}

              {/* Pinned from B */}
              {pinnedB.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5" /> Pragmatist
                  </p>
                  {pinnedB.map((m) => (
                    <div
                      key={m.id}
                      className="text-[11px] p-2 rounded-lg bg-violet-950/30 border border-violet-500/10 leading-relaxed animate-in fade-in slide-in-from-left-1 duration-300"
                    >
                      {m.content.slice(0, 150)}
                      {m.content.length > 150 ? "..." : ""}
                    </div>
                  ))}
                </div>
              )}

              {/* Assumptions */}
              {assumptions.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <HelpCircle className="h-2.5 w-2.5" /> Assumptions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {assumptions.map((a, i) => (
                        <Badge key={i} variant="outline" className="text-[9px]">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
