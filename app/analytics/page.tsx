import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Gain Insights That Matter</h1>
            <p className="text-muted-foreground">
              Track your social media performance and discover what resonates with your audience.
            </p>
          </div>

          <AnalyticsDashboard />
        </div>
      </div>
    </DashboardLayout>
  )
}
