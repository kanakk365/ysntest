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
  IconVideo
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBuilding className="size-4" />
            Total Organizations
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            142
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing steadily <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Active organizations this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsersGroup className="size-4" />
            Total Teams
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,847
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong team formation <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Teams registered this quarter
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="size-4" />
            Total Coaches
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            423
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +6.7%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Coaching staff growing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Certified coaches onboarded
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconTournament className="size-4" />
            Total Matches
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +22.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Match activity increasing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Matches played this season
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="size-4" />
            Total Revenue
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $87,450
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +18.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue trending up <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Monthly recurring revenue
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUserPlus className="size-4" />
            New Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3,289
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            User growth accelerating <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            New registrations this month
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconTarget className="size-4" />
            Conversion Rate
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24.7%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Conversion improving <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Trial to paid conversion
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconPlayerPlay className="size-4" />
            Active Players
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12,546
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +9.4%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Player engagement high <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Players active this week
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconVideo className="size-4" />
            Total Streamed Videos
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8,921
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +28.6%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Video content surging <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Videos streamed this month
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
