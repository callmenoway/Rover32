import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/src/lib/db";
import { getCurrentUser } from "@/src/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Clock, Gauge, RouteOff } from "lucide-react";
import Link from "next/link";
import { VehicleUsageChart } from "@/src/components/charts/VehicleUsageChart";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import CountUp from '@/src/components/ui/CountUp'
interface VehicleStatsPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Vehicle Statistics",
  description: "View detailed statistics for your vehicle",
};

async function getVehicle(id: string, userId: string) {
  return await db.vehicle.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export default async function VehicleStatsPage({ params }: VehicleStatsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  // Resolve params before using them
  const resolvedParams = await Promise.resolve(params);
  const vehicleId = resolvedParams.id;
  
  const vehicle = await getVehicle(vehicleId, user.id);

  if (!vehicle) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{vehicle.name} Statistics</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/vehicles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Uptime Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Total Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={vehicle.uptimeHours !== null && vehicle.uptimeHours !== undefined 
                  ? Number(vehicle.uptimeHours)
                  : 0}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl font-bold"
            />
            {/* <div className="text-3xl font-bold">
              {vehicle.uptimeHours !== null && vehicle.uptimeHours !== undefined 
                ? Number(vehicle.uptimeHours).toFixed(1)
                : "0.0"}
            </div> */}
            <p className="text-muted-foreground">Hours</p>
          </CardContent>
        </Card>

        {/* Control Hours Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <RouteOff className="h-5 w-5 mr-2 text-green-500" />
              Control Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={vehicle.controlHours !== null && vehicle.controlHours !== undefined 
                ? Number(vehicle.controlHours)
                : 0}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl font-bold"
            />
            {/* <div className="text-3xl font-bold">
              {vehicle.controlHours !== null && vehicle.controlHours !== undefined 
                ? Number(vehicle.controlHours).toFixed(1)
                : "0.0"}
            </div> */}
            <p className="text-muted-foreground">Hours</p>
          </CardContent>
        </Card>

        {/* Distance Traveled Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-purple-500" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountUp
              from={0}
              to={vehicle.kilometersDriven !== null && vehicle.kilometersDriven !== undefined 
                ? Number(vehicle.kilometersDriven)
                : 0}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text text-3xl font-bold"
            />
            {/* <div className="text-3xl font-bold">
              {vehicle.kilometersDriven !== null && vehicle.kilometersDriven !== undefined 
                ? Number(vehicle.kilometersDriven).toFixed(2)
                : "0.00"}
            </div> */}
            <p className="text-muted-foreground">Kilometers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Vehicle Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IP Address:</span>
                <span className="font-medium">{vehicle.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MAC Address:</span>
                <span className="font-medium">{vehicle.macAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(vehicle.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{new Date(vehicle.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Chart */}
        <VehicleUsageChart />
      </div>
    </div>
  );
}
