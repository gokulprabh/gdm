import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not found in environment" }, { status: 500 })
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const enhancedPrompt = `Create engaging social media text content for: ${prompt}. Make it engaging and concise, no more than 3 sentences.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedPrompt,
      config: {
        systemInstruction:
          "You are an AI assistant specialized in creating high-quality social media content. Generate engaging, platform-optimized content and compelling copy that drives engagement.",
      },
    })

    const content = response.text || "No content generated"

    return NextResponse.json({
      response: content,
      content: content, // Added content field for consistency
    })
  } catch (error) {
    console.error("[v0] Create content API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
