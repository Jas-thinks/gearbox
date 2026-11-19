/**
 * Application-wide configuration.
 * All values are read from environment variables.
 * Never hardcode values here.
 */

export const APP_CONFIG = {
  name: "Gearbox Growth OS",
  version: "1.0.0",
  description: "Internal growth operating system for Gearbox",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const AUTH_CONFIG = {
  /**
   * The hidden admin route. Change via env to obscure from bots.
   */
  adminPath: process.env.ADMIN_SECRET_PATH ?? "/admin-secret",
  sessionCookieName: "gearbox_admin_session",
  sessionMaxAgeSec: 60 * 60 * 24 * 7, // 7 days
} as const;

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export const EMAIL_CONFIG = {
  provider: (process.env.EMAIL_PROVIDER ?? "smtp") as "smtp" | "resend" | "ses",
  from: process.env.EMAIL_FROM ?? "noreply@gearbox.app",
  fromName: process.env.EMAIL_FROM_NAME ?? "Gearbox",
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
} as const;

export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER ?? "gemini") as "gemini" | "openai",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  isEnabled:
    Boolean(process.env.GEMINI_API_KEY) || Boolean(process.env.OPENAI_API_KEY),
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 25,
  maxPageSize: 100,
} as const;
