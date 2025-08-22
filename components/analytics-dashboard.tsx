"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EngagementChart } from "@/components/engagement-chart"
import { PlatformComparison } from "@/components/platform-comparison"
import { TrendingUp, Users, Heart, Eye, Calendar, Download } from "lucide-react"

// Mock analytics data
const analyticsData = {
  overview: {
    totalFollowers: 12847,
    totalEngagement: 3421,
    totalReach: 45632,
    totalImpressions: 78945,
    followerGrowth: 12.5,
    engagementRate: 4.2,
    reachGrowth: 8.7,
    impressionGrowth: 15.3,
  },
  platformStats: [
    { platform: "Twitter", followers: 4521, engagement: 1234, posts: 45, growth: 8.2 },
    { platform: "Instagram", followers: 3892, engagement: 987, posts: 32, growth: 15.7 },
    { platform: "LinkedIn", followers: 2847, engagement: 756, posts: 28, growth: 6.3 },
    { platform: "Facebook", followers: 1587, engagement: 444, posts: 19, growth: -2.1 },
  ],
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedTab, setSelectedTab] = useState("overview")

  const { overview } = analyticsData

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{overview.totalFollowers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{overview.followerGrowth}%</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{overview.totalEngagement.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">{overview.engagementRate}% rate</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <Heart className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">{overview.totalReach.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{overview.reachGrowth}%</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{overview.totalImpressions.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{overview.impressionGrowth}%</span>
                </div>
              </div>
              <div className="p-2 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <div className="w-full">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <div className="w-full flex justify-center">
            <TabsList className="grid max-w-xl grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
              <EngagementChart timeRange={timeRange} />
              <PlatformComparison data={analyticsData.platformStats} />
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <PlatformComparison data={analyticsData.platformStats} detailed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
