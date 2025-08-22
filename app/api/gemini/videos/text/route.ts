import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    let operation = await ai.models.generateVideos({
      model: "veo-3.0-generate-preview",
      prompt: prompt,
    })

    while (!operation.done) {
      console.log("[v0] Waiting for video generation to complete...")
      await new Promise((resolve) => setTimeout(resolve, 10000))
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      })
    }

    const videoData = operation.response.generatedVideos[0].video

    return NextResponse.json({
      success: true,
      videoData: videoData,
      message: "Video generated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Video generation error:", error)

    if (error.message?.includes("billed users")) {
      return NextResponse.json(
        {
          error:
            "Video generation requires a paid Google AI account. Please upgrade your account to access this feature.",
        },
        { status: 402 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate video",
      },
      { status: 500 },
    )
  }
}
