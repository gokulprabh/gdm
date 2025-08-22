import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function POST(request: NextRequest) {
  try {
    const { texts } = await request.json()

    if (!texts || !Array.isArray(texts) || texts.length !== 3) {
      return NextResponse.json({ error: "Please provide exactly 3 text strings" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: texts,
      taskType: "SEMANTIC_SIMILARITY",
    })

    console.log("[v0] Embeddings response structure:", JSON.stringify(response, null, 2))
    console.log("[v0] Embeddings array:", response.embeddings)

    const embeddings = response.embeddings.map((e: any) => e.values)
    const similarities = []

    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const similarity = cosineSimilarity(embeddings[i], embeddings[j])
        similarities.push({
          text1Index: i,
          text2Index: j,
          text1: texts[i],
          text2: texts[j],
          similarity: similarity,
        })
      }
    }

    return NextResponse.json({
      embeddings: response.embeddings,
      similarities: similarities,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Embeddings API error:", error)
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 })
  }
}
