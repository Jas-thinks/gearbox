"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { GrowthDataPoint } from "@/types/analytics";
import { formatDate } from "@/utils/format";

interface GrowthChartProps {
  data: GrowthDataPoint[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No data available yet. Data will appear as leads are added.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tickFormatter={(val: string) => formatDate(val, "MMM d")}
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          className="text-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          labelFormatter={(label) => formatDate(String(label), "MMM d, yyyy")}
        />
        <Legend iconType="circle" iconSize={8} />
        <Area
          type="monotone"
          dataKey="leads"
          name="New Leads"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorLeads)"
        />
        <Area
          type="monotone"
          dataKey="emails_sent"
          name="Emails Sent"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorEmails)"
        />
        <Area
          type="monotone"
          dataKey="replies"
          name="Replies"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#colorReplies)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
