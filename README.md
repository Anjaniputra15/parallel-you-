# Sophiie AI Agents Hackathon 2026

**Build the future of AI-human interaction.**

| | |
|---|---|
| **What** | A solo hackathon focused on AI agent interaction — voice, text, UX, and UI |
| **When** | February 14–15, 2026 (Saturday–Sunday) |
| **Where** | Virtual — participate from anywhere in Australia |
| **Prize** | **$5,000 AUD cash** (1st place) + job offers for top performers |
| **Format** | Solo only — show us what *you* can build |
| **Hacking Time** | 33 hours |

---

## The Challenge

**Design and build an AI agent with an exceptional interaction experience.**

We want to see how you think about the space between humans and AI. This is deliberately open-ended — you choose the problem, the modality, and the approach. What matters is the *interaction*.

Some directions to inspire you (not requirements):

- A voice agent that feels natural to talk to
- A text-based assistant with a thoughtful, intuitive UX
- A multi-modal agent that blends voice, text, and visual elements
- An agent that handles a complex workflow through conversation
- Something we haven't thought of yet

**You will be judged on innovation, technical execution, and how good the interaction feels** — not just whether the AI works, but whether a human would *want* to use it.

Use any tech stack. Use any AI provider. Use AI coding assistants. The only constraint is time.

---

## Schedule

All times are **AEST (Australian Eastern Standard Time, UTC+10 — Brisbane time)**.

### Saturday, February 14

| Time | Event |
|------|-------|
| **9:00 AM** | Kickoff — challenge explained, rules confirmed |
| **9:30 AM** | **Hacking begins** |
| 12:00 PM | Office hours / Q&A (optional, Discord) |
| 4:00 PM | Community check-in / progress sharing (optional, Discord) |

### Sunday, February 15

| Time | Event |
|------|-------|
| **6:00 PM** | **Submission deadline — hard cut-off, no exceptions** |

### After the Hackathon

| When | Event |
|------|-------|
| Feb 16 – Feb 28 | Judging period — judges review all submissions |
| ~Early March | Winners announced via livestream (details shared on Discord and Email) |

---

## Rules

### The Essentials

1. **Solo only** — one person per submission, no teams
2. **No pre-work** — all project code must be written during the hackathon window (after 9:30 AM AEST, Feb 14)
3. **Public GitHub repo** — your repository must be publicly visible at time of submission
4. **AI assistance is allowed** — Copilot, Claude, ChatGPT, Cursor, whatever you want. You still need to build it within the timeframe
5. **Must be functional** — your project must run and be demonstrable, not just a concept or slide deck
6. **One submission per person** — you may iterate, but submit one final project

### What You CAN Prepare Before Kickoff

- Research, planning, and brainstorming (on paper, in your head — just not in code)
- Setting up your development environment
- Reading documentation for tools/APIs you plan to use
- Creating accounts (GitHub, API providers, etc.)
- Watching tutorials

### What You CANNOT Do Before Kickoff

- Write any project code
- Create your project repository
- Fork/clone an existing project and modify it
- Build components, libraries, or templates specifically for your submission
- Start a project in a private repo then make it public later

### How We Verify

We will check:
- **Repository creation date** — must be after 9:30 AM AEST, Feb 14
- **Commit history** — should show natural progression, not a single massive commit
- **First commit timestamp** — must be after kickoff

**Red flags that will result in disqualification:**
- Repo created before the hackathon
- Single commit containing the entire project
- Commits timestamped before kickoff
- Evidence of code copied from a pre-existing private repo

---

## Submission Requirements

**Deadline: 6:00 PM AEST, Sunday February 15, 2026 — hard cut-off.**

To submit, you must complete **all** of the following:

1. **Public GitHub repo** — created after kickoff, with a clear commit history
2. **This README** — fill out the [Your Submission](#your-submission) section below
3. **Demo video** (2–5 minutes) — show your agent in action, explain your approach
4. **Working project** — judges must be able to understand and evaluate your agent from the repo + video

### How to Submit

1. Fork this repository
2. Build your project in the fork
3. Fill out the [Your Submission](#your-submission) section below
4. Record your demo video and add the link to your submission
5. Ensure your repo is **public** before 6:00 PM AEST Sunday
6. Submit your repo link via the submission form (link will be shared at kickoff)

---

## Judging Criteria

| Criteria | Weight | What We're Looking For |
|----------|--------|----------------------|
| **Interaction Design** | 30% | How intuitive, natural, and delightful is the human-AI interaction? Does it feel good to use? |
| **Innovation** | 25% | Novel approach, creative problem-solving, or a fresh take on agent interaction |
| **Technical Execution** | 25% | Code quality, architecture, reliability, completeness |
| **Presentation** | 20% | Demo quality, clarity of communication, ability to convey your vision |

### Judges

Sophiie senior engineers and CTO. Judging will take place over a 2-week period following the submission deadline.

---

## Prizes

| Place | Prize |
|-------|-------|
| **1st Place** | **$5,000 AUD cash** |
| **Top Performers** | Job offers or interview fast-tracks at Sophiie* |
| **All Finalists** | Consideration for current and future roles |

*\*Job offers and interview fast-tracks are entirely at the discretion of Sophiie and are not guaranteed.*

> Participants retain full ownership and IP of their submissions. Sophiie receives a non-exclusive license to review and evaluate submissions for judging purposes only.

---

## Your Submission

### Participant

| Field | Your Answer |
|-------|-------------|
| **Name** | Aayush Parashar |
| **University / Employer** | Torrens University Australia |

### Project

| Field | Your Answer |
|-------|-------------|
| **Project Name** | Parallel You |
| **One-Line Description** | Two AI personas debate your toughest decisions — you control the conversation, they provide the clarity. |
| **Demo Video Link** | *[Add your video link here]* |
| **Tech Stack** | Next.js 16, TypeScript, Auth.js v5, Tailwind CSS, shadcn/ui, Web Speech API |
| **AI Provider(s) Used** | OpenAI GPT-4o-mini, Google Gemini 2.0 Flash |

### About Your Project

#### What does it do?

Parallel You is a multi-modal AI debate platform that helps you make better decisions by simulating a live argument between two versions of yourself. You enter a decision you're facing, and two distinct AI personas — **Risk-Taker** (bold, opportunity-focused) and **Pragmatist** (cautious, risk-aware) — debate it in real-time.

The interaction is conversational, visual, and voice-enabled. You're not just passively reading AI responses — you're directing a debate. You can pause mid-argument, push back on weak points, reframe the entire discussion, or ask for clarification. The AI adapts to your input and builds arguments that directly respond to what you've said.

When the debate concludes, you get a structured synthesis: the best points from both sides, shared assumptions, open questions, and a recommended next step. You then record your final decision and export the entire transcript. The result is not an AI telling you what to do, but a thinking tool that helps you explore your own reasoning.

#### How does the interaction work?

**Setup Phase:**
You start by describing your decision (e.g., "Should I quit my job to start a company?"). You provide context, constraints, and what you're optimizing for. Then you calibrate the debate using sliders — risk tolerance, time horizon, social impact, and money sensitivity. This tells the AI how *you* think, so the personas argue in a way that's relevant to your values.

**Live Debate:**
Once you click "Let Them Argue," the two personas start exchanging arguments in real-time. Each message appears with a typing animation, and you can enable voice output to *hear* them speak (Risk-Taker has a faster, higher-pitched voice; Pragmatist is slower and more measured).

**Interactive Controls:**
You're not a spectator — you're the director. At any moment, you can:
- **Pause/Resume** — stop the auto-debate to think
- **Push Back** — inject your own counterargument or missing context
- **Reframe** — ask them to consider a different angle
- **Clarify** — request deeper reasoning on a specific point
- **Undo** — roll back the last exchange if it went off-track
- **Voice Commands** — say "pause," "continue," "push back," etc., hands-free

**Verdict:**
When you're ready, click "Verdict" to synthesize the debate. The AI distills everything into:
- Best arguments from Risk-Taker
- Best arguments from Pragmatist
- Points both agreed on
- Unresolved questions you should research
- A concrete next step

You then record your decision and why you made it, creating a permanent record.

#### What makes it special?

**1. Multi-modal interaction that feels natural**
Most AI chatbots are one-dimensional. Parallel You blends text, voice input, voice output, and visual design into a cohesive experience. You can type your decision or speak it. You can read the debate or listen to it. You can control the flow with buttons or voice commands. The interaction adapts to how you want to engage.

**2. You're in control, not the AI**
Unlike AI advisors that give prescriptive answers, Parallel You never tells you what to do. It's a **thinking tool**, not a decision-maker. The personas argue, you direct, and you decide. This respects user agency while still providing AI-powered clarity.

**3. Personas with personality**
The Risk-Taker and Pragmatist aren't just "AI Assistant A" and "AI Assistant B." They have distinct voices, reasoning styles, and even speech patterns. Risk-Taker challenges you to think bigger; Pragmatist forces you to confront risks. The tension between them mirrors the internal debate you're already having in your own head.

**4. Voice commands that actually work**
Voice isn't a gimmick here — it's a first-class interaction mode. Say "pause" mid-debate, and it stops. Say "push back," and the input modal opens. Say "undo," and the last message disappears. The commands work reliably using the browser's native Web Speech API (no latency, no API costs).

**5. Gorgeous, premium UI**
The interface looks and feels like a professional tool. Neon-accented dark theme, smooth animations, live typing effects, real-time heat indicators, and a visual debate flow that's easy to follow. Every detail — from the persona colors to the scroll behavior — was designed to make the experience delightful.

**6. Authentication and personalization**
Sign in with Google, and all your debates are saved and private. Each user sees only their own sessions, and the app remembers your past decisions. This makes it a personal decision journal, not just a one-off tool.

#### How to run it

**Prerequisites:**
- Node.js 18+ installed
- A Google OAuth Client ID and Secret ([get from Google Cloud Console](https://console.cloud.google.com/apis/credentials))
- An OpenAI API key **or** a Google Gemini API key

**Setup:**

```bash
# 1. Clone the repository
git clone https://github.com/Anjaniputra15/hackathon.git
cd hackathon

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Edit .env.local and add your API keys:
# - Choose LLM provider (openai or gemini)
# - Add your API key for the chosen provider
# - Add Google OAuth credentials
# - Generate AUTH_SECRET with: openssl rand -base64 32
# - Set NEXTAUTH_URL to http://localhost:3000

# 5. Start the development server
npm run dev
```

**Open [http://localhost:3000](http://localhost:3000)** and sign in with Google.

**To create your first debate:**
1. Click "Sign in with Google"
2. Click "Start a Debate"
3. Enter your decision or click the microphone to speak it
4. Fill in context and calibrate sliders
5. Click "Start Debate"
6. Click "Let Them Argue" and watch the personas debate
7. Use controls to guide the conversation
8. Click "Verdict" when ready

**Voice features:**
- Enable voice output: Click the 🔊 button in the control dock
- Enable voice commands: Click the 🎤 button and say commands like "pause", "continue", "push back"

#### Architecture / Technical Notes

**Frontend:**
- Next.js 16 App Router with React Server Components
- Client-side state management for real-time debate flow
- Custom hooks for voice recognition (`useSpeechRecognition`), voice synthesis (`useSpeechSynthesis`), and voice commands (`useVoiceCommands`)
- Tailwind CSS + shadcn/ui component library for the design system
- Per-message typing animation with scroll-to-view

**Authentication:**
- Auth.js v5 (NextAuth) with Google OAuth provider
- JWT session strategy (no database required for basic auth)
- Middleware-based route protection
- User-specific session filtering

**AI Integration:**
- Dual provider support: OpenAI GPT-4o-mini and Google Gemini 2.0 Flash
- Streaming not used (deliberate choice for typing animation control)
- Prompt engineering for persona consistency and debate quality
- Automatic synthesis at debate end

**Voice Features:**
- Browser Web Speech API (no external dependencies)
- `SpeechRecognition` for voice input (decision entry)
- `SpeechSynthesis` for voice output (AI personas speaking)
- Voice commands with fuzzy matching (e.g., "pause" also matches "stop", "wait")
- Different voice profiles for each persona (speed, pitch)

**State Management:**
- In-memory session store using `globalThis` (persists across hot reloads in dev)
- Session data includes: decision, context, calibration, messages, assumptions, verdict
- Auto-save to localStorage for history persistence

**Key Technical Decisions:**
1. **No database for MVP** — sessions stored in-memory, fast iteration
2. **Typing animation per message** — better UX than streaming
3. **Voice commands with native API** — zero latency, no cost
4. **Dark theme only** — premium aesthetic, consistent branding
5. **Mobile-first responsive** — works on all screen sizes

**Performance:**
- GPU-accelerated animations (`will-change`, `transform`)
- Lazy loading for heavy components
- Debounced scroll handlers
- Minimal re-renders (React `useCallback`, `useMemo`)

**Security:**
- Environment variables for API keys
- HTTP-only encrypted JWT cookies
- CSRF protection via Auth.js
- No user data stored server-side (privacy-first)

---

## Code of Conduct

All participants must adhere to a standard of respectful, professional behavior. Harassment, discrimination, or disruptive behavior of any kind will result in immediate disqualification.

By participating, you agree to:
- Treat all participants, judges, and organizers with respect
- Submit only your own original work created during the hackathon
- Not interfere with other participants' work
- Follow the rules outlined in this document

---

## Communication & Support

- **Discord** — join the hackathon Discord server for announcements, Q&A, and community chat (link provided upon registration)
- **Office hours** — available during the event for technical questions

---

## FAQ

**Q: Can I use boilerplate / starter templates?**
A: You can use publicly available boilerplate (e.g., `create-react-app`, `Next.js` starter) as a starting point. You cannot use custom templates you built specifically for this hackathon before kickoff.

**Q: Can I use existing open-source libraries and APIs?**
A: Yes. You can use any publicly available libraries, frameworks, APIs, and services. The code *you* write must be created during the hackathon.

**Q: Do I need to be in Australia?**
A: Preferred but not strictly required. The hackathon is primarily targeted at Australian residents and students, but we won't turn away great talent.

**Q: Can I use AI coding tools like Copilot or Claude?**
A: Absolutely. Use whatever tools you want. The 33-hour time constraint is the great equalizer.

**Q: What if I can't finish?**
A: Submit what you have. A well-thought-out partial project with a great demo video can still score well. We're evaluating your thinking and skill, not just completion.

**Q: How will I know if I won?**
A: Winners will be announced via livestream approximately 2 weeks after the hackathon. All participants will be notified.

**Q: Can I keep working on my project after the deadline?**
A: You can continue developing after the hackathon, but **only the state of your repo at 6:00 PM AEST Sunday Feb 15 will be judged**. We will check commit timestamps.

---

## About Sophiie

Sophiie is an AI office manager for trades businesses — helping plumbers, electricians, builders, and other trade professionals run their operations with intelligent automation. We're a team that cares deeply about how humans interact with AI, and we're looking for people who think the same way.

[sophiie.com](https://sophiie.com)

---

**Good luck. Build something that makes us say "wow."**
