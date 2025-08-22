export interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  thoughts?: string
  sources?: Array<{
    title: string
    url: string
  }>
}

export interface EmbeddingResult {
  values: number[]
}

export interface SimilarityResult {
  text1: string
  text2: string
  similarity: number
}

export interface GroundingChunk {
  web: {
    uri: string
    title: string
  }
}

export interface GroundingSupport {
  segment: {
    startIndex: number
    endIndex: number
    text: string
  }
  groundingChunkIndices: number[]
}
