import { DashboardLayout } from "@/components/dashboard-layout"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Deepmind Explorations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your social media strategy with AI-powered management, scheduling, and analytics across all
              platforms.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-muted-foreground">Powered by Google Gemini</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4 px-4 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                <img src="/Google_Gemini_logo.svg" alt="Google Gemini" className="h-44 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
