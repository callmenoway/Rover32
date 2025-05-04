import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/src/lib/db";
import { VehicleCard } from "@/components/vehicle-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/src/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { StatsOverview } from "@/components/stats-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Rover32 control center",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  const vehicles = await db.vehicle.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  
  // Calcola statistiche globali
  const totalDistance = vehicles.reduce((acc, vehicle) => acc + vehicle.distanceTraveled, 0);
  const totalOperationTime = vehicles.reduce((acc, vehicle) => acc + vehicle.operationTime, 0);
  const totalCommands = vehicles.reduce((acc, vehicle) => acc + vehicle.commandsExecuted, 0);
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/vehicles/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Veicolo
          </Button>
        </Link>
      </div>
      
      {/* Statistiche generali */}
      <StatsOverview 
        totalVehicles={vehicles.length}
        totalDistance={totalDistance}
        totalOperationTime={totalOperationTime}
        totalCommands={totalCommands}
      />
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">I tuoi veicoli</h2>
      
      {vehicles.length === 0 ? (
        <EmptyState 
          title="Nessun veicolo trovato"
          description="Aggiungi il tuo primo veicolo per iniziare a controllarlo."
          action={
            <Link href="/dashboard/vehicles/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi veicolo
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
