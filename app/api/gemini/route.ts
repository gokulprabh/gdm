import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not found in environment" }, { status: 500 })
    }

    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    console.log("[v0] Making API call to Gemini with message:", message.substring(0, 100))

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are an AI assistant designed to create social media content. Help users with content creation, scheduling, analytics insights, and social media best practices. Keep all responses to exactly 3 sentences or less.",
      },
    })

    console.log("[v0] Gemini API response received:", response ? "Success" : "No response")

    const content = response.text || "No response generated"

    return NextResponse.json({
      content: content,
      response: content, // Added response field for backward compatibility with create page
    })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })

    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
