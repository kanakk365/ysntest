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

export function SectionCards() {
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
            $87,450
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +18.5% from last month
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Monthly Target: $75,000</span>
              <span className="font-semibold text-[var(--card-foreground)]">116.6%</span>
            </div>
            <Progress value={87} className="h-3 bg-[var(--accent)]" />
            <p className="text-sm text-[var(--muted-foreground)]">
              Exceeded target by $12,450 • Best performing quarter
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
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">12,546</CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +9.4% this week
          </Badge>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">Daily Active</span>
              <span className="font-semibold text-[var(--card-foreground)]">3,456</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">Weekly Active</span>
              <span className="font-semibold text-[var(--card-foreground)]">8,234</span>
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
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">3,289</CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +12.8%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted-foreground)]">This Month</span>
              <span className="font-semibold text-[var(--card-foreground)]">3,289</span>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">Average: 109 daily signups</div>
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
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">1,847</CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +15.3%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-2">
          <div className="text-xs text-[var(--muted-foreground)]">Strong team formation this quarter</div>
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
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">8,921</CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +28.6% streams
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Avg. Watch Time</span>
                <span className="font-semibold text-[var(--card-foreground)]">12m 34s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Completion Rate</span>
                <span className="font-semibold text-[var(--card-foreground)]">76%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Total Views</span>
                <span className="font-semibold text-[var(--card-foreground)]">156K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Engagement</span>
                <span className="font-semibold text-[var(--card-foreground)]">84%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Matches */}
      <Card className="md:col-span-2 xl:col-span-2 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-[var(--card-foreground)] font-medium">
            <IconTournament className="size-5" />
            Total Matches
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums text-[var(--card-foreground)]">5,234</CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
          >
            <IconTrendingUp className="size-4 mr-1" />
            +22.1% this season
          </Badge>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[var(--card-foreground)]">3,559</p>
                <p className="text-xs text-[var(--muted-foreground)]">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--card-foreground)]">1,675</p>
                <p className="text-xs text-[var(--muted-foreground)]">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--card-foreground)]">68%</p>
                <p className="text-xs text-[var(--muted-foreground)]">Win Rate</p>
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
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">142</CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +8.2%
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
          <CardTitle className="text-3xl font-bold tabular-nums text-[var(--card-foreground)]">423</CardTitle>
          <Badge
            variant="outline"
            className="w-fit border-[var(--border)] text-[var(--accent-foreground)]"
          >
            <IconTrendingUp className="size-3 mr-1" />
            +6.7%
          </Badge>
        </CardHeader>
        <CardFooter className="pt-2">
          <div className="text-xs text-[var(--muted-foreground)]">Certified coaches onboarded</div>
        </CardFooter>
      </Card>
    </div>
  )
}
