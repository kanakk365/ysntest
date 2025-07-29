"use client"

import { useState } from "react"
import { useCoach } from "@/contexts/coach-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"

// Mock data - replace with your actual data
const grades = ["9th", "10th", "11th", "12th"]
const positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"]
const gradYears = ["2024", "2025", "2026", "2027", "2028"]
const states = ["CA", "TX", "FL", "NY", "PA", "OH", "IL", "MI", "GA", "NC"]

const mockPlayers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  fullName: `Player ${i + 1}`,
  grade: grades[Math.floor(Math.random() * grades.length)],
  position: positions[Math.floor(Math.random() * positions.length)],
  state: states[Math.floor(Math.random() * states.length)],
  gradYear: gradYears[Math.floor(Math.random() * gradYears.length)],
  act: Math.floor(Math.random() * 15) + 20,
  sat: Math.floor(Math.random() * 600) + 1000,
  gpa: (Math.random() * 2 + 2).toFixed(2),
  rating: (Math.random() * 2 + 3).toFixed(1),
  profilePic: Math.random() > 0.5 ? `/placeholder.svg?height=200&width=200&text=Player${i + 1}` : null,
}))

export function CoachSearchTab() {
  const { setActiveTab } = useCoach()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [selectedGradYear, setSelectedGradYear] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [searchResults, setSearchResults] = useState(mockPlayers)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 12

  const handleSearch = () => {
    // Mock search logic
    setSearchResults(mockPlayers.filter((player) => player.fullName.toLowerCase().includes(searchTerm.toLowerCase())))
    setCurrentPage(1)
  }

  const handleFollow = (playerId: number) => {
    console.log(`Following player ${playerId}`)
  }

  const handlePlayerClick = (playerId: number) => {
    console.log(`Viewing player ${playerId}`)
  }

  const handleBackToPlayers = () => {
    setActiveTab("players")
  }

  // Pagination logic
  const totalPages = Math.ceil(searchResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentResults = searchResults.slice(startIndex, endIndex)

  const goToPage = (page: number) => setCurrentPage(page)
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToPlayers}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Players
            </Button>
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Search Players</h1>
              <p className="text-lg text-muted-foreground mt-1">Discover and connect with talented athletes</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search Filters */}
        <Card className="mb-8 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-card-foreground flex items-center gap-3 text-xl font-semibold">
              <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Primary Search Bar */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Player Name
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by player name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <Filter className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm font-semibold text-foreground">Advanced Filters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Grade Level
                  </label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Position
                  </label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Graduation Year
                  </label>
                  <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {gradYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    State
                  </label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleSearch}
                className="flex-1 sm:flex-none sm:min-w-[160px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Players
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedGrade("all")
                  setSelectedPosition("all")
                  setSelectedGradYear("all")
                  setSelectedState("all")
                }}
                className="flex-1 sm:flex-none sm:min-w-[120px] h-12 border-border/50 hover:bg-accent/10 font-medium"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Results Section */}
        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-xl font-semibold">Search Results</CardTitle>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {searchResults.length} players found
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentResults.map((player) => (
                <div key={player.id} className="group">
                  <Card className=" p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm">
                    <div className="relative">
                      {/* Player Image */}
                      <div
                        className="relative w-full h-52 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() => handlePlayerClick(player.id)}
                      >
                        {player.profilePic ? (
                          <Image
                            src={player.profilePic || "/placeholder.svg"}
                            alt={player.fullName}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="p-4 rounded-full bg-primary/10 mb-3">
                              <User className="h-12 w-12 text-primary" />
                            </div>
                            <span className="text-sm font-medium">No Photo</span>
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-foreground">{player.rating}</span>
                        </div>

                        {/* Hover Overlay */}
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
                          <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-bold text-lg mb-2">{player.fullName}</h3>
                            <Badge variant="secondary" className="mb-3 bg-primary/20 text-white border-white/20">
                              {player.position}
                            </Badge>
                            <div className="text-sm space-y-1 opacity-90">
                              <p className="font-medium">
                                {player.grade} • {player.state}
                              </p>
                              <div className="flex justify-center gap-4 text-xs">
                                <span>ACT: {player.act}</span>
                                <span>SAT: {player.sat}</span>
                              </div>
                              <p className="text-xs">
                                GPA: {player.gpa} • Class of {player.gradYear}
                              </p>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      {/* Player Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-base truncate mb-1">{player.fullName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {player.grade} • {player.state}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary">
                            {player.position}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                          <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-foreground">ACT</div>
                            <div className="text-muted-foreground">{player.act}</div>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-foreground">SAT</div>
                            <div className="text-muted-foreground">{player.sat}</div>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-foreground">GPA</div>
                            <div className="text-muted-foreground">{player.gpa}</div>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <div className="font-semibold text-foreground">Year</div>
                            <div className="text-muted-foreground">{player.gradYear}</div>
                          </div>
                        </div>

                        <Button
                       
                          size="sm"
                          className="w-full h-9 border-2 bg-transparent border-primary hover:bg-primary/20  font-medium transition-all shadow-sm text-primary"
                          onClick={() => handleFollow(player.id)}
                        >
                          Follow Player
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30">
              <div className="text-sm text-muted-foreground font-medium">
                Showing <span className="text-foreground font-semibold">{startIndex + 1}</span> to{" "}
                <span className="text-foreground font-semibold">{Math.min(endIndex, searchResults.length)}</span> of{" "}
                <span className="text-foreground font-semibold">{searchResults.length}</span> players
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0 border-border/50 bg-transparent"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-9 w-9 p-0 border-border/50 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={`h-9 w-9 p-0 font-medium ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "border-border/50 hover:bg-accent/10"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0 border-border/50 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 p-0 border-border/50 bg-transparent"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 