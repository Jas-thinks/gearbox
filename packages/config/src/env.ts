import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Database (optional — used for direct connections / migrations)
  DATABASE_URL: z.string().optional(),

  // Auth / API security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters").optional(),
  API_SECRET: z.string().min(16, "API_SECRET must be at least 16 characters").optional(),
  WAITLIST_API_KEY: z.string().min(16, "WAITLIST_API_KEY must be at least 16 characters").optional(),

  // App
  APP_URL: z.string().url("APP_URL must be a valid URL").optional(),
  CORS_ALLOWED_ORIGINS: z.string().optional(),

  // Distributed infrastructure (all optional — local fallbacks when unset)
  REDIS_URL: z.string().optional(),
  SQS_QUEUE_URL: z.string().optional(),
  AWS_REGION: z.string().default("ap-south-1"),

  // Rate limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),

  // Email provider (all optional — disabled when not configured)
  EMAIL_PROVIDER: z.enum(["smtp", "resend", "sendgrid", "mailgun", ""]).optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  MAILGUN_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Growth OS webhooks
  GROWTH_OS_WEBHOOK_URL: z.string().url().optional(),
  GROWTH_OS_WEBHOOK_SECRET: z.string().optional(),

  // Public site URL (SEO — also used for CORS fallback)
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Validates and returns environment variables.
 * Called lazily at runtime — never at build time.
 */
export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

/** Reset cached env — useful for testing */
export function resetEnvCache(): void {
  cachedEnv = null;
}

export function getCorsOrigins(): string[] {
  const env = getEnv();
  if (env.CORS_ALLOWED_ORIGINS) {
    return env.CORS_ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  }
  if (env.APP_URL) {
    return [env.APP_URL];
  }
  return [];
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}

export function isEmailConfigured(): boolean {
  const env = getEnv();
  if (!env.EMAIL_PROVIDER) return false;

  switch (env.EMAIL_PROVIDER) {
    case "smtp":
      return !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
    case "resend":
      return !!env.RESEND_API_KEY;
    case "sendgrid":
      return !!env.SENDGRID_API_KEY;
    case "mailgun":
      return !!env.MAILGUN_API_KEY;
    default:
      return false;
  }
}
