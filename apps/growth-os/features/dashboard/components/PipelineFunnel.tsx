"use client";

import { cn } from "@/utils/cn";

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

interface PipelineFunnelProps {
  stages: FunnelStage[];
}

export function PipelineFunnel({ stages }: PipelineFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="space-y-2">
      {stages.map((stage, index) => {
        const width = Math.max((stage.count / maxCount) * 100, 4);
        return (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="w-32 shrink-0 text-right">
              <span className="text-xs text-muted-foreground">{stage.label}</span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-7 flex-1 overflow-hidden rounded-sm bg-muted">
                <div
                  className={cn("h-full rounded-sm transition-all duration-500", stage.color)}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-medium text-foreground">
                {stage.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
