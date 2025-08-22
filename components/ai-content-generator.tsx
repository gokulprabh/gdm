"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, RefreshCw } from "lucide-react"
import { geminiAPI } from "@/lib/gemini"

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void
  selectedPlatforms: string[]
}

export function AIContentGenerator({ onContentGenerated, selectedPlatforms }: AIContentGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      const platform = selectedPlatforms[0] || "LinkedIn"
      const content = await geminiAPI.generatePostContent(topic, platform, tone)
      setGeneratedContent(content)
      onContentGenerated(content)
    } catch (error) {
      console.error("Error generating content:", error)
      // Fallback content
      const fallbackContent = `Excited to share insights about ${topic}! 🚀 #${topic.replace(/\s+/g, "")} #SocialMedia`
      setGeneratedContent(fallbackContent)
      onContentGenerated(fallbackContent)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="topic">Topic or Theme</Label>
          <Input
            id="topic"
            placeholder="e.g., product launch, industry insights, company news"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerate} disabled={!topic.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="mt-4">
            <Label>Generated Content</Label>
            <Textarea
              value={generatedContent}
              onChange={(e) => {
                setGeneratedContent(e.target.value)
                onContentGenerated(e.target.value)
              }}
              className="mt-2"
              rows={4}
            />
            <Button variant="outline" size="sm" onClick={handleGenerate} className="mt-2 bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
