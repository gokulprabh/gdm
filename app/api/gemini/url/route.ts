import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] URL analysis API called")

    const { url, message } = await request.json()
    console.log("[v0] URL:", url)
    console.log("[v0] Message:", message)

    if (!process.env.GEMINI_API_KEY) {
      console.error("[v0] GEMINI_API_KEY not found")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    console.log("[v0] Initializing GoogleGenAI...")
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `${message || "Please analyze and explain this URL in the context of social media. In the first paragraph describe the contents in 3 sentences or less. In the second paragraph transcribe the first 3 lines of the video."}\n\nURL to analyze: ${url}`

    console.log("[v0] Generating content for URL analysis...")
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an AI assistant designed to analyze and explain URLs and web content in the context of social media.",
      },
    })

    console.log("[v0] Content generated successfully")
    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("[v0] URL analysis error:", error)

    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        {
          error: "API quota exceeded. Please wait a moment and try again.",
          details: "The Google Gemini API has rate limits. Please try again in a few minutes.",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      { error: "Failed to analyze URL", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
