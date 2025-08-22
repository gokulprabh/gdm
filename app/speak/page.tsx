"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, Play, Square, Upload, Music, Pause } from "lucide-react"
import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SpeakPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const [musicPrompt, setMusicPrompt] = useState("")
  const [bpm, setBpm] = useState(90)
  const [temperature, setTemperature] = useState(1.0)
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const chunks: BlobPart[] = []

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/mp3" })
          setAudioBlob(blob)
          setAudioUrl(URL.createObjectURL(blob))

          // Stop all tracks to release microphone
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert("Error accessing microphone. Please check permissions.")
      }
    }
  }

  const togglePlayback = () => {
    if (!audioUrl) return

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const processAudio = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.mp3")
      formData.append(
        "prompt",
        "Please transcribe this audio and provide a clean transcript suitable for social media content.",
      )

      const response = await fetch("/api/gemini/audio", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setTranscript(data.transcript)
      } else {
        console.error("Processing error:", data.error)
        alert("Failed to process audio: " + data.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload audio")
    } finally {
      setIsProcessing(false)
    }
  }

  const generateMusic = async () => {
    if (!musicPrompt.trim()) {
      alert("Please enter a music prompt")
      return
    }

    setIsGeneratingMusic(true)
    try {
      const response = await fetch("/api/gemini/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: musicPrompt,
          bpm,
          temperature,
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("[v0] Music generation completed:", data.chunks, "chunks received")

        const audioData = atob(data.audioData)
        const audioArray = new Uint8Array(audioData.length)
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i)
        }

        const audioBlob = new Blob([audioArray], { type: "audio/mp3" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setGeneratedMusicUrl(audioUrl)

        alert(`Music generated successfully! ${data.chunks} audio chunks received. Click play to listen.`)
      } else {
        console.error("[v0] Music generation error:", data.error)
        alert("Failed to generate music: " + data.error)
      }
    } catch (error) {
      console.error("[v0] Music generation request error:", error)
      alert("Failed to generate music")
    } finally {
      setIsGeneratingMusic(false)
    }
  }

  const toggleMusicPlayback = () => {
    if (!generatedMusicUrl) return

    if (isMusicPlaying) {
      musicAudioRef.current?.pause()
      setIsMusicPlaying(false)
    } else {
      if (!musicAudioRef.current) {
        musicAudioRef.current = new Audio(generatedMusicUrl)
        musicAudioRef.current.onended = () => setIsMusicPlaying(false)
      }
      musicAudioRef.current.play()
      setIsMusicPlaying(true)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Voice to Text & Music Generation</h1>
            <p className="text-muted-foreground">
              Convert speech to text and generate music for your social media content
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Voice Recording</CardTitle>
                <CardDescription>Click the microphone to start recording your voice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                    className="h-20 w-20 rounded-full"
                  >
                    {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Playback</CardTitle>
                <CardDescription>Play back your recorded audio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={togglePlayback}
                    disabled={!audioUrl}
                    className="h-20 w-20 rounded-full bg-transparent"
                  >
                    {isPlaying ? <Square className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {!audioUrl
                      ? "No recording available"
                      : isPlaying
                        ? "Playing... Click to stop"
                        : "Click to play recording"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {audioBlob && (
            <Card>
              <CardHeader>
                <CardTitle>Process Audio</CardTitle>
                <CardDescription>Convert your recording to text using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={processAudio} disabled={isProcessing} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Convert to Text"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
              <CardDescription>Your speech will be converted to text here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Your transcribed text will appear here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Music Generation</CardTitle>
              <CardDescription>Generate custom music using AI based on your prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="music-prompt">Music Prompt</Label>
                <Input
                  id="music-prompt"
                  placeholder="e.g., minimal techno, upbeat jazz, ambient soundscape..."
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bpm">BPM (Beats Per Minute)</Label>
                  <Input
                    id="bpm"
                    type="number"
                    min="60"
                    max="200"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Creativity (0.1 - 2.0)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateMusic} disabled={isGeneratingMusic || !musicPrompt.trim()} className="flex-1">
                  <Music className="h-4 w-4 mr-2" />
                  {isGeneratingMusic ? "Generating..." : "Generate Music"}
                </Button>

                <Button
                  variant="outline"
                  onClick={toggleMusicPlayback}
                  disabled={!generatedMusicUrl}
                  className="px-4 bg-transparent"
                >
                  {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Generate custom music using Google's Lyria real-time model. Audio will be playable once generation
                completes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
