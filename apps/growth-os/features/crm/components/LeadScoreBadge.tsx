import { cn } from "@/utils/cn";

interface LeadScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-500 border-slate-200";
}

export function LeadScoreBadge({ score, size = "sm" }: LeadScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-semibold tabular-nums",
        size === "sm" ? "h-6 min-w-[24px] px-1.5 text-xs" : "h-8 min-w-[32px] px-2 text-sm",
        getScoreColor(score)
      )}
    >
      {score}
    </span>
  );
}
