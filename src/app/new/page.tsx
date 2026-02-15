"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GitFork, Loader2, ArrowLeft, Pencil, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { SessionData, Calibration } from "@/lib/types";

export default function NewSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intake" | "confirm">("intake");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);

  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");
  const [optimizingFor, setOptimizingFor] = useState("");
  const [calibration, setCalibration] = useState<Calibration>({
    riskTolerance: 50,
    timeHorizon: 50,
    socialImpact: 50,
    moneySensitivity: 50,
  });

  const [editingAssumptions, setEditingAssumptions] = useState<string[]>([]);

  async function handleGenerate() {
    if (!decision.trim()) {
      toast.error("Please enter a decision");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, context, constraints, optimizingFor, calibration }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create session");
      }

      setSession(data);
      setEditingAssumptions([...data.assumptions]);
      setStep("confirm");

      // Save to localStorage
      const sessions = JSON.parse(localStorage.getItem("parallel-you-sessions") || "[]");
      sessions.unshift({ id: data.id, decision: data.decision, createdAt: data.createdAt });
      localStorage.setItem("parallel-you-sessions", JSON.stringify(sessions.slice(0, 50)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function removeAssumption(index: number) {
    setEditingAssumptions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleStartDebate() {
    if (session) {
      router.push(`/session/${session.id}`);
    }
  }

  if (step === "confirm" && session) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
          <button onClick={() => setStep("intake")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 font-semibold">
            <GitFork className="h-5 w-5 text-primary" />
            Parallel You
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                What I heard you say
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{session.summary}</p>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Key Assumptions</Label>
                <div className="flex flex-wrap gap-2">
                  {editingAssumptions.map((a, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                      {a}
                      <button onClick={() => removeAssumption(i)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep("intake")} className="gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button onClick={handleStartDebate} className="flex-1 gap-1">
                  <Sparkles className="h-4 w-4" /> Start Debate
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2 font-semibold">
          <GitFork className="h-5 w-5 text-primary" />
          Parallel You
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Set up your debate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label>Decision *</Label>
              <Input
                placeholder="e.g., Should I quit my job to start a company?"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Context</Label>
              <Textarea
                placeholder="Background info that matters..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Constraints / Must-haves</Label>
              <Input
                placeholder="e.g., Can't relocate, need health insurance"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>What are you optimizing for?</Label>
              <Input
                placeholder="e.g., Long-term happiness, financial security"
                value={optimizingFor}
                onChange={(e) => setOptimizingFor(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-2">
              <Label className="text-sm font-medium">Calibration</Label>
              {[
                { key: "riskTolerance" as const, label: "Risk tolerance", low: "Cautious", high: "Bold" },
                { key: "timeHorizon" as const, label: "Time horizon", low: "Short-term", high: "Long-term" },
                { key: "socialImpact" as const, label: "Social impact sensitivity", low: "Low", high: "High" },
                { key: "moneySensitivity" as const, label: "Money sensitivity", low: "Low", high: "High" },
              ].map(({ key, label, low, high }) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{low}</span>
                    <span className="font-medium text-foreground">{label}: {calibration[key]}</span>
                    <span>{high}</span>
                  </div>
                  <Slider
                    value={[calibration[key]]}
                    onValueChange={([v]) => setCalibration({ ...calibration, [key]: v })}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                "Generate Debate"
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
