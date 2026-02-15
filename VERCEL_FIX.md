# Vercel Auth Fix - Quick Guide

## Error: "Server error - There is a problem with the server configuration"

This happens when NextAuth environment variables are missing or incorrect.

---

## Fix: Add Environment Variables to Vercel

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

**Add these variables for ALL environments (Production, Preview, Development):**

### 1. Generate AUTH_SECRET

**On your Mac terminal, run:**
```bash
openssl rand -base64 32
```

**Copy the output and add to Vercel:**
- Name: `AUTH_SECRET`
- Value: `<paste-the-output>`
- Environments: ✅ Production ✅ Preview ✅ Development

---

### 2. Add Required Variables

| Name | Value | Notes |
|------|-------|-------|
| `AUTH_TRUST_HOST` | `true` | Required for Vercel |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `AUTH_GOOGLE_ID` | (Your Google Client ID) | From Google Console |
| `AUTH_GOOGLE_SECRET` | (Your Google Client Secret) | From Google Console |
| `LLM_PROVIDER` | `gemini` | Or `openai` |
| `GEMINI_API_KEY` | (Your Gemini key) | From AI Studio |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Model name |

---

## Update Google OAuth Redirect URI

**CRITICAL:** Google needs to know your Vercel URL

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
   (Replace `your-app-name` with your actual Vercel subdomain)
4. Click **Save**

---

## Redeploy After Adding Variables

**IMPORTANT:** Environment variables only apply to NEW deployments.

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. ✅ Check **"Use existing Build Cache"** (faster)
5. Click **"Redeploy"**

Wait 30 seconds for deployment to complete.

---

## Test Authentication

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click **"Get Started"**
3. Click **"Sign in with Google"**
4. Should redirect to Google OAuth → Success!

---

## Still Not Working?

### Check Vercel Function Logs:

1. Go to **Deployments** → Click latest deployment
2. Scroll to **"Function Logs"** or **"Runtime Logs"**
3. Look for errors (usually in red)

### Common Errors:

**"AUTH_SECRET not set"**
→ Add `AUTH_SECRET` environment variable (see Step 1)

**"redirect_uri_mismatch"**
→ Update Google OAuth redirect URI (see above)

**"Cannot read properties of undefined"**
→ Missing `AUTH_GOOGLE_ID` or `AUTH_GOOGLE_SECRET`

---

## Environment Variable Checklist

Make sure ALL these are set in Vercel:

- [ ] `AUTH_SECRET` (generated with openssl)
- [ ] `AUTH_TRUST_HOST=true`
- [ ] `NEXTAUTH_URL` (your Vercel URL)
- [ ] `AUTH_GOOGLE_ID`
- [ ] `AUTH_GOOGLE_SECRET`
- [ ] `LLM_PROVIDER` (gemini or openai)
- [ ] `GEMINI_API_KEY` (if using Gemini)
- [ ] `GEMINI_MODEL=gemini-2.0-flash`

---

**After adding all variables, redeploy and it should work!**
