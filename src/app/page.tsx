"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitFork, Zap, Scale, ArrowRight, History, LogOut, Loader2 } from "lucide-react";
import NeonWaveBackground from "@/components/NeonWaveBackground";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/new" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full-screen neon wave — sits behind everything */}
      <NeonWaveBackground />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 relative z-10">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <GitFork className="h-5 w-5 text-primary" />
          Parallel You
        </div>
        <div className="flex items-center gap-2">
          <Link href="/how-it-works">
            <Button variant="ghost" size="sm">
              How It Works
            </Button>
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto gap-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Two versions of you.
            <br />
            <span className="text-muted-foreground">One better decision.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Enter a decision you&apos;re facing. Watch your risk-taking self debate your
            pragmatic self. Walk away with clarity.
          </p>
        </div>

        {isLoading ? (
          <Button size="lg" className="text-base px-8 gap-2" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </Button>
        ) : isAuthenticated ? (
          <Link href="/new">
            <Button size="lg" className="text-base px-8 gap-2">
              Start a Debate <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            size="lg"
            className="text-base px-8 gap-2"
            onClick={handleSignIn}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left w-full">
          <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">Live Debate</h3>
            <p className="text-sm text-muted-foreground">
              Watch two AI personas argue your decision in real time with controls to guide the conversation.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
            <Scale className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Balanced Verdict</h3>
            <p className="text-sm text-muted-foreground">
              Get a structured summary of best points, shared facts, and open questions.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
            <GitFork className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Your Call</h3>
            <p className="text-sm text-muted-foreground">
              The app helps you think — it never decides for you. Record your decision and export it.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Disclaimer: Parallel You is a thinking tool, not a professional advisor.
          It does not provide medical, legal, or financial advice.
        </p>
      </main>
    </div>
  );
}
