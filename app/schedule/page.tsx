import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
            <p className="text-muted-foreground">
              Chat with Gemini AI about your social media strategy and content creation.
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <ChatInterface />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
