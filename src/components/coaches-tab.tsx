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

interface Coach {
  id: number
  firstName: string
  lastName: string
  email: string
  mobile: string
  highSchoolAddress: string
  logo: string
  status: "active" | "inactive"
}

export function CoachesTab() {
  const [coaches, setCoaches] = useState<Coach[]>([
    { 
      id: 1, 
      firstName: "John", 
      lastName: "Smith", 
      email: "john.smith@school.com", 
      mobile: "+1 (555) 123-4567",
      highSchoolAddress: "123 Main St, Springfield, IL 62701",
      logo: "/coaches/coach1.png",
      status: "active" 
    },
    { 
      id: 2, 
      firstName: "Sarah", 
      lastName: "Johnson", 
      email: "sarah.johnson@school.com", 
      mobile: "+1 (555) 234-5678",
      highSchoolAddress: "456 Oak Ave, Springfield, IL 62702",
      logo: "/coaches/coach2.png",
      status: "active" 
    },
    { 
      id: 3, 
      firstName: "Mike", 
      lastName: "Brown", 
      email: "mike.brown@school.com", 
      mobile: "+1 (555) 345-6789",
      highSchoolAddress: "789 Pine Rd, Springfield, IL 62703",
      logo: "/coaches/coach3.png",
      status: "inactive" 
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [newCoach, setNewCoach] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    highSchoolAddress: "",
    logo: ""
  })

  const itemsPerPage = 5
  const filteredCoaches = coaches.filter(coach => 
    `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredCoaches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCoaches = filteredCoaches.slice(startIndex, startIndex + itemsPerPage)

  const handleAddCoach = () => {
    if (newCoach.firstName.trim() && newCoach.lastName.trim() && newCoach.email.trim()) {
      const newId = Math.max(...coaches.map(c => c.id)) + 1
      setCoaches([...coaches, { 
        id: newId, 
        ...newCoach,
        logo: newCoach.logo || "/coaches/default.png",
        status: "active" 
      }])
      setNewCoach({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        highSchoolAddress: "",
        logo: ""
      })
      setIsAddModalOpen(false)
    }
  }

  const handleEditCoach = () => {
    if (editingCoach) {
      setCoaches(coaches.map(coach => 
        coach.id === editingCoach.id ? editingCoach : coach
      ))
      setIsEditModalOpen(false)
      setEditingCoach(null)
    }
  }

  const handleDeleteCoach = (id: number) => {
    setCoaches(coaches.filter(coach => coach.id !== id))
  }

  const toggleStatus = (id: number) => {
    setCoaches(coaches.map(coach => 
      coach.id === id 
        ? { ...coach, status: coach.status === "active" ? "inactive" : "active" }
        : coach
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coaches</CardTitle>
          <CardDescription>
            Manage your coaches and their information
          </CardDescription>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coach
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Coach</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newCoach.firstName}
                        onChange={(e) => setNewCoach({...newCoach, firstName: e.target.value})}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newCoach.lastName}
                        onChange={(e) => setNewCoach({...newCoach, lastName: e.target.value})}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCoach.email}
                      onChange={(e) => setNewCoach({...newCoach, email: e.target.value})}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={newCoach.mobile}
                      onChange={(e) => setNewCoach({...newCoach, mobile: e.target.value})}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">High School Address</Label>
                    <Input
                      id="address"
                      value={newCoach.highSchoolAddress}
                      onChange={(e) => setNewCoach({...newCoach, highSchoolAddress: e.target.value})}
                      placeholder="High school address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={newCoach.logo}
                      onChange={(e) => setNewCoach({...newCoach, logo: e.target.value})}
                      placeholder="Logo URL"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCoach}>
                      Add Coach
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
                <TableHead>Coach</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCoaches.map((coach, index) => (
                <TableRow key={coach.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={coach.logo} alt={`${coach.firstName} ${coach.lastName}`} />
                        <AvatarFallback>{coach.firstName.charAt(0)}{coach.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{coach.firstName} {coach.lastName}</div>
                        <div className="text-sm text-muted-foreground">{coach.highSchoolAddress}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{coach.mobile}</TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={coach.status === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(coach.id)}
                    >
                      {coach.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingCoach(coach)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCoach(coach.id)}
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCoaches.length)} of {filteredCoaches.length} coaches
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
          </DialogHeader>
          {editingCoach && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={editingCoach.firstName}
                    onChange={(e) => setEditingCoach({...editingCoach, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={editingCoach.lastName}
                    onChange={(e) => setEditingCoach({...editingCoach, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingCoach.email}
                  onChange={(e) => setEditingCoach({...editingCoach, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editMobile">Mobile</Label>
                <Input
                  id="editMobile"
                  type="tel"
                  value={editingCoach.mobile}
                  onChange={(e) => setEditingCoach({...editingCoach, mobile: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editAddress">High School Address</Label>
                <Input
                  id="editAddress"
                  value={editingCoach.highSchoolAddress}
                  onChange={(e) => setEditingCoach({...editingCoach, highSchoolAddress: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editLogo">Logo URL</Label>
                <Input
                  id="editLogo"
                  value={editingCoach.logo}
                  onChange={(e) => setEditingCoach({...editingCoach, logo: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCoach}>
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
