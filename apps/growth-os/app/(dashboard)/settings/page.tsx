import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_CONFIG, EMAIL_CONFIG, AI_CONFIG, SUPABASE_CONFIG } from "@/config/app";
import { CheckCircle2, XCircle } from "lucide-react";

interface SettingRow {
  label: string;
  value: string;
  isConfigured: boolean;
}

const SETTINGS: { section: string; rows: SettingRow[] }[] = [
  {
    section: "Application",
    rows: [
      { label: "App Name", value: APP_CONFIG.name, isConfigured: true },
      { label: "App URL", value: APP_CONFIG.url, isConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL) },
      { label: "Version", value: APP_CONFIG.version, isConfigured: true },
    ],
  },
  {
    section: "Database",
    rows: [
      {
        label: "Supabase URL",
        value: SUPABASE_CONFIG.url ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(SUPABASE_CONFIG.url),
      },
      {
        label: "Supabase Anon Key",
        value: SUPABASE_CONFIG.anonKey ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(SUPABASE_CONFIG.anonKey),
      },
    ],
  },
  {
    section: "Email",
    rows: [
      { label: "Provider", value: EMAIL_CONFIG.provider, isConfigured: true },
      {
        label: "From Address",
        value: EMAIL_CONFIG.from,
        isConfigured: Boolean(process.env.EMAIL_FROM),
      },
      {
        label: "SMTP Host",
        value: EMAIL_CONFIG.smtp.host || "Not configured",
        isConfigured: Boolean(EMAIL_CONFIG.smtp.host),
      },
      {
        label: "SMTP Port",
        value: EMAIL_CONFIG.smtp.port.toString(),
        isConfigured: Boolean(EMAIL_CONFIG.smtp.host),
      },
    ],
  },
  {
    section: "AI Engine",
    rows: [
      {
        label: "AI Provider",
        value: AI_CONFIG.provider,
        isConfigured: AI_CONFIG.isEnabled,
      },
      {
        label: "Gemini API Key",
        value: AI_CONFIG.geminiApiKey ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(AI_CONFIG.geminiApiKey),
      },
      {
        label: "OpenAI API Key",
        value: AI_CONFIG.openaiApiKey ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(AI_CONFIG.openaiApiKey),
      },
    ],
  },
  {
    section: "Authentication",
    rows: [
      {
        label: "Admin Email",
        value: process.env.ADMIN_EMAIL ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(process.env.ADMIN_EMAIL),
      },
      {
        label: "Admin Password",
        value: process.env.ADMIN_PASSWORD ? "Configured ✓" : "Not configured",
        isConfigured: Boolean(process.env.ADMIN_PASSWORD),
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="System configuration loaded from environment variables. No secrets are stored in the database."
      />

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Read-only view.</strong> All configuration is managed via environment variables in{" "}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env.local</code>. No
        secrets are persisted in the database.
      </div>

      <div className="space-y-4">
        {SETTINGS.map((group) => (
          <Card key={group.section}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{group.section}</CardTitle>
              <CardDescription className="text-xs">
                Environment-variable driven configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {group.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {row.value}
                      </span>
                      {row.isConfigured ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
