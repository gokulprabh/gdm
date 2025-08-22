"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Lightbulb } from "lucide-react"
import { geminiAPI } from "@/lib/gemini"

interface AIContentOptimizerProps {
  content: string
  platform: string
}

export function AIContentOptimizer({ content, platform }: AIContentOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [optimization, setOptimization] = useState<{
    suggestions: string[]
    optimizedContent: string
    score: number
  } | null>(null)

  const handleOptimize = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await geminiAPI.optimizeContent(content, platform)
      setOptimization(result)
    } catch (error) {
      console.error("Error optimizing content:", error)
      // Fallback optimization
      setOptimization({
        suggestions: [
          "Consider adding relevant hashtags",
          "Include a call-to-action",
          "Make the opening more engaging",
        ],
        optimizedContent: content,
        score: 7,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          AI Content Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleOptimize} disabled={!content.trim() || isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Optimize Content
            </>
          )}
        </Button>

        {optimization && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Engagement Score:</span>
              <Badge className={`${getScoreColor(optimization.score)} text-white`}>{optimization.score}/10</Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </h4>
              <ul className="space-y-1">
                {optimization.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {optimization.optimizedContent !== content && (
              <div>
                <h4 className="text-sm font-medium mb-2">Optimized Version</h4>
                <div className="p-3 bg-muted rounded-md text-sm">{optimization.optimizedContent}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
