"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, HelpCircle, Upload, Link, Type, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

export default function ExplainPage() {
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [explanation, setExplanation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const { theme } = useTheme()

  const handleExplain = async () => {
    setIsLoading(true)
    try {
      let response

      if (activeTab === "text" && textInput.trim()) {
        response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Please explain the following social media concept, strategy, or content in detail. Provide insights, best practices, and actionable advice: ${textInput}`,
          }),
        })
      } else if (activeTab === "url" && urlInput.trim()) {
        response = await fetch("/api/gemini/url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: urlInput,
            message: `Please analyze and explain this URL/link in the context of social media: ${urlInput}. In the first paragraph describe the contents in 3 sentences or less. In the second paragraph transcribe the first 3 lines of the video.`,
          }),
        })
      } else if (activeTab === "file" && file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append(
          "message",
          "Please analyze and explain this file in the context of social media. Provide a 3 sentence or shorter description of its contents.",
        )

        response = await fetch("/api/gemini/upload", {
          method: "POST",
          body: formData,
        })
      } else if (activeTab === "pdf" && pdfFile) {
        const formData = new FormData()
        formData.append("file", pdfFile)
        formData.append(
          "message",
          "Please analyze and explain this PDF document in the context of social media. Provide a 3 sentence or shorter description of its contents.",
        )

        response = await fetch("/api/gemini/upload", {
          method: "POST",
          body: formData,
        })
      } else {
        throw new Error("Please provide input")
      }

      if (!response?.ok) {
        const errorData = await response.text()
        console.error("API Error:", response.status, errorData)
        throw new Error(`API Error (${response.status}): ${errorData}`)
      }

      const data = await response.json()
      setExplanation(data.response || data.text || data.message || "No explanation received")
    } catch (error) {
      console.error("Error generating explanation:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setExplanation(`Sorry, I couldn't generate an explanation. Error: ${errorMessage}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const canExplain = () => {
    if (activeTab === "text") return textInput.trim()
    if (activeTab === "url") return urlInput.trim()
    if (activeTab === "file") return file
    if (activeTab === "pdf") return pdfFile
    return false
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Explain</h1>
            <p className="text-muted-foreground">
              Get detailed explanations about social media content using text, links, or file uploads
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What would you like explained?
              </CardTitle>
              <CardDescription>Choose how you'd like to provide content for analysis and explanation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    File
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    placeholder="e.g., How does the Instagram algorithm work? What makes a good LinkedIn post? How to increase engagement on TikTok?"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/social-media-post"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste a URL to analyze social media content, posts, or strategies
                  </p>
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-muted-foreground">Upload images, documents, or screenshots for analysis</p>
                  {file && (
                    <p className="text-sm text-green-600">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="pdf" className="space-y-4">
                  <Input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  <p className="text-sm text-muted-foreground">
                    Upload PDF documents for detailed analysis and explanation
                  </p>
                  {pdfFile && (
                    <p className="text-sm text-green-600">
                      Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </TabsContent>
              </Tabs>

              <Button onClick={handleExplain} disabled={!canExplain() || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating explanation...
                  </>
                ) : (
                  "Explain"
                )}
              </Button>
            </CardContent>
          </Card>

          {explanation && (
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={theme === "dark" ? oneDark : oneLight}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md my-4"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`${className} bg-muted px-1 py-0.5 rounded text-sm`} {...props}>
                            {children}
                          </code>
                        )
                      },
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-foreground">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-foreground">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
