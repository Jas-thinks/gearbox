import { envSchema } from "@/config/env";

function isEmailEnabled(env: ReturnType<typeof envSchema.safeParse>["data"]): boolean {
  if (!env?.EMAIL_PROVIDER) return false;
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

export class HealthController {
  static async check() {
    const envResult = envSchema.safeParse(process.env);
    const envConfigured = envResult.success;

    return {
      data: {
        status: envConfigured ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        version: "0.1.0",
        services: {
          database: envConfigured ? "configured" : "misconfigured",
          email: envConfigured && isEmailEnabled(envResult.data) ? "enabled" : "disabled",
        },
      },
    };
  }
}
