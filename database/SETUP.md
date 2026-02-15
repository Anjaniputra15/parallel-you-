# Supabase Database Setup Guide

This guide will help you set up the Supabase database for Parallel You authentication and data storage.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: parallel-you (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait 2-3 minutes

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **RUN** or press `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac)
6. Wait for "Success. No rows returned" message

## Step 3: Get Your Supabase Credentials

### Project URL
1. Go to **Settings** → **API** (in left sidebar)
2. Under "Project URL", copy the URL
3. It looks like: `https://xxxxxxxxxxxxx.supabase.co`

### Service Role Key (Secret)
1. Still in **Settings** → **API**
2. Under "Project API keys", find **service_role** key
3. Click "Reveal" and copy it
4. ⚠️ **IMPORTANT**: This is a secret key — never commit it to git or share it publicly

## Step 4: Update Your .env.local File

Add your Supabase credentials to `/parallel-you/.env.local`:

```bash
# ===== Supabase Configuration =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 5: Set Up Google OAuth

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Parallel You"
   - Authorized redirect URIs, add:
     - `http://localhost:3000/api/auth/callback/google` (for local dev)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"
5. Copy your **Client ID** and **Client Secret**

### Update .env.local with Google Credentials

```bash
# ===== Authentication Configuration =====
AUTH_SECRET=generate-this-with-openssl-command-below
AUTH_GOOGLE_ID=your-google-client-id-here
AUTH_GOOGLE_SECRET=your-google-client-secret-here
```

### Generate AUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `AUTH_SECRET`.

## Step 6: Verify Database Setup

You can verify your database is set up correctly by checking:

1. **Tables Created**: In Supabase dashboard, go to **Table Editor**
   - You should see: `users`, `accounts`, `sessions`, `verification_tokens`, `debate_sessions`

2. **RLS Enabled**: Click on any table, go to **Policies**
   - You should see RLS policies listed for each table

3. **Test Connection**: Try running this query in SQL Editor:
   ```sql
   SELECT * FROM users LIMIT 1;
   ```
   - Should return empty result (no error)

## Step 7: Test Authentication (Optional)

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Check Supabase dashboard → **Table Editor** → **users**
   - You should see your user record created!

## Troubleshooting

### Error: "relation 'users' does not exist"
- Make sure you ran the schema.sql file completely
- Check SQL Editor for error messages when running the schema

### Error: "invalid authentication token"
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Make sure you copied the **service_role** key, not the **anon** key

### OAuth redirect error
- Check your Google OAuth redirect URIs match exactly
- Make sure you included both localhost (dev) and production URLs

### RLS policy error when creating sessions
- Verify RLS policies were created by checking Table Editor → Policies
- Make sure `auth.uid()` function is available (it's built into Supabase)

## Security Notes

- ✅ **Service role key** is only used server-side (never exposed to client)
- ✅ **RLS policies** ensure users can only access their own data
- ✅ **OAuth tokens** are managed by Auth.js (encrypted, HTTP-only cookies)
- ⚠️ Never commit `.env.local` to git (already in .gitignore)

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add all environment variables to your hosting platform
2. Update Google OAuth redirect URIs with your production domain
3. Consider enabling Supabase's "Email confirmation" for added security
4. Set up Supabase backups (Settings → Database → Backups)

---

**Need help?** Check the [Supabase docs](https://supabase.com/docs) or [Auth.js docs](https://authjs.dev/)
