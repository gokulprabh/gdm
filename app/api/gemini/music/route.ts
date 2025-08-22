import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

interface MusicSession {
  setWeightedPrompts: (config: { weightedPrompts: Array<{ text: string; weight: number }> }) => Promise<void>
  setMusicGenerationConfig: (config: { musicGenerationConfig: { bpm: number; temperature: number } }) => Promise<void>
  play: () => Promise<void>
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, bpm = 90, temperature = 1.0 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API key not configured" }, { status: 500 })
    }

    const client = new GoogleGenAI({
      apiKey,
      apiVersion: "v1alpha",
    })

    const audioChunks: Buffer[] = []
    let generationComplete = false

    const session: MusicSession = client.live.music.connect({
      model: "models/lyria-realtime-exp",
      callbacks: {
        onMessage: (message: any) => {
          // Buffer audio data as it streams in
          if (message.audioData) {
            audioChunks.push(Buffer.from(message.audioData, "base64"))
          }
        },
        onError: (error: any) => {
          console.error("[v0] Music session error:", error)
        },
        onClose: () => {
          console.log("[v0] Lyria RealTime stream closed.")
          generationComplete = true
        },
      },
    })

    // Send initial prompts and config
    await session.setWeightedPrompts({
      weightedPrompts: [{ text: prompt, weight: 1.0 }],
    })

    await session.setMusicGenerationConfig({
      musicGenerationConfig: { bpm, temperature },
    })

    // Start generation
    await session.play()

    // Wait for generation to complete (with timeout)
    const timeout = 30000 // 30 seconds
    const startTime = Date.now()

    while (!generationComplete && Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Combine audio chunks into final audio data
    const finalAudioBuffer = Buffer.concat(audioChunks)
    const audioData = finalAudioBuffer.toString("base64")

    return NextResponse.json({
      success: true,
      audioData,
      description: `Generated music for: "${prompt}" at ${bpm} BPM`,
      bpm,
      temperature,
      message: "Music generated successfully using Lyria RealTime",
    })
  } catch (error) {
    console.error("[v0] Music generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate music" }, { status: 500 })
  }
}
