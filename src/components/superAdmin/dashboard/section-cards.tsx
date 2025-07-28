"use client"

import {
  IconTrendingUp,
  IconBuilding,
  IconUsers,
  IconUsersGroup,
  IconTournament,
  IconCurrencyDollar,
  IconUserPlus,
  IconTarget,
  IconPlayerPlay,
  IconVideo,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
  totalRevenue: {
    count: number
    labelCount: number
    monthlyTarget: number
    contentCount: number
  }
  activePlayers: {
    count: number
    labelCount: number
    dailyActive: number
    weeklyActive: number
  }
  newUsers: {
    count: number
    labelCount: number
    thisMonth: number
    avergare: number
  }
  totalTeams: {
    count: number
    labelCount: number
  }
  totalStreamedVideos: {
    count: number
    labelCount: number
    avgWatchTime: number
    totalViews: number
    engagement: number
    completionRate: number
  }
  totalAccounts: {
    totalUsers: number
    admins: number
    orgAdmins: number
    totalPlayers: number
    totalCoaches: number
    totalProScouts: number
    totalGuestUsers: number
  }
  totalMatches: {
    count: number
    labelCount: number
    Completed: number
    inProgress: number
    winRate: number
  }
  organizations: {
    count: number
    labelCount: number
  }
  totalCoaches: {
    count: number
    labelCount: number
  }
}

interface SectionCardsProps {
  dashboardData: DashboardData
}

export function SectionCards({ dashboardData }: SectionCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes)
    const secs = Math.floor((minutes - mins) * 60)
    return `${mins}m ${secs}s`
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 auto-rows-fr">
      {/* Row 1 */}
      {/* Hero Card - Total Revenue */}
      <Card className="md:col-span-2 xl:col-span-2 bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-4">
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconCurrencyDollar className="size-5" />
            Total Revenue
          </CardDescription>
          <CardTitle className="text-5xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatCurrency(dashboardData.totalRevenue.count)}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +{dashboardData.totalRevenue.labelCount}% from last month
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Monthly Target: {formatCurrency(dashboardData.totalRevenue.monthlyTarget)}</span>
              <span className="font-semibold text-[var(--card-foreground)]">
                {dashboardData.totalRevenue.monthlyTarget > 0 
                  ? Math.round((dashboardData.totalRevenue.count / dashboardData.totalRevenue.monthlyTarget) * 100)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={dashboardData.totalRevenue.monthlyTarget > 0 
                ? Math.min((dashboardData.totalRevenue.count / dashboardData.totalRevenue.monthlyTarget) * 100, 100)
                : 0
              } 
              className="h-3 bg-[var(--accent)]" 
            />
            <p className="text-sm text-[var(--muted-foreground)]">
              Content Count: {formatNumber(dashboardData.totalRevenue.contentCount)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Players - Featured */}
      <Card className="xl:col-span-2 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconPlayerPlay className="size-5" />
            Active Players
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.activePlayers.count)}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +{dashboardData.activePlayers.labelCount}% this week
          </Badge>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">Daily Active</span>
              <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.activePlayers.dailyActive)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">Weekly Active</span>
              <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.activePlayers.weeklyActive)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* New Users - Regular Card */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconUserPlus className="size-5" />
            New Users
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.newUsers.count)}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +{dashboardData.newUsers.labelCount}%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">This Month</span>
              <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.newUsers.thisMonth)}</span>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Average: {formatNumber(dashboardData.newUsers.avergare)} daily signups</div>
          </div>
        </CardFooter>
      </Card>

      {/* Total Teams */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconUsersGroup className="size-4" />
            Total Teams
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.totalTeams.count)}
          </CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +{dashboardData.totalTeams.labelCount}%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-2">
          <div className="text-xs text-[var(--muted-foreground)]">Active teams this quarter</div>
        </CardFooter>
      </Card>

      {/* Row 2 */}
      {/* Total Streamed Videos */}
      <Card className="md:col-span-2 xl:col-span-2 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconVideo className="size-5" />
            Total Streamed Videos
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.totalStreamedVideos.count)}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +{dashboardData.totalStreamedVideos.labelCount}% streams
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Avg. Watch Time</span>
                <span className="font-semibold text-[var(--card-foreground)]">{formatTime(dashboardData.totalStreamedVideos.avgWatchTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Completion Rate</span>
                <span className="font-semibold text-[var(--card-foreground)]">{dashboardData.totalStreamedVideos.completionRate}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Total Views</span>
                <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalStreamedVideos.totalViews)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Engagement</span>
                <span className="font-semibold text-[var(--card-foreground)]">{dashboardData.totalStreamedVideos.engagement}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Accounts */}
      <Card className="md:col-span-2 xl:col-span-2 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconUsers className="size-5" />
            Total Accounts
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.totalAccounts.totalUsers)}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            All user types
          </Badge>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Admins</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.admins)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Org Admins</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.orgAdmins)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Players</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.totalPlayers)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Coaches</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.totalCoaches)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Pro Scouts</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.totalProScouts)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted-foreground)]">Guest Users</span>
                  <span className="font-semibold text-[var(--card-foreground)]">{formatNumber(dashboardData.totalAccounts.totalGuestUsers)}</span>
                </div>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Organizations */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconBuilding className="size-4" />
            Organizations
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.organizations.count)}
          </CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +{dashboardData.organizations.labelCount}%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-2">
          <div className="text-xs text-[var(--muted-foreground)]">Active organizations this month</div>
        </CardFooter>
      </Card>

      {/* Total Coaches */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconUsers className="size-4" />
            Total Coaches
          </CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">
            {formatNumber(dashboardData.totalCoaches.count)}
          </CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +{dashboardData.totalCoaches.labelCount}%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-2">
          <div className="text-xs text-[var(--muted-foreground)]">Certified coaches onboarded</div>
        </CardFooter>
      </Card>
    </div>
  )
}
