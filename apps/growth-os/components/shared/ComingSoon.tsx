import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  module: string;
  milestone: string;
  features?: string[];
}

export function ComingSoon({ module, milestone, features = [] }: ComingSoonProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Construction className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{module}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        This module is under active development.
      </p>
      <Badge variant="outline" className="mt-4">
        Coming in {milestone}
      </Badge>
      {features.length > 0 && (
        <ul className="mt-6 space-y-1 text-left text-sm text-muted-foreground">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
