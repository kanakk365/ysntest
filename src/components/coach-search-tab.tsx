"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Search, Filter, Star, MapPin, GraduationCap, Calculator, BookOpen } from "lucide-react"

interface SearchPlayer {
  id: string
  fullName: string
  grade: string
  act: number
  sat: number
  gpa: number
  position: string
  state: string
  rating: number
  gradYear: string
}

export function CoachSearchTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [selectedGradYear, setSelectedGradYear] = useState("all")
  const [selectedState, setSelectedState] = useState("all")

  // Dummy search results
  const [searchResults, setSearchResults] = useState<SearchPlayer[]>([
    {
      id: "1",
      fullName: "Alex Thompson",
      grade: "12th",
      act: 29,
      sat: 1380,
      gpa: 3.9,
      position: "QB",
      state: "Texas",
      rating: 88,
      gradYear: "2024"
    },
    {
      id: "2",
      fullName: "Marcus Rodriguez",
      grade: "11th",
      act: 26,
      sat: 1250,
      gpa: 3.5,
      position: "RB",
      state: "California",
      rating: 82,
      gradYear: "2025"
    },
    {
      id: "3",
      fullName: "Jordan Williams",
      grade: "12th",
      act: 31,
      sat: 1420,
      gpa: 4.0,
      position: "WR",
      state: "Florida",
      rating: 91,
      gradYear: "2024"
    }
  ])

  const handleSearch = () => {
    // In a real app, this would make an API call
    console.log("Searching with filters:", {
      searchTerm,
      selectedGrade,
      selectedPosition,
      selectedGradYear,
      selectedState
    })
  }

  const handleFollow = (playerId: string) => {
    // In a real app, this would add the player to the coach's following list
    console.log("Following player:", playerId)
  }

  const positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"]
  const grades = ["9th", "10th", "11th", "12th"]
  const gradYears = ["2024", "2025", "2026", "2027"]
  const states = ["Texas", "California", "Florida", "New York", "Illinois", "Ohio", "Pennsylvania"]

  return (
    <div className="space-y-6">
             <div>
         <h1 className="text-3xl font-bold text-foreground">Search Players</h1>
         <p className="text-muted-foreground">Find and follow new players</p>
       </div>

       {/* Search Filters */}
       <Card className="bg-card border-border">
         <CardHeader>
           <CardTitle className="text-card-foreground flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search by Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Grade</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Position</label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Graduation Year</label>
              <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grad year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {gradYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

             {/* Search Results */}
       <Card className="bg-card border-border">
         <CardHeader>
           <CardTitle className="text-card-foreground">Search Results</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="rounded-md border border-border">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Rating</TableHead>
                   <TableHead>Name</TableHead>
                   <TableHead>Grade</TableHead>
                   <TableHead>ACT</TableHead>
                   <TableHead>SAT</TableHead>
                   <TableHead>GPA</TableHead>
                   <TableHead>Position</TableHead>
                   <TableHead>State</TableHead>
                   <TableHead>Grad Year</TableHead>
                   <TableHead>Action</TableHead>
                 </TableRow>
               </TableHeader>
                             <TableBody>
                 {searchResults.map((player) => (
                   <TableRow key={player.id}>
                     <TableCell>
                       <div className="flex items-center gap-2">
                         <span className="font-medium">{player.rating}</span>
                         <Star className="h-4 w-4 text-yellow-500" />
                       </div>
                     </TableCell>
                     <TableCell className="font-medium">{player.fullName}</TableCell>
                     <TableCell className="text-muted-foreground">{player.grade}</TableCell>
                     <TableCell className="text-muted-foreground">{player.act}</TableCell>
                     <TableCell className="text-muted-foreground">{player.sat}</TableCell>
                     <TableCell className="text-muted-foreground">{player.gpa}</TableCell>
                     <TableCell>
                       <Badge variant="secondary">
                         {player.position}
                       </Badge>
                     </TableCell>
                     <TableCell className="text-muted-foreground">{player.state}</TableCell>
                     <TableCell className="text-muted-foreground">{player.gradYear}</TableCell>
                     <TableCell>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleFollow(player.id)}
                       >
                         Follow
                       </Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 