import Link from "next/link";
import { Cog } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Cog className="size-5" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">Gearbox</span>
      )}
    </Link>
  );
}
