import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VehicleControllerWrapper } from "@/components/vehicles/VehicleControllerWrapper";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

//? Generazione dinamica dei metadati della pagina
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  //? Risolve i parametri della route dinamica
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  //? Cerca il veicolo nel database per personalizzare il titolo
  const vehicle = await db.vehicle.findUnique({
    where: { id },
  });

  return {
    title: vehicle ? `Control ${vehicle.name} - Rover32` : "Control Vehicle - Rover32",
    description: "Control your ESP32 vehicle remotely",
  };
}

export default async function ControlVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //! Protezione della rotta: reindirizza se l'utente non è autenticato
  if (!session?.user) {
    redirect("/sign-in");
  }

  //? Risolve i parametri della route dinamica
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  //? Recupera i dati del veicolo dal database
  const vehicle = await db.vehicle.findUnique({
    where: { id },
  });

  //! Se il veicolo non esiste, mostra la pagina 404
  if (!vehicle) {
    notFound();
  }

  //! Controlla che il veicolo appartenga all'utente corrente
  if (vehicle.userId !== session.user.id) {
    redirect("/vehicles");
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with back button and theme toggle */}
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vehicles" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to vehicles
          </Link>
        </Button>
        
        <ThemeToggle />
      </div>

      {/* Titolo della pagina */}
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Controlling {vehicle.name}
      </h1>

      {/* Controller del veicolo */}
      <VehicleControllerWrapper 
        vehicle={{
          ...vehicle,
          macAddress: vehicle.macAddress || undefined
        }} 
      />
    </div>
  );
}
