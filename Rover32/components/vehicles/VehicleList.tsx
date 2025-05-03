"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleCard } from "./VehicleCard";
import { Vehicle } from "@/types";
import { EmptyState } from "@/components/EmptyState";

//? Componente che mostra la lista dei veicoli dell'utente
export function VehicleList() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        //? Chiamata API per ottenere i veicoli
        const response = await fetch("/api/vehicles");
        const data = await response.json();

        //! Gestione degli errori nella risposta
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch vehicles");
        }

        setVehicles(data.vehicles || []);
      } catch (error) {
        //! Gestione degli errori generici
        console.error("Error fetching vehicles:", error);
        setError((error as Error).message || "Failed to fetch vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  //? Visualizzazione durante il caricamento
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  //? Visualizzazione in caso di errore
  if (error) {
    return (
      <EmptyState
        title="Error loading vehicles"
        description={error}
        action={
          <Button onClick={() => router.refresh()}>Retry</Button>
        }
      />
    );
  }

  //? Visualizzazione se non ci sono veicoli
  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="No vehicles found"
        description="You haven't added any vehicles yet. Start by adding your first ESP32 vehicle."
        action={
          <Button onClick={() => router.push("/vehicles/add")}>
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
        }
      />
    );
  }

  //? Visualizzazione standard con veicoli disponibili
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Vehicles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}

//TODO Aggiungere funzionalità di ricerca e filtro dei veicoli
//TODO Implementare visualizzazione a lista/griglia selezionabile
//TODO Aggiungere ordinamento personalizzabile (nome, data, stato)
