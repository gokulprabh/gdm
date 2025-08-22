"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Type, ImageIcon, Video, Play } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CreatePostPage() {
  const [prompt, setPrompt] = useState("")

  const [textContent, setTextContent] = useState("")
  const [imageContent, setImageContent] = useState("")
  const [videoContent, setVideoContent] = useState("")

  const [generatedImageUrl, setGeneratedImageUrl] = useState("")
  const [generatedVideoData, setGeneratedVideoData] = useState<any>(null)

  const [isGeneratingText, setIsGeneratingText] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [isGeneratingVideoFromText, setIsGeneratingVideoFromText] = useState(false)
  const [isGeneratingVideoFromImage, setIsGeneratingVideoFromImage] = useState(false)

  const handleGenerateText = async () => {
    if (!prompt.trim()) return

    setIsGeneratingText(true)
    try {
      const response = await fetch("/api/gemini/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setTextContent(data.response)
    } catch (error) {
      console.error("Error generating content:", error)
      setTextContent("Sorry, there was an error generating content. Please try again.")
    } finally {
      setIsGeneratingText(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsGeneratingImage(true)
    setGeneratedImageUrl("")
    setImageContent("")

    try {
      const response = await fetch("/api/gemini/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a social media image about: ${prompt}. Make it visually appealing, engaging, and suitable for social media platforms.`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImageUrl(data.imageUrl)
      setImageContent(`Generated image for: ${prompt}`)
    } catch (error) {
      console.error("Error generating image:", error)
      setImageContent("Sorry, there was an error generating the image. Please try again.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleGenerateVideoFromText = async () => {
    if (!prompt.trim()) return

    setIsGeneratingVideoFromText(true)
    setGeneratedVideoData(null)
    setVideoContent("")

    try {
      const response = await fetch("/api/gemini/videos/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a social media video about: ${prompt}. Make it engaging, visually appealing, and suitable for social media platforms.`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate video")
      }

      const data = await response.json()
      setGeneratedVideoData(data.videoData)
      setVideoContent(`Generated video from text: ${prompt}`)
    } catch (error: any) {
      console.error("Error generating video:", error)
      setVideoContent(error.message || "Sorry, there was an error generating the video. Please try again.")
    } finally {
      setIsGeneratingVideoFromText(false)
    }
  }

  const handleGenerateVideoFromImage = async () => {
    if (!prompt.trim()) return

    setIsGeneratingVideoFromImage(true)
    setGeneratedVideoData(null)
    setVideoContent("")

    try {
      const response = await fetch("/api/gemini/videos/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a social media video about: ${prompt}. Make it engaging, visually appealing, and suitable for social media platforms.`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate video")
      }

      const data = await response.json()
      setGeneratedVideoData(data.videoData)
      setVideoContent(`Generated video from image: ${prompt}`)
    } catch (error: any) {
      console.error("Error generating video:", error)
      setVideoContent(error.message || "Sorry, there was an error generating the video. Please try again.")
    } finally {
      setIsGeneratingVideoFromImage(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create Content</h1>
            <p className="text-muted-foreground">
              Generate engaging social media content with AI - text posts, images, or videos
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Create anything... (e.g., 'Write about our new product launch', 'Design a fitness motivation post', 'Create a video about product demo')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] text-base"
                />

                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={handleGenerateText}
                    disabled={!prompt.trim() || isGeneratingText}
                    variant="outline"
                    className="flex-1 min-w-[140px] bg-transparent"
                  >
                    {isGeneratingText ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Type className="mr-2 h-4 w-4" />
                        Generate Text
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={!prompt.trim() || isGeneratingImage}
                    variant="outline"
                    className="flex-1 min-w-[140px] bg-transparent"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateVideoFromText}
                    disabled={!prompt.trim() || isGeneratingVideoFromText}
                    variant="outline"
                    className="flex-1 min-w-[160px] bg-transparent"
                  >
                    {isGeneratingVideoFromText ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Video from Text
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateVideoFromImage}
                    disabled={!prompt.trim() || isGeneratingVideoFromImage}
                    variant="outline"
                    className="flex-1 min-w-[160px] bg-transparent"
                  >
                    {isGeneratingVideoFromImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Video from Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {textContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Text Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="whitespace-pre-wrap">{textContent}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(imageContent || generatedImageUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Generated Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedImageUrl && (
                      <div className="bg-muted p-3 rounded-lg">
                        <img
                          src={generatedImageUrl || "/placeholder.svg"}
                          alt="Generated social media image"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                    {imageContent && (
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p className="whitespace-pre-wrap">{imageContent}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {(videoContent || generatedVideoData) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Generated Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedVideoData && (
                      <div className="bg-muted p-3 rounded-lg text-xs">
                        <div className="font-mono">
                          <div>Video Data Structure:</div>
                          <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(generatedVideoData, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {(generatedVideoData?.uri || generatedVideoData?.downloadPath || generatedVideoData?.url) && (
                      <div className="bg-muted p-3 rounded-lg">
                        <video
                          controls
                          className="w-full h-auto rounded-md"
                          preload="metadata"
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement
                            const error = target.error
                            console.error("[v0] Video playback error details:", {
                              code: error?.code,
                              message: error?.message,
                              videoData: generatedVideoData,
                              networkState: target.networkState,
                              readyState: target.readyState,
                            })
                          }}
                          onLoadStart={() => console.log("[v0] Video load started")}
                          onLoadedMetadata={() => console.log("[v0] Video metadata loaded")}
                          onCanPlay={() => console.log("[v0] Video can play")}
                        >
                          <source
                            src={`/api/gemini/videos/proxy?videoUrl=${encodeURIComponent(
                              generatedVideoData.uri || generatedVideoData.downloadPath || generatedVideoData.url,
                            )}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Video URI:{" "}
                          {generatedVideoData.uri || generatedVideoData.downloadPath || generatedVideoData.url}
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `/api/gemini/videos/proxy?videoUrl=${encodeURIComponent(
                                  generatedVideoData.uri || generatedVideoData.downloadPath || generatedVideoData.url,
                                )}`,
                                "_blank",
                              )
                            }
                          >
                            Download Video
                          </Button>
                        </div>
                      </div>
                    )}

                    {generatedVideoData &&
                      !generatedVideoData.uri &&
                      !generatedVideoData.downloadPath &&
                      !generatedVideoData.url && (
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="text-center text-sm text-muted-foreground">
                            Video generated successfully!
                            <br />
                            <span className="text-xs">
                              Video data: {JSON.stringify(generatedVideoData).substring(0, 100)}...
                            </span>
                          </div>
                        </div>
                      )}
                    {videoContent && (
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <p className="whitespace-pre-wrap">{videoContent}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
