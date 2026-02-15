# Quick Start Guide

## 1. Install & Run

```bash
npm install
cp .env.example .env.local
# Add your API key to .env.local (see below)
npm run dev
```

Open: **http://localhost:3000**

## 2. Get an API Key

### Gemini (Free)
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### OpenAI (Paid)
1. Go to: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key

## 3. Configure .env.local

**For Gemini:**
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.0-flash
```

**For OpenAI:**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

## 4. Test the App

1. Visit http://localhost:3000
2. Click **"Start a Debate"**
3. Enter: "Should I quit my job to start a startup?"
4. Add context: "I have 5 years of savings"
5. Click **"Generate Debate"**
6. Click **"Let Them Argue"**
7. Watch the personas debate!

## Controls

- **Pause** — Stop auto-debate
- **Push Back** — Challenge with your own input
- **Reframe** — Change the framing
- **Undo** — Remove last message
- **Clarify** — Ask for more depth
- **Verdict** — Get final synthesis

## Troubleshooting

**API quota errors:**
- Gemini free tier: 15 requests/min, 1500/day
- Wait or switch provider

**Session not found:**
- Dev server uses in-memory storage
- Sessions reset on server restart (expected)

**Build errors:**
- Run: `npm run build` to check
- All 14 audit fixes are applied ✅

---

Ready to debate? 🎭⚡🛡
