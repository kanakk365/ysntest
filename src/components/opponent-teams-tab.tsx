"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Team {
  id: number
  name: string
  logo: string
  status: "active" | "inactive"
}

export function OpponentTeamsTab() {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Warriors", logo: "/teams/warriors.png", status: "active" },
    { id: 2, name: "Lakers", logo: "/teams/lakers.png", status: "active" },
    { id: 3, name: "Bulls", logo: "/teams/bulls.png", status: "inactive" },
    { id: 4, name: "Celtics", logo: "/teams/celtics.png", status: "active" },
    { id: 5, name: "Heat", logo: "/teams/heat.png", status: "active" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState({ name: "", logo: "" })

  const itemsPerPage = 5
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + itemsPerPage)

  const handleAddTeam = () => {
    if (newTeam.name.trim()) {
      const newId = Math.max(...teams.map(t => t.id)) + 1
      setTeams([...teams, { 
        id: newId, 
        name: newTeam.name, 
        logo: newTeam.logo || "/teams/default.png", 
        status: "active" 
      }])
      setNewTeam({ name: "", logo: "" })
      setIsAddModalOpen(false)
    }
  }

  const handleEditTeam = () => {
    if (editingTeam) {
      setTeams(teams.map(team => 
        team.id === editingTeam.id ? editingTeam : team
      ))
      setIsEditModalOpen(false)
      setEditingTeam(null)
    }
  }

  const handleDeleteTeam = (id: number) => {
    setTeams(teams.filter(team => team.id !== id))
  }

  const toggleStatus = (id: number) => {
    setTeams(teams.map(team => 
      team.id === id 
        ? { ...team, status: team.status === "active" ? "inactive" : "active" }
        : team
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Opponent Teams</CardTitle>
          <CardDescription>
            Manage your opponent teams and their information
          </CardDescription>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamLogo">Logo URL</Label>
                    <Input
                      id="teamLogo"
                      value={newTeam.logo}
                      onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})}
                      placeholder="Enter logo URL"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTeam}>
                      Add Team
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={team.logo} alt={team.name} />
                      <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={team.status === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(team.id)}
                    >
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingTeam(team)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTeams.length)} of {filteredTeams.length} teams
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTeamName">Team Name</Label>
                <Input
                  id="editTeamName"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editTeamLogo">Logo URL</Label>
                <Input
                  id="editTeamLogo"
                  value={editingTeam.logo}
                  onChange={(e) => setEditingTeam({...editingTeam, logo: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTeam}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
