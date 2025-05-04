import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
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
    // Now that we've migrated the database, include all fields
    const vehicles = await db.vehicle.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        ipAddress: true,
        macAddress: true,  // Include the MAC address
        uptimeHours: true,
        controlHours: true,
        kilometersDriven: true,
        createdAt: true,
        updatedAt: true
      },
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

    // Verifica che l'utente esista nel database
    const userExists = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ 
        vehicle: null, 
        message: "User not found in database" 
      }, { status: 404 });
    }

    //? Estrae e valida i dati dalla richiesta
    const body = await req.json();
    const { name, ipAddress, macAddress } = vehicleSchema.parse(body);

    //? Crea un nuovo veicolo nel database
    const newVehicle = await db.vehicle.create({
      data: {
        name,
        ipAddress,
        macAddress,
        userId: session.user.id,
        // Initialize the new fields with default values
        uptimeHours: 0,
        controlHours: 0,
        kilometersDriven: 0
      },
    });

    return NextResponse.json({ vehicle: newVehicle, message: "Vehicle created successfully" });
  } catch (error) {
    //? Gestione specifica degli errori di validazione Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ vehicle: null, message: error.errors[0].message }, { status: 400 });
    }

    // Check for Prisma foreign key constraint error
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({ 
        vehicle: null, 
        message: "Failed to create vehicle: Invalid user association" 
      }, { status: 400 });
    }

    // Check for Prisma unique constraint error (likely duplicate MAC address)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      const target = (error as any).meta?.target;
      if (target && target.includes('macAddress')) {
        return NextResponse.json({ 
          vehicle: null, 
          message: "MAC address already exists" 
        }, { status: 400 });
      }
    }

    //! Gestione degli errori generali
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ vehicle: null, message: "Failed to create vehicle" }, { status: 500 });
  }
}

//TODO Implementare filtri avanzati per la ricerca
