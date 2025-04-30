"use client";

import { Vehicle } from "@/types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

//! Importante: WebSocket e altre API browser-specific non funzionano lato server
const VehicleController = dynamic(
  () => import("@/components/vehicles/VehicleController"),
  { ssr: false }
);

//? Componente wrapper che gestisce il caricamento del controller del veicolo
export function VehicleControllerWrapper({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading controller...</span>
      </div>
    }>
      <VehicleController vehicle={vehicle} />
    </Suspense>
  );
}

//TODO Implementare un sistema di riconnessione automatica
