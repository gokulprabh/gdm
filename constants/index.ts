export const APP_NAME = "Deepmind Explorations"

export const API_ENDPOINTS = {
  GEMINI_CHAT: "/api/gemini/chat",
  GEMINI_CREATE: "/api/gemini/create",
  GEMINI_GROUNDED: "/api/gemini/grounded",
  GEMINI_EMBEDDINGS: "/api/gemini/embeddings",
  GEMINI_IMAGES: "/api/gemini/images",
  GEMINI_MUSIC: "/api/gemini/music",
} as const

export const MODELS = {
  GEMINI_FLASH: "gemini-2.5-flash",
  GEMINI_PRO: "gemini-2.5-pro",
  GEMINI_EMBEDDING: "gemini-embedding-001",
} as const

export const MAX_EMBEDDING_DIMENSIONS = 512
export const MAX_RESPONSE_SENTENCES = 5
