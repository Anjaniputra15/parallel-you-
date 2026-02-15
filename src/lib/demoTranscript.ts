import { SessionData, DebateMessage } from "./types";

const demoMessages: DebateMessage[] = [
  {
    id: "d1",
    role: "persona_a",
    content:
      "I think we should quit and go all-in on the startup. The market window is right now — if we wait another year, three more competitors will launch. I've seen what happens when people over-plan: they never start. We have savings for 8 months, and that's more runway than most YC founders had.",
    timestamp: Date.now() - 60000 * 7,
    assumptions: ["Market window closes within 12 months", "8 months of savings is sufficient runway"],
  },
  {
    id: "d2",
    role: "persona_b",
    content:
      "I hear the urgency, but let's be honest — 8 months of runway assumes zero lifestyle costs increase and no emergencies. Assumption: our monthly burn stays flat. What if we get sick? What about health insurance? I'd rather spend 3 months building on the side to validate demand before burning the safety net.",
    timestamp: Date.now() - 60000 * 6,
    assumptions: ["Monthly burn stays flat", "Health insurance gap is a real risk"],
  },
  {
    id: "d3",
    role: "persona_a",
    content:
      "Side projects never get the energy they deserve — that's the trap. Every successful founder I've talked to says the same thing: you can't go half-speed. And health insurance? We can get COBRA for 3 months and marketplace after. That's a solvable problem, not a reason to stay stuck. What's the real cost of staying another year at a job that's draining us?",
    timestamp: Date.now() - 60000 * 5,
    assumptions: ["Part-time effort leads to mediocre results"],
  },
  {
    id: "d4",
    role: "persona_b",
    content:
      "The real cost of staying is known and manageable — that's the point. The cost of quitting without validation is unknown and potentially catastrophic. I'm not saying don't do it. I'm saying: run 10 customer interviews in the next 2 weeks while employed. If 7 out of 10 say they'd pay, then I'm fully on board. That's not over-planning — that's basic due diligence.",
    timestamp: Date.now() - 60000 * 4,
    assumptions: ["Customer validation can happen in 2 weeks", "7/10 positive signals = sufficient validation"],
  },
  {
    id: "d5",
    role: "persona_a",
    content:
      "Fine — I can get behind the 10-interview sprint. But I need a hard deadline: 2 weeks, not 2 months of \"more research.\" And if we hit that signal, we give notice immediately. No more waiting. Assumption: we'll actually commit to the deadline and not move goalposts. Deal?",
    timestamp: Date.now() - 60000 * 3,
    assumptions: ["2-week hard deadline will be honored"],
    pinned: true,
  },
  {
    id: "d6",
    role: "persona_b",
    content:
      "Deal. Two weeks, 10 interviews, hard cutoff. And during those 2 weeks, I want us to also price out COBRA, set up a basic LLC, and open a business bank account. That way if the signal is green, we're not scrambling — we're executing. Assumption: these logistics can be handled in parallel without impacting interviews.",
    timestamp: Date.now() - 60000 * 2,
    assumptions: ["Logistics and interviews can run in parallel"],
    pinned: true,
  },
  {
    id: "d7",
    role: "persona_a",
    content:
      "Now we're talking. One more thing — I want us to tell 3 trusted people about the plan. Not for permission, but for accountability. When other people know, we can't quietly shelve this. That's my insurance policy against our own inertia.",
    timestamp: Date.now() - 60000 * 1,
    assumptions: ["Social accountability reduces the chance of inaction"],
  },
  {
    id: "d8",
    role: "persona_b",
    content:
      "Agreed, but let's be selective — people who'll challenge us, not just cheerleaders. A mentor, a founder friend, and someone who'll play devil's advocate. That gives us balanced feedback. I feel good about this plan. It's bold but not reckless.",
    timestamp: Date.now(),
    assumptions: ["Balanced advisors improve decision quality"],
  },
];

export const demoSession: SessionData = {
  id: "demo",
  decision: "Should I quit my job to start a company?",
  context:
    "I have 8 months of savings, a validated idea in B2B SaaS, and a co-founder who's ready. My current job is stable but unfulfilling.",
  constraints: "Need health insurance, can't relocate",
  optimizingFor: "Long-term career fulfillment and financial independence",
  calibration: {
    riskTolerance: 65,
    timeHorizon: 75,
    socialImpact: 40,
    moneySensitivity: 60,
  },
  state: "debate_running",
  messages: demoMessages,
  assumptions: [
    "Market window closes within 12 months",
    "8 months of savings is sufficient runway",
    "Monthly burn stays flat",
    "Part-time effort leads to mediocre results",
    "Customer validation can happen in 2 weeks",
    "2-week hard deadline will be honored",
  ],
  summary:
    "Whether to leave a stable but unfulfilling job to pursue a B2B SaaS startup with a co-founder and 8 months of runway.",
  createdAt: Date.now(),
  turnCount: 8,
};
