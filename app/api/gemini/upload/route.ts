import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")

    if (!process.env.GEMINI_API_KEY) {
      console.error("[v0] GEMINI_API_KEY not found in environment")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    console.log("[v0] Parsing form data...")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const message = formData.get("message") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File details:", { name: file.name, type: file.type, size: file.size })

    if (!file.size || file.size === 0) {
      return NextResponse.json({ error: "Invalid file size" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")

    console.log("[v0] File converted to base64")

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        },
        {
          text: message || "Please analyze and explain this file in the context of social media.",
        },
      ],
    })

    console.log("[v0] File analysis completed")
    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("[v0] Upload processing error:", error)

    return NextResponse.json(
      {
        error: "Failed to process file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
