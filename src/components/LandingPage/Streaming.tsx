"use client"

import React, { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Share2, Star } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

type RosterItem = {
  id: number
  fullName: string
  profileImage: string
}

const sampleRosters: RosterItem[] = [
  { id: 1, fullName: "Alex Johnson", profileImage: "/ysnlogo.webp" },
  { id: 2, fullName: "Mia Thompson", profileImage: "/ysnlogo.webp" },
  { id: 3, fullName: "Jordan Lee", profileImage: "/ysnlogo.webp" },
  { id: 4, fullName: "Sam Taylor", profileImage: "/ysnlogo.webp" },
  { id: 5, fullName: "Riley Parker", profileImage: "/ysnlogo.webp" },
  { id: 6, fullName: "Casey Morgan", profileImage: "/ysnlogo.webp" },
  { id: 7, fullName: "Drew Carter", profileImage: "/ysnlogo.webp" },
]

export default function Streaming() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [joinedStreams, setJoinedStreams] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      const target = document.getElementById(hash)
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [])

  const handleJoinStream = (streamId: number) => {
    setJoinedStreams((prev) =>
      prev.includes(streamId) ? prev.filter((id) => id !== streamId) : [...prev, streamId]
    )
  }

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -240, behavior: "smooth" })
  }

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 240, behavior: "smooth" })
  }

  const handleShare = () => {
    if (!isClient) return
    const url = `${window.location.origin}${window.location.pathname}#streaming_section`
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard")
  }

  return (
    <section className=" bg-black py-12 md:py-16 " id="streaming_section">
      <div className="max-w-8xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">Live Streams</h2>
          </div>
          <Button onClick={handleShare} variant="default" className="rounded-full h-9">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-6">

          {/* Main content */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-6">
            {/* Main Live Stream */}
            <Card className="border-border overflow-hidden">
              <div className="relative bg-black">
                {/* Overlay when not logged in (positioned over the player) */}
                {!isAuthenticated || !user ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-border text-center max-w-md">
                      <p className="text-foreground mb-4">Log in to jump into the streaming experience.</p>
                      <Button className="rounded-full" onClick={() => router.push("/login")}>Log in</Button>
                    </div>
                  </div>
                ) : null}
                <div className={`min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] ${(!isAuthenticated || !user) ? 'blur-sm pointer-events-none' : ''}`}>
                  <iframe
                    src="https://www.youtube.com/embed/JaPwn7HZoIY?rel=0"
                    title="Live stream"
                    className="w-full h-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </Card>

            {/* Other Streams Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Rosters</h3>
                <div className="flex gap-2">
                  <Button onClick={scrollLeft} size="icon" variant="outline" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={scrollRight} size="icon" variant="outline" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={sliderRef}
                  className="flex gap-3 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {sampleRosters.map((kid) => (
                    <div
                      key={kid.id}
                      className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-4 flex flex-col items-center text-center h-[150px] justify-between flex-shrink-0 w-[130px]"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden bg-muted">
                            <Image src={kid.profileImage} alt={kid.fullName} width={48} height={48} className="object-cover" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center mb-2 mt-1">
                        <h4 className="font-medium text-sm truncate w-full pt-1">{kid.fullName}</h4>
                      </div>

                      <Button
                        onClick={() => handleJoinStream(kid.id)}
                        size="sm"
                        className="w-full text-xs h-7 rounded-full font-medium"
                        variant={joinedStreams.includes(kid.id) ? "default" : "outline"}
                      >
                        {joinedStreams.includes(kid.id) ? "Joined" : "Join"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column placeholder for future chat/side content */}
          <div className="hidden lg:block">
            <Card className="border-dashed border-border h-full min-h-[200px] p-4 text-sm text-muted-foreground">
              Side content placeholder
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}


