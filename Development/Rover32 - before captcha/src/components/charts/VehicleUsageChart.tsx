"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useParams } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

const chartConfig = {
  usage: {
    label: "Usage",
  },
  uptime: {
    label: "Uptime Hours",
    color: "hsl(210, 100%, 50%)", // Blue color
  },
  control: {
    label: "Control Hours",
    color: "hsl(190, 90%, 50%)", // Light blue/cyan color
  },
} satisfies ChartConfig

interface VehicleStatsData {
  date: string;
  uptime: number;
  control: number;
}

export function VehicleUsageChart() {
  const params = useParams();
  const vehicleId = params.id as string;
  
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<VehicleStatsData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        // Convert timeRange to days
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        
        // Fetch data from our API
        const response = await fetch(`/api/vehicles/stats/${vehicleId}?days=${days}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        
        const data = await response.json();
        setChartData(data.stats || []);
      } catch (error) {
        console.error("Error loading vehicle stats:", error);
        // Set empty array on error
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [vehicleId, timeRange]);

  // Filter data based on time range (though our API already does this)
  const filteredData = chartData;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Vehicle Usage Statistics</CardTitle>
          <CardDescription>
            {isLoading ? "Loading data..." : `Showing uptime and control hours over ${timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "3 months"}`}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[250px]">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-[250px]">
            <p className="text-muted-foreground">No data available for this time period</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
            style={{
              "--color-uptime": "hsl(210, 100%, 50%)",
              "--color-control": "hsl(190, 90%, 50%)",
            } as React.CSSProperties}
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillUptime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(210, 100%, 50%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(210, 100%, 50%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillControl" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(190, 90%, 50%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(190, 90%, 50%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="control"
                type="natural"
                fill="url(#fillControl)"
                stroke="hsl(190, 90%, 50%)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="uptime"
                type="natural"
                fill="url(#fillUptime)"
                stroke="hsl(210, 100%, 50%)"
                strokeWidth={2}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
