"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Facebook, Twitter, Instagram, Linkedin, TrendingUp, TrendingDown } from "lucide-react"

interface PlatformData {
  platform: string
  followers: number
  engagement: number
  posts: number
  growth: number
}

interface PlatformComparisonProps {
  data: PlatformData[]
  detailed?: boolean
}

const platformIcons = {
  Twitter: Twitter,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Facebook: Facebook,
}

const platformColors = {
  Twitter: "#3b82f6", // Blue
  Instagram: "#10b981", // Green
  LinkedIn: "#f59e0b", // Yellow
  Facebook: "#8b5cf6", // Purple for fourth platform
}

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "#3b82f6", // Blue
  },
  followers: {
    label: "Followers",
    color: "#10b981", // Green
  },
}

export function PlatformComparison({ data, detailed = false }: PlatformComparisonProps) {
  if (detailed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((platform) => {
          const Icon = platformIcons[platform.platform as keyof typeof platformIcons]
          const isPositiveGrowth = platform.growth > 0

          return (
            <Card key={platform.platform} className="shadow-sm border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon
                      className="h-5 w-5"
                      style={{ color: platformColors[platform.platform as keyof typeof platformColors] }}
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold">{platform.platform}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-xl font-bold text-foreground">{platform.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-xl font-bold text-foreground">{platform.engagement.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Posts</p>
                    <p className="text-xl font-bold text-foreground">{platform.posts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <div className="flex items-center gap-1">
                      {isPositiveGrowth ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${isPositiveGrowth ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {isPositiveGrowth ? "+" : ""}
                        {platform.growth}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Badge variant={isPositiveGrowth ? "default" : "destructive"}>
                    {isPositiveGrowth ? "Growing" : "Declining"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Platform Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="platform"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => (value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString())}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="engagement" fill="#3b82f6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
