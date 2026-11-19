import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { formatCompact } from "@/utils/format";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  iconClassName?: string;
  format?: "number" | "compact" | "percent" | "raw";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconClassName,
  format = "compact",
}: StatCardProps) {
  const displayValue =
    typeof value === "number"
      ? format === "compact"
        ? formatCompact(value)
        : format === "percent"
          ? `${value.toFixed(1)}%`
          : value.toLocaleString()
      : value;

  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {displayValue}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive !== false
                      ? "text-emerald-600"
                      : "text-red-500"
                  )}
                >
                  {trend.positive !== false ? "+" : ""}
                  {trend.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-primary/10"
            )}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
