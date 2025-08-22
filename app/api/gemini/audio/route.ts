import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const prompt = (formData.get("prompt") as string) || "Please transcribe and summarize this audio."

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio file to base64
    const bytes = await audioFile.arrayBuffer()
    const base64AudioFile = Buffer.from(bytes).toString("base64")

    const ai = new GoogleGenAI({ apiKey })

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: audioFile.type || "audio/mp3",
          data: base64AudioFile,
        },
      },
    ]

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    })

    return NextResponse.json({
      transcript: response.text,
      success: true,
    })
  } catch (error) {
    console.error("Audio processing error:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
