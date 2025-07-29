"use client"

import React, { createContext, useContext, useState } from "react"

export type CoachTab = "players" | "profile" | "search"

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

// Dummy players data with more players
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
  },
  {
    id: "4",
    fullName: "Alex Thompson",
    dob: "2005-09-14",
    grade: "12th",
    act: 29,
    sat: 1380,
    gpa: 3.9,
    position: "QB",
    state: "Texas",
    rating: 88,
    notes: ["Strong arm", "Good decision making"],
    labels: ["Pro Style", "Intelligent"]
  },
  {
    id: "5",
    fullName: "Marcus Rodriguez",
    dob: "2006-12-03",
    grade: "11th",
    act: 26,
    sat: 1250,
    gpa: 3.5,
    position: "RB",
    state: "California",
    rating: 82,
    notes: ["Explosive runner", "Good pass protection"],
    labels: ["Power Back", "Versatile"]
  },
  {
    id: "6",
    fullName: "Jordan Williams",
    dob: "2005-05-20",
    grade: "12th",
    act: 31,
    sat: 1420,
    gpa: 4.0,
    position: "WR",
    state: "Florida",
    rating: 91,
    notes: ["Elite speed", "Great route running"],
    labels: ["Deep Threat", "Academic"]
  },
  {
    id: "7",
    fullName: "Chris Davis",
    dob: "2006-01-10",
    grade: "11th",
    act: 27,
    sat: 1320,
    gpa: 3.7,
    position: "TE",
    state: "Ohio",
    rating: 84,
    notes: ["Great blocking", "Reliable hands"],
    labels: ["Complete TE", "Physical"]
  },
  {
    id: "8",
    fullName: "Ryan Martinez",
    dob: "2005-08-25",
    grade: "12th",
    act: 24,
    sat: 1180,
    gpa: 3.1,
    position: "OL",
    state: "Pennsylvania",
    rating: 76,
    notes: ["Strong pass protection", "Needs work on run blocking"],
    labels: ["Pass Protector", "Developing"]
  },
  {
    id: "9",
    fullName: "Tyler Brown",
    dob: "2006-04-12",
    grade: "11th",
    act: 28,
    sat: 1360,
    gpa: 3.8,
    position: "DL",
    state: "Michigan",
    rating: 86,
    notes: ["Explosive off the line", "Good technique"],
    labels: ["Pass Rusher", "High Motor"]
  },
  {
    id: "10",
    fullName: "Kevin Lee",
    dob: "2005-10-30",
    grade: "12th",
    act: 25,
    sat: 1220,
    gpa: 3.3,
    position: "LB",
    state: "Georgia",
    rating: 79,
    notes: ["Good instincts", "Needs to improve coverage"],
    labels: ["Run Stopper", "Physical"]
  },
  {
    id: "11",
    fullName: "Brandon Taylor",
    dob: "2006-06-18",
    grade: "11th",
    act: 29,
    sat: 1390,
    gpa: 3.9,
    position: "DB",
    state: "Alabama",
    rating: 87,
    notes: ["Excellent coverage skills", "Good ball skills"],
    labels: ["Cover Corner", "Playmaker"]
  },
  {
    id: "12",
    fullName: "Jake Anderson",
    dob: "2005-12-05",
    grade: "12th",
    act: 26,
    sat: 1240,
    gpa: 3.4,
    position: "K",
    state: "Oregon",
    rating: 81,
    notes: ["Strong leg", "Consistent accuracy"],
    labels: ["Field Goal Specialist", "Reliable"]
  },
  {
    id: "13",
    fullName: "Derek White",
    dob: "2006-02-28",
    grade: "11th",
    act: 30,
    sat: 1410,
    gpa: 4.0,
    position: "QB",
    state: "Washington",
    rating: 89,
    notes: ["Dual threat", "Great leadership"],
    labels: ["Dual Threat", "Leader"]
  },
  {
    id: "14",
    fullName: "Sam Wilson",
    dob: "2005-07-15",
    grade: "12th",
    act: 27,
    sat: 1330,
    gpa: 3.6,
    position: "WR",
    state: "Colorado",
    rating: 83,
    notes: ["Good hands", "Needs to improve route running"],
    labels: ["Possession WR", "Reliable"]
  },
  {
    id: "15",
    fullName: "Nick Garcia",
    dob: "2006-11-08",
    grade: "11th",
    act: 28,
    sat: 1370,
    gpa: 3.8,
    position: "RB",
    state: "Arizona",
    rating: 85,
    notes: ["Elusive runner", "Good vision"],
    labels: ["Scat Back", "Elusive"]
  },
  {
    id: "16",
    fullName: "Ethan Carter",
    dob: "2005-04-17",
    grade: "12th",
    act: 32,
    sat: 1450,
    gpa: 4.0,
    position: "QB",
    state: "North Carolina",
    rating: 94,
    notes: ["Elite arm strength", "Excellent decision making"],
    labels: ["Elite", "Pro Ready"]
  },
  {
    id: "17",
    fullName: "Lucas Rodriguez",
    dob: "2006-08-22",
    grade: "11th",
    act: 27,
    sat: 1340,
    gpa: 3.7,
    position: "WR",
    state: "New Jersey",
    rating: 86,
    notes: ["Great route running", "Needs to improve blocking"],
    labels: ["Route Runner", "Technical"]
  },
  {
    id: "18",
    fullName: "Owen Thompson",
    dob: "2005-12-30",
    grade: "12th",
    act: 23,
    sat: 1160,
    gpa: 3.0,
    position: "RB",
    state: "Missouri",
    rating: 77,
    notes: ["Power runner", "Good short yardage"],
    labels: ["Power Back", "Short Yardage"]
  },
  {
    id: "19",
    fullName: "Aiden Cooper",
    dob: "2006-01-14",
    grade: "11th",
    act: 29,
    sat: 1380,
    gpa: 3.9,
    position: "TE",
    state: "Wisconsin",
    rating: 88,
    notes: ["Excellent blocking", "Good hands"],
    labels: ["Complete TE", "Blocking Specialist"]
  },
  {
    id: "20",
    fullName: "Caleb Mitchell",
    dob: "2005-06-09",
    grade: "12th",
    act: 26,
    sat: 1260,
    gpa: 3.4,
    position: "OL",
    state: "Indiana",
    rating: 78,
    notes: ["Strong run blocker", "Needs work on pass protection"],
    labels: ["Run Blocker", "Physical"]
  },
  {
    id: "21",
    fullName: "Isaac Turner",
    dob: "2006-03-25",
    grade: "11th",
    act: 28,
    sat: 1350,
    gpa: 3.8,
    position: "DL",
    state: "Tennessee",
    rating: 84,
    notes: ["Good technique", "High motor"],
    labels: ["Technician", "High Motor"]
  },
  {
    id: "22",
    fullName: "Mason Phillips",
    dob: "2005-09-18",
    grade: "12th",
    act: 24,
    sat: 1190,
    gpa: 3.2,
    position: "LB",
    state: "Kentucky",
    rating: 76,
    notes: ["Good instincts", "Needs to improve speed"],
    labels: ["Instinctive", "Developing"]
  },
  {
    id: "23",
    fullName: "Noah Richardson",
    dob: "2006-05-12",
    grade: "11th",
    act: 30,
    sat: 1400,
    gpa: 4.0,
    position: "DB",
    state: "South Carolina",
    rating: 90,
    notes: ["Elite speed", "Great ball skills"],
    labels: ["Elite", "Ball Hawk"]
  },
  {
    id: "24",
    fullName: "William Foster",
    dob: "2005-11-03",
    grade: "12th",
    act: 25,
    sat: 1230,
    gpa: 3.3,
    position: "K",
    state: "Virginia",
    rating: 79,
    notes: ["Strong leg", "Inconsistent accuracy"],
    labels: ["Strong Leg", "Developing"]
  },
  {
    id: "25",
    fullName: "James Collins",
    dob: "2006-07-28",
    grade: "11th",
    act: 31,
    sat: 1430,
    gpa: 4.0,
    position: "QB",
    state: "Maryland",
    rating: 93,
    notes: ["Elite accuracy", "Great leadership"],
    labels: ["Elite", "Leader"]
  },
  {
    id: "26",
    fullName: "Benjamin Hayes",
    dob: "2005-02-11",
    grade: "12th",
    act: 26,
    sat: 1270,
    gpa: 3.5,
    position: "WR",
    state: "Delaware",
    rating: 82,
    notes: ["Good hands", "Needs to improve speed"],
    labels: ["Possession WR", "Reliable"]
  },
  {
    id: "27",
    fullName: "Henry Ward",
    dob: "2006-10-05",
    grade: "11th",
    act: 27,
    sat: 1310,
    gpa: 3.6,
    position: "RB",
    state: "Connecticut",
    rating: 80,
    notes: ["Versatile runner", "Good pass catching"],
    labels: ["Versatile", "Pass Catcher"]
  },
  {
    id: "28",
    fullName: "Sebastian Moore",
    dob: "2005-08-16",
    grade: "12th",
    act: 28,
    sat: 1360,
    gpa: 3.8,
    position: "TE",
    state: "New Hampshire",
    rating: 85,
    notes: ["Good blocking", "Reliable hands"],
    labels: ["Complete TE", "Reliable"]
  },
  {
    id: "29",
    fullName: "Jackson Reed",
    dob: "2006-04-23",
    grade: "11th",
    act: 29,
    sat: 1390,
    gpa: 3.9,
    position: "OL",
    state: "Vermont",
    rating: 83,
    notes: ["Good technique", "Needs to improve strength"],
    labels: ["Technician", "Developing"]
  },
  {
    id: "30",
    fullName: "Daniel Brooks",
    dob: "2005-12-07",
    grade: "12th",
    act: 25,
    sat: 1210,
    gpa: 3.1,
    position: "DL",
    state: "Maine",
    rating: 75,
    notes: ["Good motor", "Needs to improve technique"],
    labels: ["High Motor", "Developing"]
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