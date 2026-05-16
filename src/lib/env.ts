// Lightweight env helpers — never throws at import time so previews still build
// when keys are missing. Each downstream module decides how to degrade.

export const env = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",

  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM || "AI Audit Engine <onboarding@resend.dev>",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "",

  // Inngest
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY ?? "",
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY ?? "",

  // App
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
};

export const flags = {
  hasSupabase: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  hasOpenAI: Boolean(env.OPENAI_API_KEY),
  hasResend: Boolean(env.RESEND_API_KEY),
  hasInngest: Boolean(env.INNGEST_EVENT_KEY)
};
