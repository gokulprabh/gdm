"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Search, ExternalLink, Brain } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  thoughts?: string // Added thoughts field for AI reasoning process
  groundingMetadata?: {
    groundingChunks?: Array<{
      web?: {
        uri: string
        title?: string
      }
    }>
    groundingSupports?: Array<{
      segment: {
        startIndex: number
        endIndex: number
        text: string
      }
      groundingChunkIndices: number[]
    }>
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant for social media management. I can help you with **content creation**, *strategy*, analytics insights, and more. What would you like to discuss?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
        thoughts: data.thoughts, // Added thoughts from API response
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      let errorContent = "Sorry, I encountered an error. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("Gemini API key not configured")) {
          errorContent = `🔑 **API Key Required**

To use the AI chat features, you need to configure your Gemini API key:

1. Go to **Project Settings** (top right corner)
2. Add environment variable: \`GEMINI_API_KEY\`
3. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

Once configured, refresh the page and try again!`
        } else if (error.message.includes("API error")) {
          errorContent =
            "There was an issue connecting to the AI service. Please check your internet connection and try again."
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGroundedSearch = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/gemini/grounded", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
        groundingMetadata: data.groundingMetadata,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      let errorContent = "Sorry, I encountered an error with grounded search. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("Gemini API key not configured")) {
          errorContent = `🔑 **API Key Required**

To use grounded search, you need to configure your Gemini API key:

1. Go to **Project Settings** (top right corner)
2. Add environment variable: \`GEMINI_API_KEY\`
3. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

Once configured, refresh the page and try again!`
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const processTextWithSuperscripts = (text: string, groundingSupports: any[]) => {
    if (!groundingSupports || groundingSupports.length === 0) {
      return text
    }

    let processedText = text
    let offset = 0

    // Sort supports by startIndex to process them in order
    const sortedSupports = [...groundingSupports].sort((a, b) => a.segment.startIndex - b.segment.startIndex)

    sortedSupports.forEach((support) => {
      const { startIndex, endIndex } = support.segment
      const chunkIndices = support.groundingChunkIndices || []

      if (chunkIndices.length > 0) {
        const superscriptNumbers = chunkIndices.map((index) => index + 1).join(",")
        const beforeText = processedText.slice(0, startIndex + offset)
        const segmentText = processedText.slice(startIndex + offset, endIndex + offset)
        const afterText = processedText.slice(endIndex + offset)

        const superscriptHtml = `<sup style="color: #3b82f6; font-size: 0.7em; font-weight: 600;">[${superscriptNumbers}]</sup>`
        processedText = beforeText + segmentText + superscriptHtml + afterText
        offset += superscriptHtml.length
      }
    })

    return processedText
  }

  const renderGroundedMessage = (message: Message) => {
    if (!message.groundingMetadata?.groundingChunks) {
      return (
        <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-500">Grounded Search Result</span>
          </div>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-md" {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-2 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold mb-3 mt-2 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-medium mb-2 mt-2 first:mt-0">{children}</h3>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic mb-3 py-1">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      )
    }

    const sources = message.groundingMetadata.groundingChunks
      .filter((chunk) => chunk.web?.uri)
      .map((chunk, index) => ({
        id: index + 1,
        url: chunk.web!.uri,
        title: chunk.web!.title || `Source ${index + 1}`,
      }))

    const processedContent = message.groundingMetadata.groundingSupports
      ? processTextWithSuperscripts(message.content, message.groundingMetadata.groundingSupports)
      : message.content

    return (
      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-500">Grounded Search Result</span>
        </div>

        <div className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedContent }} />

        {sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Sources:</span>
              <div className="flex flex-wrap gap-1">
                {sources.map((source, index) => (
                  <span key={source.id} className="flex items-center">
                    <span className="text-blue-500 font-semibold mr-1">[{source.id}]</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 underline flex items-center gap-1"
                    >
                      <span>{source.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    {index < sources.length - 1 && <span className="text-muted-foreground ml-1">,</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderAssistantMessage = (message: Message) => {
    if (message.groundingMetadata) {
      return renderGroundedMessage(message)
    }

    const limitedThoughts = message.thoughts
      ? message.thoughts.split(".").slice(0, 3).join(".") + (message.thoughts.split(".").length > 3 ? "." : "")
      : undefined

    return (
      <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
        {limitedThoughts && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-500">AI Reasoning Process</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{limitedThoughts}</div>
          </div>
        )}

        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-md" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            },
            p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-2 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-semibold mb-3 mt-2 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-medium mb-2 mt-2 first:mt-0">{children}</h3>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic mb-3 py-1">
                {children}
              </blockquote>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-12rem)] shadow-sm">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className="flex-shrink-0 mt-1">
                  {message.role === "user" ? (
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div
                  className={`rounded-xl px-5 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border border-border/50"
                  }`}
                >
                  {message.role === "assistant" ? (
                    renderAssistantMessage(message) // Use new render function for assistant messages
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
                  <p className="text-xs opacity-60 mt-3 pt-1 border-t border-current/10">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center shadow-sm mt-1">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="bg-muted/50 border border-border/50 rounded-xl px-5 py-3 shadow-sm">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/50 p-6">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about social media strategy, content creation, or analytics..."
            disabled={isLoading}
            className="flex-1 h-11 px-4 bg-background shadow-sm"
          />
          <Button
            onClick={handleGroundedSearch}
            disabled={isLoading || !input.trim()}
            variant="outline"
            className="h-11 px-4 shadow-sm bg-transparent"
            title="Search with Google grounding"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-11 px-4 shadow-sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
