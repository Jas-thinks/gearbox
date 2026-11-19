import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { SUPABASE_CONFIG, EMAIL_CONFIG, AI_CONFIG } from "@/config/app";
import { cn } from "@/utils/cn";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "offline";
  detail: string;
}

function getSystemStatuses(): ServiceStatus[] {
  return [
    {
      name: "Database (Supabase)",
      status:
        SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey
          ? "operational"
          : "offline",
      detail:
        SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey
          ? "Connected"
          : "SUPABASE_URL or ANON_KEY not set",
    },
    {
      name: "Email Engine",
      status:
        EMAIL_CONFIG.provider === "smtp" && EMAIL_CONFIG.smtp.host
          ? "operational"
          : "degraded",
      detail:
        EMAIL_CONFIG.provider === "smtp" && EMAIL_CONFIG.smtp.host
          ? `SMTP · ${EMAIL_CONFIG.smtp.host}`
          : "SMTP not configured",
    },
    {
      name: "AI Engine",
      status: AI_CONFIG.isEnabled ? "operational" : "degraded",
      detail: AI_CONFIG.isEnabled
        ? `Provider: ${AI_CONFIG.provider}`
        : "No API key configured — AI disabled",
    },
    {
      name: "Authentication",
      status:
        process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
          ? "operational"
          : "offline",
      detail:
        process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
          ? "Credentials configured"
          : "ADMIN_EMAIL or ADMIN_PASSWORD not set",
    },
  ];
}

const STATUS_CONFIG = {
  operational: {
    icon: CheckCircle2,
    label: "Operational",
    className: "text-emerald-600",
  },
  degraded: {
    icon: AlertCircle,
    label: "Degraded",
    className: "text-amber-500",
  },
  offline: {
    icon: XCircle,
    label: "Offline",
    className: "text-red-500",
  },
};

export function SystemHealth() {
  const statuses = getSystemStatuses();

  return (
    <div className="space-y-3">
      {statuses.map((service) => {
        const config = STATUS_CONFIG[service.status];
        const Icon = config.icon;

        return (
          <div
            key={service.name}
            className="flex items-center justify-between gap-4 rounded-md border border-border p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {service.name}
              </p>
              <p className="text-xs text-muted-foreground">{service.detail}</p>
            </div>
            <div className={cn("flex items-center gap-1.5", config.className)}>
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{config.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
