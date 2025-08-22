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

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: message,
      config: {
        systemInstruction: "You are a helpful AI assistant. Keep all responses to exactly 3 sentences or less.",
        thinkingConfig: {
          includeThoughts: true,
        },
      },
    })

    let thoughts = ""
    let content = ""

    for await (const chunk of response) {
      for (const part of chunk.candidates[0].content.parts) {
        if (!part.text) {
          continue
        } else if (part.thought) {
          thoughts = thoughts + part.text
        } else {
          content = content + part.text
        }
      }
    }

    return NextResponse.json({
      content: content || "No response generated",
      thoughts: thoughts || null,
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
