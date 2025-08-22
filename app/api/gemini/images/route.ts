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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
      },
    })

    // Convert the first generated image to base64 data URL
    const generatedImage = response.generatedImages[0]
    const imgBytes = generatedImage.image.imageBytes
    const base64Image = `data:image/png;base64,${imgBytes}`

    return NextResponse.json({
      success: true,
      imageUrl: base64Image,
      prompt: prompt,
    })
  } catch (error: any) {
    console.error("Error generating image:", error)

    if (error?.error?.message?.includes("billed users")) {
      return NextResponse.json(
        {
          error:
            "Image generation requires a paid Google AI account. The Imagen API is only available to billed users.",
        },
        { status: 402 },
      )
    }

    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
