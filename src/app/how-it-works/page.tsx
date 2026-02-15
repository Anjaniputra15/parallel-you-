"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Settings,
  MessageSquare,
  Gamepad2,
  CheckCircle,
  Flame,
  Shield,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import NeonWaveBackground from "@/components/NeonWaveBackground";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <NeonWaveBackground />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 relative z-10">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </Link>
      </nav>

      <main className="flex-1 px-6 py-12 relative z-10 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            How It Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Parallel You helps you make better decisions by simulating a debate
            between two versions of yourself — one risk-taking, one pragmatic.
          </p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList variant="default" className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="setup">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="debate">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Debate</span>
            </TabsTrigger>
            <TabsTrigger value="control">
              <Gamepad2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Control</span>
            </TabsTrigger>
            <TabsTrigger value="verdict">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Verdict</span>
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Setup */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Step 1: Setup Your Debate</h2>
                  <p className="text-muted-foreground">
                    Tell us what decision you&apos;re facing and calibrate your personas.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Enter Your Decision</h3>
                  <p className="text-muted-foreground">
                    Start by describing the choice you&apos;re trying to make. Be specific —
                    &quot;Should I quit my job to start a company?&quot; works better than
                    &quot;What should I do with my career?&quot;
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Add Context & Constraints</h3>
                  <p className="text-muted-foreground">
                    Provide relevant background information, important constraints (budget,
                    timeline, dependencies), and what you&apos;re optimizing for (happiness,
                    money, impact, etc.).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Calibrate Your Personas</h3>
                  <p className="text-muted-foreground mb-4">
                    Use sliders to tune how your two debate personas will argue. This helps
                    the AI understand your personal values and decision-making style.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                      <p className="text-sm font-medium mb-1">Risk Tolerance</p>
                      <p className="text-xs text-muted-foreground">
                        How comfortable are you with uncertainty?
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                      <p className="text-sm font-medium mb-1">Time Horizon</p>
                      <p className="text-xs text-muted-foreground">
                        Short-term gains vs. long-term planning?
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                      <p className="text-sm font-medium mb-1">Social Impact</p>
                      <p className="text-xs text-muted-foreground">
                        How much do others&apos; opinions matter?
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                      <p className="text-sm font-medium mb-1">Money Sensitivity</p>
                      <p className="text-xs text-muted-foreground">
                        How important are financial factors?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Step 2: Debate */}
          <TabsContent value="debate" className="space-y-6">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Step 2: Watch the Debate</h2>
                  <p className="text-muted-foreground">
                    Two AI personas argue your decision in real-time — one bold, one cautious.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg border-2 border-orange-500/30 bg-orange-500/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Flame className="h-6 w-6 text-orange-500" />
                      <h3 className="text-lg font-semibold">Risk-Taker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      The bold persona who pushes for ambitious, high-upside choices. Focuses
                      on opportunity cost, growth potential, and calculated risks.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="italic text-orange-400/80">
                        &quot;You&apos;ll regret not trying more than you&apos;ll regret
                        trying and failing.&quot;
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-6 w-6 text-cyan-500" />
                      <h3 className="text-lg font-semibold">Pragmatist</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      The careful persona who emphasizes stability, downside protection, and
                      realistic planning. Focuses on risks, dependencies, and sustainability.
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="italic text-cyan-400/80">
                        &quot;A good plan today is better than a perfect plan tomorrow.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Live Argument Exchange</h3>
                  <p className="text-muted-foreground">
                    The personas take turns building arguments, responding to each other,
                    challenging assumptions, and exploring different angles of your decision.
                    Each turn builds on the previous arguments, creating a natural debate flow.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">Auto-play Mode</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The debate runs automatically, generating 3-5 exchanges. You can pause at
                    any time to intervene or let it complete.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Step 3: Control */}
          <TabsContent value="control" className="space-y-6">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Gamepad2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Step 3: Control the Debate</h2>
                  <p className="text-muted-foreground">
                    You&apos;re not just watching — you can pause, push back, and steer the
                    conversation.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Pause className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold">Pause / Resume</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stop the debate at any moment to think, take notes, or prepare an
                      intervention. Resume when ready.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Push Back</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Disagree with a point or add context the personas are missing. They&apos;ll
                      respond and adjust their arguments.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="h-5 w-5 text-pink-500" />
                      <h3 className="font-semibold">Reframe</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Change the angle of the debate. Ask personas to consider a different
                      perspective or explore a new dimension.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Clarify</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ask for more details or evidence on a specific point. The personas will
                      expand and provide deeper reasoning.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30 sm:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <RotateCcw className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Undo Last Turn</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If the debate went in an unhelpful direction, roll back the last exchange
                      and try a different intervention.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-primary/5">
                  <p className="text-sm">
                    <strong>Pro tip:</strong> Use controls sparingly. Let the personas explore
                    on their own first, then intervene when they miss something important or
                    when you need deeper analysis on a specific point.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Step 4: Verdict */}
          <TabsContent value="verdict" className="space-y-6">
            <Card className="p-8 bg-background/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Step 4: Get Your Verdict</h2>
                  <p className="text-muted-foreground">
                    A structured synthesis of the debate with actionable insights.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">What You&apos;ll Get</h3>
                  <p className="text-muted-foreground">
                    When the debate wraps up, Parallel You generates a comprehensive verdict
                    that distills everything into clear, actionable sections.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-lg border border-orange-500/30 bg-orange-500/5">
                    <h3 className="font-semibold mb-2 text-orange-400">
                      Best Points from Risk-Taker
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The strongest arguments for taking bold action, ranked by impact and
                      relevance to your situation.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
                    <h3 className="font-semibold mb-2 text-cyan-400">
                      Best Points from Pragmatist
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      The most compelling reasons for caution, stability, and realistic
                      planning.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <h3 className="font-semibold mb-2">Shared Facts & Assumptions</h3>
                    <p className="text-sm text-muted-foreground">
                      Points both personas agreed on — these are likely your strongest
                      foundation for making the decision.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-border/50 bg-background/30">
                    <h3 className="font-semibold mb-2">Open Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Unresolved uncertainties or information gaps identified during the
                      debate. These are research tasks you might need to do before deciding.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg border border-primary/30 bg-primary/5">
                    <h3 className="font-semibold mb-2">Recommended Next Step</h3>
                    <p className="text-sm text-muted-foreground">
                      A concrete, actionable suggestion for how to move forward — whether
                      that&apos;s making a decision, gathering more info, or running an
                      experiment.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Record Your Decision</h3>
                  <p className="text-muted-foreground">
                    After reviewing the verdict, you can record what you decided and why. This
                    creates a record you can export and reference later.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The app helps you think through decisions — it never
                    makes choices for you. You remain in full control.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Link href="/new">
            <Button size="lg" className="text-base px-8">
              Start Your First Debate
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
