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
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

const barConfig = {
  count: { label: "Count", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const AnalyticsDashboard = ({
  totalTickets,
  completedTickets,
  bountyEarned,
  statusData,
  monthlyData,
}: AnalyticsDashboardProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
            <LucideTicket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <LucideCheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">Status: Done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bounty Earned
            </CardTitle>
            <LucideDollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${fromCent(bountyEarned)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              From completed tickets
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Tickets Over Time
          </CardTitle>
          <p className="text-2xl font-bold flex gap-x-1 items-center">
            {monthlyData[monthlyData.length - 1]?.tickets ?? 0}
            <span className="text-xs text-muted-foreground font-normal">
              {`in ${monthlyData[monthlyData.length - 1]?.month ?? "N/A"}`}
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaConfig} className="h-48 w-full">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="tickets"
                type="natural"
                fill="url(#fillTickets)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Tickets by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig} className="h-48 w-full">
            <BarChart data={statusData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
