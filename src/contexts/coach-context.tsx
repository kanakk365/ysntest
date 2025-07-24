"use client"

import React, { createContext, useContext, useState } from "react"

export type CoachTab = "players" | "calendar" | "profile" | "search"

interface Player {
  id: string
  fullName: string
  dob: string
  grade: string
  act: number
  sat: number
  gpa: number
  position: string
  state: string
  rating: number
  notes: string[]
  labels: string[]
}

interface CoachContextType {
  activeTab: CoachTab
  setActiveTab: (tab: CoachTab) => void
  players: Player[]
  addPlayer: (player: Player) => void
  updatePlayerRating: (playerId: string, rating: number) => void
  addPlayerNote: (playerId: string, note: string) => void
  addPlayerLabel: (playerId: string, label: string) => void
}

const CoachContext = createContext<CoachContextType | undefined>(undefined)

// Dummy players data
const dummyPlayers: Player[] = [
  {
    id: "1",
    fullName: "John Smith",
    dob: "2006-03-15",
    grade: "11th",
    act: 28,
    sat: 1350,
    gpa: 3.8,
    position: "QB",
    state: "Texas",
    rating: 85,
    notes: ["Great leadership skills", "Needs work on accuracy"],
    labels: ["High Potential", "Leader"]
  },
  {
    id: "2",
    fullName: "Mike Johnson",
    dob: "2005-11-22",
    grade: "12th",
    act: 25,
    sat: 1200,
    gpa: 3.2,
    position: "RB",
    state: "California",
    rating: 78,
    notes: ["Fast runner", "Good vision"],
    labels: ["Speed", "Athletic"]
  },
  {
    id: "3",
    fullName: "David Wilson",
    dob: "2006-07-08",
    grade: "11th",
    act: 30,
    sat: 1400,
    gpa: 4.0,
    position: "WR",
    state: "Florida",
    rating: 92,
    notes: ["Excellent hands", "Great route running"],
    labels: ["Elite", "Academic"]
  }
]

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<CoachTab>("players")
  const [players, setPlayers] = useState<Player[]>(dummyPlayers)

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player])
  }

  const updatePlayerRating = (playerId: string, rating: number) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId ? { ...player, rating } : player
      )
    )
  }

  const addPlayerNote = (playerId: string, note: string) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, notes: [...player.notes, note] }
          : player
      )
    )
  }

  const addPlayerLabel = (playerId: string, label: string) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, labels: [...player.labels, label] }
          : player
      )
    )
  }

  return (
    <CoachContext.Provider value={{
      activeTab,
      setActiveTab,
      players,
      addPlayer,
      updatePlayerRating,
      addPlayerNote,
      addPlayerLabel
    }}>
      {children}
    </CoachContext.Provider>
  )
}

export function useCoach() {
  const context = useContext(CoachContext)
  if (context === undefined) {
    throw new Error("useCoach must be used within a CoachProvider")
  }
  return context
} 