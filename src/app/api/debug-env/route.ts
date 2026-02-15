import { NextResponse } from "next/server";

// Diagnostic endpoint to check environment variables
// DELETE THIS FILE after fixing auth!
export async function GET() {
  const envCheck = {
    AUTH_SECRET: !!process.env.AUTH_SECRET ? "✅ Set" : "❌ Missing",
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "❌ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "❌ Missing",
    AUTH_GOOGLE_ID: !!process.env.AUTH_GOOGLE_ID ? "✅ Set" : "❌ Missing",
    AUTH_GOOGLE_SECRET: !!process.env.AUTH_GOOGLE_SECRET
      ? "✅ Set"
      : "❌ Missing",
    LLM_PROVIDER: process.env.LLM_PROVIDER || "❌ Missing",
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing",
    GEMINI_MODEL: process.env.GEMINI_MODEL || "❌ Missing",
  };

  const allSet = Object.values(envCheck).every((v) => v.includes("✅"));

  return NextResponse.json({
    status: allSet ? "✅ All environment variables set!" : "❌ Missing variables",
    variables: envCheck,
    hint: allSet
      ? "Environment is configured correctly!"
      : "Add missing variables in Vercel Dashboard → Settings → Environment Variables",
  });
}
