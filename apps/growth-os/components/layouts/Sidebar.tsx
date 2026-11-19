"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/config/navigation";
import { APP_CONFIG } from "@/config/app";
import { cn } from "@/utils/cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-foreground">Gearbox</p>
          <p className="text-xs text-sidebar-foreground/50">Growth OS</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {NAVIGATION.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.isNew && (
                          <Badge className="h-4 bg-sidebar-primary px-1.5 text-[10px]">
                            New
                          </Badge>
                        )}
                        {item.badge && (
                          <span className="rounded-full bg-sidebar-foreground/10 px-2 py-0.5 text-xs text-sidebar-foreground/60">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-center text-xs text-sidebar-foreground/30">
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </p>
      </div>
    </aside>
  );
}
