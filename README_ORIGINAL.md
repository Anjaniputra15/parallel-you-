# Parallel You

**Two versions of you. One better decision.**

A web app where you enter a decision you're facing, and two AI personas — your Risk-Taker self and your Pragmatist self — debate it live. You control the debate, then get a structured verdict to help you decide.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and add your API keys (see below)

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start your first debate!

## Environment Setup

### Required: LLM Provider

Choose your LLM provider and configure accordingly:

### Option 1: Gemini (Google AI) — Free Tier Available

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.0-flash
```

Get your free API key: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Option 2: OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Get your API key: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Required: Google OAuth Authentication

To use Parallel You, you need to set up Google OAuth:

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project (or select existing)
   - Enable Google+ API
   - Create OAuth Client ID → Web Application
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret

2. **Generate AUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Add to .env.local:**
   ```env
   AUTH_SECRET=<paste generated secret>
   NEXTAUTH_URL=http://localhost:3000
   AUTH_GOOGLE_ID=<your-google-client-id>
   AUTH_GOOGLE_SECRET=<your-google-client-secret>
   ```

**Note:** Each user gets their own debate sessions linked to their Google account. Sessions are private and only visible to the authenticated user.

## How to Use

1. **Create a Debate**
   - Click **Start a Debate** on the home page
   - Enter your decision (e.g., "Should I quit my job to start a startup?")
   - Add context, constraints, and what you're optimizing for
   - Adjust calibration sliders to tune personas

2. **Watch the Debate**
   - Click **Let Them Argue** to start
   - Two personas debate your decision in real-time
   - Risk-Taker (⚡) pushes for bold action
   - Pragmatist (🛡) highlights risks and asks hard questions

3. **Control the Flow**
   - **Pause/Resume** — Stop the auto-debate
   - **Push Back** — Challenge their reasoning with your own input
   - **Reframe** — Change how they're thinking about the problem
   - **Undo** — Remove the last message
   - **Clarify** — Ask them to dig deeper

4. **Get Your Verdict**
   - Click **Verdict** when ready
   - AI synthesizes best points from both sides
   - Shows shared facts, open questions, and next steps
   - Record your final decision and export as markdown

## Features

✨ **No Auto-Fire** — Debate only starts when you click "Let Them Argue"
🎭 **Dual Personas** — Risk-taker vs Pragmatist with distinct voices
⚡ **Live Typing Animation** — Watch arguments unfold character-by-character
🎮 **Interactive Controls** — Push back, reframe, or undo at any time
📊 **Smart Synthesis** — Get structured verdicts with key insights
💾 **Session History** — Review past debates anytime
📱 **Mobile Ready** — Works on all screen sizes (`100dvh` viewport)
🎨 **Premium UI** — Dark theme with neon sun background
🔐 **Google OAuth** — Secure authentication with user-specific sessions
📖 **How It Works Page** — Interactive guide to the debate flow

## Architecture

- **Framework:** Next.js 16 (App Router) + TypeScript
- **UI:** Custom design system + Tailwind CSS + shadcn/ui
- **State:** Server-side sessions (globalThis store for dev hot-reload)
- **LLM:** Supports both OpenAI and Gemini APIs
- **Routes:**
  - `GET /api/session/[id]` — Fetch session without triggering turn
  - `POST /api/session/create` — Create new debate
  - `POST /api/session/turn` — Generate next argument
  - `POST /api/session/synthesize` — Create final verdict

## State Flow

```
intake → confirm → debate_running ⇄ debate_paused → synthesis → verdict_ready
```

## Tech Stack

- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- lucide-react icons
- OpenAI & Gemini APIs
- Server-side in-memory sessions

## Development

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run build
```

## Troubleshooting

**"Session not found" errors:**
- The dev server uses in-memory storage — sessions reset on server restart
- This is expected behavior in development

**LLM quota errors:**
- Gemini free tier: 15 RPM, 1500 RPD
- Wait for quota to reset or switch to OpenAI
- Error messages show retry timing

**Typing animation issues:**
- Fixed in latest version — tracks by message ID, not object reference
- Auto-scrolls to new messages

## Recent Updates

### Latest (v2.0)
✅ **Google OAuth Authentication** — Secure sign-in with user sessions
✅ **How It Works Page** — Interactive tabbed guide at `/how-it-works`
✅ **Neon Sun Background** — Enhanced visual design with animated sun
✅ **User-Specific Sessions** — Each user only sees their own debates
✅ **JWT Sessions** — Secure, cookie-based authentication

### Previous (Audit Fixes)
✅ No auto-fire on page load — GET endpoint loads session safely
✅ Per-message typing animation with proper ID tracking
✅ Push Back opens inline input (no more "..." placeholder)
✅ Auto-scroll both panels on new messages
✅ Speaking indicator extends through typing animation
✅ Google Fonts via `<link>` instead of `@import`
✅ Crash-safe JSON parsing with fallback extraction
✅ Safe LLM response access with descriptive errors
✅ Synthesize state only set after success
✅ Mobile viewport fix (100dvh)
✅ Color consistency across verdict/debate pages
✅ No re-synthesis on verdict page revisits
✅ localStorage safety with try-catch
✅ Reframe + Undo buttons added

---

**Disclaimer:** Parallel You is a thinking tool, not a professional advisor. It does not provide medical, legal, or financial advice.
