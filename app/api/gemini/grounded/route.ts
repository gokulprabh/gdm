import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Grounded search API called")

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.log("[v0] GEMINI_API_KEY not found")
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Configure the client
    const ai = new GoogleGenAI({ apiKey })

    // Define the grounding tool
    const groundingTool = {
      googleSearch: {},
    }

    console.log("[v0] Making grounded search request to Gemini API")

    // Make the request
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        tools: [groundingTool],
        systemInstruction:
          "Provide concise responses in exactly 5 sentences or less. Always include relevant source links when available.",
      },
    })

    console.log("[v0] Grounded search response received")
    console.log("[v0] Full response object keys:", Object.keys(response))
    console.log("[v0] Response text:", response.text)
    console.log("[v0] Response candidates:", response.candidates)
    console.log("[v0] Grounding metadata:", response.groundingMetadata)

    let groundingChunks = []
    let groundingSupports = []

    // Check multiple possible locations for grounding data
    if (response.groundingMetadata) {
      groundingChunks = response.groundingMetadata.groundingChunks || []
      groundingSupports = response.groundingMetadata.groundingSupports || []
    } else if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0]
      console.log("[v0] Candidate keys:", Object.keys(candidate))
      if (candidate.groundingMetadata) {
        groundingChunks = candidate.groundingMetadata.groundingChunks || []
        groundingSupports = candidate.groundingMetadata.groundingSupports || []
      }
    }

    console.log("[v0] Extracted grounding chunks:", groundingChunks)
    console.log("[v0] Extracted grounding supports:", groundingSupports)

    const sources = groundingChunks.map((chunk: any, index: number) => ({
      id: index + 1,
      title: chunk.web?.title || `Source ${index + 1}`,
      url: chunk.web?.uri || "#",
    }))

    return NextResponse.json({
      content: response.text,
      sources: sources,
      groundingMetadata: {
        groundingChunks: groundingChunks,
        groundingSupports: groundingSupports,
      },
    })
  } catch (error) {
    console.error("[v0] Grounded search API error:", error)
    return NextResponse.json({ error: "Failed to generate grounded response" }, { status: 500 })
  }
}
