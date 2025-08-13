"use client"

import React, { FormEvent, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import Image from "next/image"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatContent (){
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  const placeholderMessages = useMemo(
    () => [
      { handle: "@manny_stream", text: "Welcome to the stream!" },
      { handle: "@john", text: "Let’s go team!" },
      { handle: "@coach", text: "Great play coming up." },
      { handle: "@fan", text: "Hype!" },
    ],
    []
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="space-y-4">
            {placeholderMessages.map((m, idx) => (
              <div className="flex gap-3" key={idx}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex-shrink-0 overflow-hidden">
                  <Image src="/ysnlogo.webp" alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{m.handle}</span>
                    <span className="text-gray-400 text-xs">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0 overflow-hidden">
              <Image src="/ysnlogo.webp" alt="user" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-medium">{message.role === "user" ? "@you" : "@chatbot"}</span>
                <span className="text-gray-400 text-xs">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type Message"
          className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 rounded-xl h-12"
        />
        <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 px-4 h-12 rounded-xl">
          <Send size={18} />
        </Button>
      </form>
    </div>
  )
}