import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Request URL:", request.url)

    const url = new URL(request.url)
    const searchParams = url.searchParams

    const videoUrl = searchParams.get("videoUrl")
    console.log("[v0] Extracted videoUrl:", videoUrl)

    // Check if the videoUrl parameter was provided
    if (!videoUrl) {
      return NextResponse.json({ error: "Missing 'videoUrl' query parameter" }, { status: 400 })
    }

    console.log("[v0] Proxying video from:", videoUrl)

    const videoResponse = await fetch(videoUrl)

    if (!videoResponse.ok) {
      console.error("[v0] Video fetch failed:", videoResponse.status, videoResponse.statusText)
      return NextResponse.json({ error: "Failed to fetch video" }, { status: videoResponse.status })
    }

    // Proxy the video content back to the client
    return new Response(videoResponse.body, {
      headers: {
        "Content-Type": videoResponse.headers.get("Content-Type") || "video/mp4",
        "Content-Length": videoResponse.headers.get("Content-Length") || "",
      },
    })
  } catch (error) {
    console.error("[v0] Video proxy error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
