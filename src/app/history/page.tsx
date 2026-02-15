"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitFork, ArrowLeft, Clock, Loader2 } from "lucide-react";

interface HistoryItem {
  id: string;
  decision: string;
  createdAt: number;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch("/api/session/list");
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <GitFork className="h-5 w-5 text-primary" />
        <span className="font-semibold">History</span>
      </nav>

      <main className="flex-1 max-w-lg mx-auto w-full p-6 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-12 space-y-3">
            <Loader2 className="h-8 w-8 mx-auto opacity-40 animate-spin" />
            <p>Loading your debates...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 space-y-3">
            <Clock className="h-8 w-8 mx-auto opacity-40" />
            <p>No debates yet</p>
            <Link href="/new">
              <Button size="sm">Start your first debate</Button>
            </Link>
          </div>
        ) : (
          sessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{s.decision}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()} &middot; {s.id}
                  </p>
                </div>
                <div className="flex gap-1 ml-3">
                  <Link href={`/session/${s.id}`}>
                    <Button size="sm" variant="outline">
                      Debate
                    </Button>
                  </Link>
                  <Link href={`/session/${s.id}/verdict`}>
                    <Button size="sm" variant="outline">
                      Verdict
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
