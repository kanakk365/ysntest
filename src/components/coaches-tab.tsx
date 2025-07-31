"use client";

import { useState } from "react"
import { useCoachStore } from "@/lib/coach-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Star, 
  Plus, 
  Edit, 
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Calculator,
  Award
} from "lucide-react"

export function CoachesTab() {
  const { players, updatePlayerRating, addPlayerNote, addPlayerLabel } = useCoachStore()
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [newNote, setNewNote] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showLabelDialog, setShowLabelDialog] = useState(false)

  const handleRatingChange = (playerId: string, newRating: number) => {
    updatePlayerRating(playerId, newRating)
  }

  const handleAddNote = (playerId: string) => {
    if (newNote.trim()) {
      addPlayerNote(playerId, newNote.trim())
      setNewNote("")
      setShowNoteDialog(false)
    }
  }

  const handleAddLabel = (playerId: string) => {
    if (newLabel.trim()) {
      addPlayerLabel(playerId, newLabel.trim())
      setNewLabel("")
      setShowLabelDialog(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Players</h1>
          <p className="text-muted-foreground">Manage and track your players</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Players Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rating</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>ACT</TableHead>
                  <TableHead>SAT</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={player.rating}
                          onChange={(e) => handleRatingChange(player.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                        />
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{player.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(player.dob)}</TableCell>
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
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPlayer(player)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Note for {player.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Note</Label>
                                <Textarea
                                  value={newNote}
                                  onChange={(e) => setNewNote(e.target.value)}
                                  placeholder="Enter your note..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Previous Notes:</Label>
                                <div className="space-y-1">
                                  {player.notes.map((note, index) => (
                                    <div key={index} className="p-2 bg-muted rounded text-sm text-muted-foreground">
                                      {note}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Button onClick={() => handleAddNote(player.id)} className="w-full">
                                Add Note
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={showLabelDialog} onOpenChange={setShowLabelDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPlayer(player)}
                            >
                              <Award className="h-3 w-3 mr-1" />
                              Label
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Label for {player.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Label</Label>
                                <Input
                                  value={newLabel}
                                  onChange={(e) => setNewLabel(e.target.value)}
                                  placeholder="Enter label..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Current Labels:</Label>
                                <div className="flex flex-wrap gap-2">
                                  {player.labels.map((label, index) => (
                                    <Badge key={index} variant="secondary">
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button onClick={() => handleAddLabel(player.id)} className="w-full">
                                Add Label
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
