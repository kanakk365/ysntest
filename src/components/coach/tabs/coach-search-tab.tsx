"use client";

import { useState, useEffect, useMemo } from "react";
import { useCoachStore } from "@/lib/coach-store";
import { api, SearchPlayer, Position, State, FollowedPlayerData } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
} from "lucide-react";
import Image from "next/image";

export function CoachSearchTab() {
  const { setActiveTab } = useCoachStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Add state for followed players
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayerData[]>([]);
  const [followedPlayersLoading, setFollowedPlayersLoading] = useState(false);
  const [followedPlayersError, setFollowedPlayersError] = useState<string | null>(null);

  // Helper function to validate image URLs
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [allPlayers, setAllPlayers] = useState<SearchPlayer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<{
    positions: Position[];
    years: number[];
    states: State[];
  }>({
    positions: [],
    years: [],
    states: [],
  });
  const resultsPerPage = 12;

  // Fetch all players, filters, and followed players on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch filters
        const filtersResponse = await api.players.getSearchFilters();
        if (filtersResponse.status) {
          setFilters({
            positions: filtersResponse.data.position,
            years: filtersResponse.data.years,
            states: filtersResponse.data.states,
          });
        } else {
          setError(filtersResponse.message || "Failed to fetch filters");
        }

        // Fetch all players (no filters)
        const playersResponse = await api.players.search();
        if (playersResponse.status) {
          setAllPlayers(playersResponse.data);
        } else {
          setError(playersResponse.message || "Failed to fetch players");
        }

        // Fetch followed players
        await fetchFollowedPlayers();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add function to fetch followed players
  const fetchFollowedPlayers = async () => {
    try {
      setFollowedPlayersLoading(true);
      setFollowedPlayersError(null);
      const response = await api.players.getFollowedPlayers();
      if (response.status) {
        setFollowedPlayers(response.data);
      } else {
        setFollowedPlayersError(response.message || "Failed to fetch followed players");
      }
    } catch (error) {
      setFollowedPlayersError(error instanceof Error ? error.message : "Failed to fetch followed players");
    } finally {
      setFollowedPlayersLoading(false);
    }
  };

  // Add function to handle follow/unfollow player
  const handleFollow = async (playerId: number) => {
    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await api.players.followPlayer({
        usfl_following_user_id: playerId,
        usfl_user_id: user.id,
        usfl_following_user_type: 5 // Assuming 5 is the user type for players
      });

      if (response.status) {
        // Refresh followed players list
        await fetchFollowedPlayers();
        console.log("Follow/Unfollow successful:", response.message);
      } else {
        console.error("Follow/Unfollow failed:", response.message);
      }
    } catch (error) {
      console.error("Error following/unfollowing player:", error);
    }
  };

  // Helper function to check if a player is followed
  const isPlayerFollowed = (playerId: number) => {
    return followedPlayers.some(player => player.kids_id === playerId);
  };

  // Frontend filtering logic
  const filteredPlayers = useMemo(() => {
    if (!allPlayers.length) return [];

    return allPlayers.filter((player) => {
      // Search term filter
      if (searchTerm.trim()) {
        const fullName =
          `${player.kids_fname} ${player.kids_lname}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        if (!fullName.includes(searchLower)) {
          return false;
        }
      }

      // Grade filter
      if (selectedGrade !== "all") {
        const playerGrade = player.kids_graduating_class;
        if (playerGrade !== selectedGrade) {
          return false;
        }
      }

      // Position filter
      if (selectedPosition !== "all") {
        // Find the position name for the selected position ID
        const selectedPositionObj = filters.positions.find(
          (p) => p.plps_id.toString() === selectedPosition
        );
        if (
          selectedPositionObj &&
          player.main_position !== selectedPositionObj.plps_name
        ) {
          return false;
        }
      }

      // Graduation year filter
      if (selectedGradYear !== "all") {
        const year = parseInt(selectedGradYear);
        if (player.graduating_year !== year.toString()) {
          return false;
        }
      }

      // State filter
      if (selectedState !== "all") {
        // Note: You may need to add a state field to your SearchPlayer interface
        // For now, this is a placeholder - adjust based on your data structure
        // if (player.state !== selectedState) {
        //   return false
        // }
      }

      return true;
    });
  }, [
    allPlayers,
    searchTerm,
    selectedGrade,
    selectedPosition,
    selectedGradYear,
    selectedState,
  ]);

  const handleSearch = () => {
    setCurrentPage(1);
    setHasSearched(true);
  };

  // Auto-apply filters when any filter changes
  useEffect(() => {
    if (allPlayers.length > 0) {
      setHasSearched(true);
      setCurrentPage(1);
    }
  }, [
    searchTerm,
    selectedGrade,
    selectedPosition,
    selectedGradYear,
    selectedState,
    allPlayers.length,
  ]);

  const handlePlayerClick = (playerId: number) => {
    console.log(`Viewing player ${playerId}`);
  };

  const handleBackToPlayers = () => {
    setActiveTab("players");
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPlayers.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredPlayers.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 pb-8 max-w-7xl">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToPlayers}
          className="mr-2 mb-8"
        >
          <ArrowLeft className="h-4 w-4 " />
        </Button>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Search Players
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Discover and connect with talented athletes
              </p>
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
                <span className="text-sm font-semibold text-foreground">
                  Advanced Filters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Grade Level
                  </label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Position
                  </label>
                  <Select
                    value={selectedPosition}
                    onValueChange={setSelectedPosition}
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {filters.positions.map((position) => (
                        <SelectItem
                          key={position.plps_id}
                          value={position.plps_id.toString()}
                        >
                          {position.plps_name}
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
                  <Select
                    value={selectedGradYear}
                    onValueChange={setSelectedGradYear}
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {filters.years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
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
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {filters.states.map((state) => (
                        <SelectItem key={state.stat_id} value={state.stat_code}>
                          {state.stat_name}
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
                disabled={loading}
                className="flex-1 sm:flex-none sm:min-w-[160px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {loading ? "Loading..." : "Refresh Results"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGrade("all");
                  setSelectedPosition("all");
                  setSelectedGradYear("all");
                  setSelectedState("all");
                  setCurrentPage(1);
                  setHasSearched(false);
                  setError(null);
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
              <CardTitle className="text-card-foreground text-xl font-semibold">
                Search Results
              </CardTitle>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {filteredPlayers.length} players found
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Followed Players Error Display */}
            {followedPlayersError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-medium">
                  Error loading followed players: {followedPlayersError}
                  <Button 
                    onClick={fetchFollowedPlayers} 
                    variant="outline" 
                    size="sm"
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    Loading players...
                  </span>
                </div>
              </div>
            )}

            {/* Initial State - No Search Performed */}
            {!loading && !error && !hasSearched && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Search
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Use the filters above to find athletes that match your
                  criteria. Results update automatically.
                </p>
              </div>
            )}

            {/* No Results State */}
            {!loading &&
              !error &&
              hasSearched &&
              filteredPlayers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 rounded-full bg-muted/20 mb-4">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No players found
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Try adjusting your search criteria or filters to find more
                    players.
                  </p>
                </div>
              )}

            {/* Results Grid */}
            {!loading &&
              !error &&
              hasSearched &&
              filteredPlayers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentResults.map((player) => (
                    <div key={player.hash_id} className="group">
                      <Card className=" p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm">
                        <div className="relative">
                          {/* Player Image */}
                          <div
                            className="relative w-full h-52 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={() => handlePlayerClick(player.kids_id)}
                          >
                            {player.kids_avatar &&
                            isValidImageUrl(player.kids_avatar) ? (
                              <Image
                                src={player.kids_avatar}
                                alt={`${player.kids_fname} ${player.kids_lname}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`flex flex-col items-center justify-center text-muted-foreground ${
                                player.kids_avatar &&
                                isValidImageUrl(player.kids_avatar)
                                  ? "hidden"
                                  : ""
                              }`}
                            >
                              <div className="p-4 rounded-full bg-primary/10 mb-3">
                                <User className="h-12 w-12 text-primary" />
                              </div>
                              <span className="text-sm font-medium">
                                No Photo
                              </span>
                            </div>

                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-bold text-foreground">
                                4.5
                              </span>
                            </div>
                          </div>

                          {/* Player Info */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-base truncate mb-1">{`${player.kids_fname} ${player.kids_lname}`}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {player.kids_graduating_class || "N/A"} •{" "}
                                  {player.graduating_year}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs font-medium border-primary/30 text-primary"
                              >
                                {player.main_position}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                              <div className="bg-muted/30 rounded-lg p-2 text-center">
                                <div className="font-semibold text-foreground">
                                  ACT
                                </div>
                                <div className="text-muted-foreground">
                                  {player.kids_act || "N/A"}
                                </div>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-2 text-center">
                                <div className="font-semibold text-foreground">
                                  SAT
                                </div>
                                <div className="text-muted-foreground">
                                  {player.kids_sat || "N/A"}
                                </div>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-2 text-center">
                                <div className="font-semibold text-foreground">
                                  GPA
                                </div>
                                <div className="text-muted-foreground">
                                  {player.kids_gpa || "N/A"}
                                </div>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-2 text-center">
                                <div className="font-semibold text-foreground">
                                  Year
                                </div>
                                <div className="text-muted-foreground">
                                  {player.graduating_year}
                                </div>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              className={`w-full h-9 border-2 font-medium transition-all shadow-sm ${
                                isPlayerFollowed(player.kids_id) 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                  : "bg-transparent border-primary hover:bg-primary/20 text-primary"
                              }`}
                              onClick={() => handleFollow(player.kids_id)}
                              disabled={followedPlayersLoading}
                            >
                              {followedPlayersLoading ? "Loading..." : (isPlayerFollowed(player.kids_id) ? "Unfollow" : "Follow Player")}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

            {/* Enhanced Pagination */}
            {!loading &&
              !error &&
              hasSearched &&
              filteredPlayers.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30">
                  <div className="text-sm text-muted-foreground font-medium">
                    Showing{" "}
                    <span className="text-foreground font-semibold">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-foreground font-semibold">
                      {Math.min(endIndex, filteredPlayers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-semibold">
                      {filteredPlayers.length}
                    </span>{" "}
                    players
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
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
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
                          );
                        }
                      )}
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
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
