"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface EngagementChartProps {
  timeRange: string
}

// Mock engagement data
const engagementData = [
  { date: "Dec 1", engagement: 245, reach: 1200, impressions: 2400 },
  { date: "Dec 2", engagement: 312, reach: 1450, impressions: 2800 },
  { date: "Dec 3", engagement: 189, reach: 980, impressions: 1900 },
  { date: "Dec 4", engagement: 456, reach: 2100, impressions: 4200 },
  { date: "Dec 5", engagement: 378, reach: 1800, impressions: 3600 },
  { date: "Dec 6", engagement: 523, reach: 2400, impressions: 4800 },
  { date: "Dec 7", engagement: 445, reach: 2000, impressions: 4000 },
  { date: "Dec 8", engagement: 367, reach: 1650, impressions: 3300 },
  { date: "Dec 9", engagement: 612, reach: 2800, impressions: 5600 },
  { date: "Dec 10", engagement: 489, reach: 2200, impressions: 4400 },
  { date: "Dec 11", engagement: 356, reach: 1600, impressions: 3200 },
  { date: "Dec 12", engagement: 678, reach: 3100, impressions: 6200 },
  { date: "Dec 13", engagement: 534, reach: 2400, impressions: 4800 },
  { date: "Dec 14", engagement: 423, reach: 1900, impressions: 3800 },
  { date: "Dec 15", engagement: 567, reach: 2600, impressions: 5200 },
]

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "#3b82f6", // Blue
  },
  reach: {
    label: "Reach",
    color: "#10b981", // Green
  },
  impressions: {
    label: "Impressions",
    color: "#f59e0b", // Yellow
  },
}

export function EngagementChart({ timeRange }: EngagementChartProps) {
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Engagement Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(4)}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => (value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString())}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="impressions"
                type="monotone"
                fill="url(#fillImpressions)"
                fillOpacity={0.4}
                stroke="#f59e0b"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="reach"
                type="monotone"
                fill="url(#fillReach)"
                fillOpacity={0.4}
                stroke="#10b981"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="engagement"
                type="monotone"
                fill="url(#fillEngagement)"
                fillOpacity={0.4}
                stroke="#3b82f6"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
