import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod";

//? Schema Zod per la validazione dell'input
const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  ipAddress: z.string()
    .min(1, "IP Address is required")
    .regex(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, {
      message: "Invalid IP address format. Use format XXX.XXX.XXX.XXX"
    }),
  macAddress: z.string()
    .min(1, "MAC address is required")
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, { 
      message: "Invalid MAC address format. Use format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX" 
    }),
});

//? Funzione di utilità per verificare la proprietà del veicolo
async function checkVehicleOwnership(vehicleId: string, userId: string) {
  //? Cerca il veicolo nel database
  const vehicle = await db.vehicle.findUnique({
    where: { id: vehicleId },
  });

  //? Se il veicolo non esiste, restituisce null
  if (!vehicle) {
    return null;
  }

  //? Se l'utente non è il proprietario, restituisce false
  if (vehicle.userId !== userId) {
    return false;
  }

  //? Altrimenti restituisce il veicolo
  return vehicle;
}

//? Handler GET per ottenere un veicolo specifico
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //? Ottiene la sessione dell'utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ vehicle: null, message: "Unauthorized" }, { status: 401 });
    }

    //? Risolve i parametri della route dinamica
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    //? Verifica la proprietà del veicolo
    const vehicle = await checkVehicleOwnership(id, session.user.id);

    if (vehicle === null) {
      return NextResponse.json({ vehicle: null, message: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle === false) {
      return NextResponse.json({ vehicle: null, message: "You don't have permission to access this vehicle" }, { status: 403 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    //! Gestione degli errori
    console.error("Error fetching vehicle:", error);
    return NextResponse.json({ vehicle: null, message: "Failed to fetch vehicle" }, { status: 500 });
  }
}

//! Handler PATCH per aggiornare un veicolo
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ vehicle: null, message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const vehicle = await checkVehicleOwnership(id, session.user.id);

    if (vehicle === null) {
      return NextResponse.json({ vehicle: null, message: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle === false) {
      return NextResponse.json({ vehicle: null, message: "You don't have permission to update this vehicle" }, { status: 403 });
    }

    //? Estrae e valida i dati dalla richiesta
    const body = await req.json();
    const { name, ipAddress, macAddress } = vehicleSchema.parse(body);

    //? Aggiorna il veicolo nel database
    const updatedVehicle = await db.vehicle.update({
      where: { id },
      data: {
        name,
        ipAddress,
        macAddress,
      },
    });

    return NextResponse.json({ vehicle: updatedVehicle, message: "Vehicle updated successfully" });
  } catch (error) {
    //? Gestione specifica degli errori di validazione Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ vehicle: null, message: error.errors[0].message }, { status: 400 });
    }

    //! Gestione degli errori generali
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ vehicle: null, message: "Failed to update vehicle" }, { status: 500 });
  }
}

//! Handler DELETE per eliminare un veicolo
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //? Ottiene la sessione dell'utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    //? Risolve i parametri della route dinamica
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    //? Verifica la proprietà del veicolo
    const vehicle = await checkVehicleOwnership(id, session.user.id);

    if (vehicle === null) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle === false) {
      return NextResponse.json({ success: false, message: "You don't have permission to delete this vehicle" }, { status: 403 });
    }

    //? Elimina il veicolo dal database
    await db.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    //! Gestione degli errori
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ success: false, message: "Failed to delete vehicle" }, { status: 500 });
  }
}
