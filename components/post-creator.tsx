"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Instagram, Linkedin, ImageIcon, Calendar, Save, Send } from "lucide-react"
import { AIContentGenerator } from "./ai-content-generator"
import { AIContentOptimizer } from "./ai-content-optimizer"

interface Platform {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  maxChars: number
}

const platforms: Platform[] = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600", maxChars: 63206 },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500", maxChars: 280 },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600", maxChars: 2200 },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", maxChars: 3000 },
]

export function PostCreator() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"])
  const [postContent, setPostContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 280
    return Math.min(...selectedPlatforms.map((id) => platforms.find((p) => p.id === id)?.maxChars || 280))
  }

  const characterLimit = getCharacterLimit()
  const remainingChars = characterLimit - postContent.length

  const handleAIContentGenerated = (content: string) => {
    setPostContent(content)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Post Creation Form */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Craft Engaging Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <Button
                      key={platform.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`
                        gap-2 transition-all duration-200
                        ${isSelected ? `${platform.color} text-white hover:opacity-90` : "hover:bg-muted"}
                      `}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {platform.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="post-content" className="text-sm font-medium">
                  Post Content
                </Label>
                <Badge
                  variant={remainingChars < 0 ? "destructive" : remainingChars < 20 ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {remainingChars} characters remaining
                </Badge>
              </div>
              <Textarea
                id="post-content"
                placeholder="What's on your mind? Share something engaging with your audience..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Add Media</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setSelectedImage(url)
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("image-upload")?.click()}>
                  Choose File
                </Button>
              </div>
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Post Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="optimize">Optimize</TabsTrigger>
              </TabsList>
              <TabsContent value="generate" className="mt-4">
                <AIContentGenerator
                  onContentGenerated={handleAIContentGenerated}
                  selectedPlatforms={selectedPlatforms}
                />
              </TabsContent>
              <TabsContent value="optimize" className="mt-4">
                <AIContentOptimizer content={postContent} platform={selectedPlatforms[0] || "LinkedIn"} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Post Preview */}
      <div className="xl:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlatforms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Select a platform to see preview</div>
            ) : (
              selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId)
                if (!platform) return null

                const Icon = platform.icon
                return (
                  <div key={platformId} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded ${platform.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </div>

                    {selectedImage && (
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Post preview"
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="whitespace-pre-wrap">{postContent || "Your post content will appear here..."}</div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
