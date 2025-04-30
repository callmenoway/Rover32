import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod";

//? Schema Zod per la validazione dell'input
const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  ipAddress: z.string().min(1, "IP Address is required"),
});

//? Handler GET per ottenere tutti i veicoli dell'utente corrente
export async function GET() {
  try {
    //? Ottiene la sessione dell'utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ vehicles: [], message: "Unauthorized" }, { status: 401 });
    }

    //? Recupera tutti i veicoli dell'utente dal database
    const vehicles = await db.vehicle.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    //! Gestione degli errori
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ vehicles: [], message: "Failed to fetch vehicles" }, { status: 500 });
  }
}

//? Handler POST per creare un nuovo veicolo
export async function POST(req: Request) {
  try {
    //? Ottiene la sessione dell'utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ vehicle: null, message: "Unauthorized" }, { status: 401 });
    }

    //? Estrae e valida i dati dalla richiesta
    const body = await req.json();
    const { name, ipAddress } = vehicleSchema.parse(body);

    //? Crea un nuovo veicolo nel database
    const newVehicle = await db.vehicle.create({
      data: {
        name,
        ipAddress,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ vehicle: newVehicle, message: "Vehicle created successfully" });
  } catch (error) {
    //? Gestione specifica degli errori di validazione Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ vehicle: null, message: error.errors[0].message }, { status: 400 });
    }

    //! Gestione degli errori generali
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ vehicle: null, message: "Failed to create vehicle" }, { status: 500 });
  }
}

//TODO Implementare filtri avanzati per la ricerca
