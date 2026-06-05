"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LucideTicket,
  LucideCheckCircle,
  LucideDollarSign,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { fromCent } from "@/utils/currency";

type AnalyticsDashboardProps = {
  totalTickets: number;
  completedTickets: number;
  bountyEarned: number;
  statusData: { status: string; count: number }[];
  monthlyData: { month: string; tickets: number }[];
};

const areaConfig = {
  tickets: { label: "Tickets", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#BA7517",
  OPEN: "#378ADD",
  IN_PROGRESS: "#7F77DD",
  DONE: "#1D9E75",
};

// const monthlyData = [
//   { month: "Jan", tickets: 4 },
//   { month: "Feb", tickets: 7 },
//   { month: "Mar", tickets: 5 },
//   { month: "Apr", tickets: 12 },
//   { month: "May", tickets: 9 },
//   { month: "Jun", tickets: 3 },
// ];

const AnalyticsDashboard = ({
  totalTickets,
  completedTickets,
  bountyEarned,
  statusData,
  monthlyData,
}: AnalyticsDashboardProps) => {
  const maxCount = Math.max(...statusData.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-y-3">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-muted/50 border border-border rounded-md px-4 py-3 border-l-[3px] border-l-blue-500">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <LucideTicket className="size-3.5" />
            <span className="text-xs font-medium">Total tickets</span>
          </div>
          <p className="text-xl font-semibold leading-none">{totalTickets}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>

        <div className="bg-muted/50 border border-border rounded-md px-4 py-3 border-l-[3px] border-l-emerald-500">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <LucideCheckCircle className="size-3.5" />
            <span className="text-xs font-medium">Completed</span>
          </div>
          <p className="text-xl font-semibold leading-none">
            {completedTickets}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Status: done</p>
        </div>

        <div className="bg-muted/50 border border-border rounded-md px-4 py-3 border-l-[3px] border-l-amber-500">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <LucideDollarSign className="size-3.5" />
            <span className="text-xs font-medium">Bounty earned</span>
          </div>
          <p className="text-xl font-semibold leading-none">
            ${fromCent(bountyEarned)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">From completed</p>
        </div>
      </div>

      {/* Area chart */}
      <Card className="bg-muted/50 border-border shadow-none">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tickets over time
          </CardTitle>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold">
              {monthlyData[monthlyData.length - 1]?.tickets ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">
              in {monthlyData[monthlyData.length - 1]?.month ?? "N/A"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <ChartContainer config={areaConfig} className="h-32 w-full">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#378ADD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#378ADD" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} className="stroke-border" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                className="text-[10px]"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="tickets"
                type="natural"
                fill="url(#fillTickets)"
                stroke="#378ADD"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Status breakdown — horizontal bars */}
      <Card className="bg-muted/50 border-border shadow-none">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tickets by status
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 flex flex-col gap-2">
          {statusData.map((item) => (
            <div key={item.status} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">
                {item.status.charAt(0) +
                  item.status.slice(1).toLowerCase().replace("_", " ")}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor:
                      STATUS_COLORS[item.status] ?? "hsl(var(--primary))",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                {item.count}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
