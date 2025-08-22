"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Brain, Loader2, Hash } from "lucide-react"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function EmbedPage() {
  const [texts, setTexts] = useState(["", "", ""])
  const [embeddings, setEmbeddings] = useState<any[]>([])
  const [similarities, setSimilarities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const updateText = (index: number, value: string) => {
    const newTexts = [...texts]
    newTexts[index] = value
    setTexts(newTexts)
  }

  const generateEmbeddings = async () => {
    if (texts.some((text) => text.trim() === "")) {
      alert("Please fill in all three text boxes")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/gemini/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts }),
      })

      const data = await response.json()

      if (data.success) {
        setEmbeddings(data.embeddings)
        setSimilarities(data.similarities || [])
      } else {
        alert("Failed to generate embeddings: " + data.error)
      }
    } catch (error) {
      console.error("[v0] Embeddings generation error:", error)
      alert("Failed to generate embeddings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Text Embeddings</h1>
            <p className="text-muted-foreground">
              Generate vector embeddings for three different text inputs using Gemini AI
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Text Inputs
                </CardTitle>
                <CardDescription>Enter three different text strings to generate embeddings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {texts.map((text, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`text-${index}`}>Text {index + 1}</Label>
                    <Input
                      id={`text-${index}`}
                      value={text}
                      onChange={(e) => updateText(index, e.target.value)}
                      placeholder={`Enter your ${index === 0 ? "first" : index === 1 ? "second" : "third"} text here...`}
                    />
                  </div>
                ))}

                <Button onClick={generateEmbeddings} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Embeddings...
                    </>
                  ) : (
                    <>
                      <Hash className="h-4 w-4 mr-2" />
                      Generate Embeddings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {embeddings.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Embedding Results</CardTitle>
                    <CardDescription>Vector embeddings for your text inputs (512 dimensions)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {embeddings.map((embedding, index) => (
                      <div key={index} className="space-y-2">
                        <Label>Text {index + 1} Embedding</Label>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-2">Dimensions: 512</p>
                          <div className="max-h-32 overflow-y-auto">
                            <code className="text-xs break-all">
                              {(() => {
                                const values = embedding?.values || []
                                const first512 = values.slice(0, 512)

                                return (
                                  <>
                                    [
                                    {first512
                                      .slice(0, 10)
                                      .map((val) => (typeof val === "number" ? val.toFixed(6) : val))
                                      .join(", ")}
                                    {first512.length > 10 ? `, ... +${first512.length - 10} more` : ""}]
                                  </>
                                )
                              })()}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Semantic Similarity</CardTitle>
                    <CardDescription>
                      Cosine similarity scores between text pairs (higher = more similar)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {similarities.map((sim, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Text {sim.text1Index + 1} ↔ Text {sim.text2Index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              "{sim.text1}" ↔ "{sim.text2}"
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{sim.similarity.toFixed(4)}</p>
                            <p className="text-xs text-muted-foreground">similarity</p>
                          </div>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(0, sim.similarity * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clustering Visualization</CardTitle>
                    <CardDescription>Visual representation of text clustering based on embedding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-muted rounded-lg p-8 h-80 overflow-hidden">
                      {/* Clustering visualization */}
                      <svg className="w-full h-full" viewBox="0 0 400 300">
                        {/* Background grid */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path
                              d="M 20 0 L 0 0 0 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              opacity="0.1"
                            />
                          </pattern>
                        </defs>
                        <rect width="400" height="300" fill="url(#grid)" />

                        {/* Calculate positions based on similarities */}
                        {(() => {
                          // Get similarity between text 1 and 2
                          const sim12 =
                            similarities.find(
                              (s) =>
                                (s.text1Index === 0 && s.text2Index === 1) ||
                                (s.text1Index === 1 && s.text2Index === 0),
                            )?.similarity || 0

                          // Get similarity between text 1 and 3
                          const sim13 =
                            similarities.find(
                              (s) =>
                                (s.text1Index === 0 && s.text2Index === 2) ||
                                (s.text1Index === 2 && s.text2Index === 0),
                            )?.similarity || 0

                          // Get similarity between text 2 and 3
                          const sim23 =
                            similarities.find(
                              (s) =>
                                (s.text1Index === 1 && s.text2Index === 2) ||
                                (s.text1Index === 2 && s.text2Index === 1),
                            )?.similarity || 0

                          // Convert similarities to distances (higher similarity = shorter distance)
                          const dist12 = (1 - sim12) * 120 + 40 // Scale to reasonable pixel distances
                          const dist13 = (1 - sim13) * 120 + 40
                          const dist23 = (1 - sim23) * 120 + 40

                          // Use triangulation to position nodes based on actual distances
                          const centerX = 200
                          const centerY = 150

                          // Position text 1 at center-top
                          const text1Pos = { x: centerX, y: centerY - 60 }

                          // Position text 2 using distance from text 1
                          const angle12 = Math.PI / 4 // 45 degrees
                          const text2Pos = {
                            x: text1Pos.x + dist12 * Math.cos(angle12),
                            y: text1Pos.y + dist12 * Math.sin(angle12),
                          }

                          // Position text 3 using triangulation from text 1 and text 2
                          // Calculate position that satisfies both dist13 and dist23
                          const dx = text2Pos.x - text1Pos.x
                          const dy = text2Pos.y - text1Pos.y
                          const d12_actual = Math.sqrt(dx * dx + dy * dy)

                          // Use law of cosines to find angle for text 3
                          const cosAngle =
                            (dist13 * dist13 + d12_actual * d12_actual - dist23 * dist23) / (2 * dist13 * d12_actual)
                          const angle13 = Math.acos(Math.max(-1, Math.min(1, cosAngle))) - Math.atan2(dy, dx)

                          const text3Pos = {
                            x: text1Pos.x + dist13 * Math.cos(angle13),
                            y: text1Pos.y + dist13 * Math.sin(angle13),
                          }

                          // Ensure positions stay within bounds (with padding for node radius)
                          const clampPosition = (pos: { x: number; y: number }) => ({
                            x: Math.max(30, Math.min(370, pos.x)),
                            y: Math.max(30, Math.min(270, pos.y)),
                          })

                          const clampedText1 = clampPosition(text1Pos)
                          const clampedText2 = clampPosition(text2Pos)
                          const clampedText3 = clampPosition(text3Pos)

                          return (
                            <>
                              {/* Connection lines with opacity based on similarity */}
                              <line
                                x1={clampedText1.x}
                                y1={clampedText1.y}
                                x2={clampedText2.x}
                                y2={clampedText2.y}
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                opacity={sim12}
                              />
                              <line
                                x1={clampedText1.x}
                                y1={clampedText1.y}
                                x2={clampedText3.x}
                                y2={clampedText3.y}
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                opacity={sim13}
                              />
                              <line
                                x1={clampedText2.x}
                                y1={clampedText2.y}
                                x2={clampedText3.x}
                                y2={clampedText3.y}
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                opacity={sim23}
                              />

                              {/* Text nodes */}
                              <circle
                                cx={clampedText1.x}
                                cy={clampedText1.y}
                                r="20"
                                fill="#3b82f6"
                                stroke="hsl(var(--background))"
                                strokeWidth="3"
                              />
                              <text
                                x={clampedText1.x}
                                y={clampedText1.y + 5}
                                textAnchor="middle"
                                className="fill-background font-bold text-sm"
                              >
                                1
                              </text>

                              <circle
                                cx={clampedText2.x}
                                cy={clampedText2.y}
                                r="20"
                                fill="#10b981"
                                stroke="hsl(var(--background))"
                                strokeWidth="3"
                              />
                              <text
                                x={clampedText2.x}
                                y={clampedText2.y + 5}
                                textAnchor="middle"
                                className="fill-background font-bold text-sm"
                              >
                                2
                              </text>

                              <circle
                                cx={clampedText3.x}
                                cy={clampedText3.y}
                                r="20"
                                fill="#f59e0b"
                                stroke="hsl(var(--background))"
                                strokeWidth="3"
                              />
                              <text
                                x={clampedText3.x}
                                y={clampedText3.y + 5}
                                textAnchor="middle"
                                className="fill-background font-bold text-sm"
                              >
                                3
                              </text>
                            </>
                          )
                        })()}
                      </svg>

                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium">Legend:</p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                          <span className="text-xs">Text 1</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
                          <span className="text-xs">Text 2</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
                          <span className="text-xs">Text 3</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
