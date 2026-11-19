import {
  LayoutDashboard,
  Users,
  Megaphone,
  Mail,
  Brain,
  BarChart3,
  List,
  Settings,
  ScrollText,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isNew?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAVIGATION: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Growth",
    items: [
      {
        label: "CRM",
        href: "/crm",
        icon: Users,
      },
      {
        label: "Campaigns",
        href: "/campaigns",
        icon: Megaphone,
      },
      {
        label: "Leads",
        href: "/leads",
        icon: List,
      },
    ],
  },
  {
    title: "Outreach",
    items: [
      {
        label: "Email Engine",
        href: "/email",
        icon: Mail,
      },
      {
        label: "AI Engine",
        href: "/ai",
        icon: Brain,
        isNew: true,
      },
      {
        label: "Waitlist",
        href: "/waitlist",
        icon: Bell,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Activity Logs",
        href: "/logs",
        icon: ScrollText,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
