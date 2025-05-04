import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

//? Handler GET per ottenere lo stato online di un veicolo
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //? Ottiene la sessione dell'utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica l'autenticazione dell'utente
    if (!session?.user?.id) {
      return NextResponse.json({ status: "unknown", message: "Unauthorized" }, { status: 401 });
    }

    //? Risolve i parametri della route dinamica
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    //? Cerca il veicolo nel database
    const vehicle = await db.vehicle.findUnique({
      where: { id },
    });

    //? Se il veicolo non esiste, restituisce 404
    if (!vehicle) {
      return NextResponse.json({ status: "unknown", message: "Vehicle not found" }, { status: 404 });
    }

    //! Verifica che il veicolo appartenga all'utente corrente
    if (vehicle.userId !== session.user.id) {
      return NextResponse.json({ status: "unknown", message: "You don't have permission to access this vehicle" }, { status: 403 });
    }

    //* Per scopi di test, considera sempre online l'indirizzo 127.0.0.1
    if (vehicle.ipAddress === '127.0.0.1') {
      return NextResponse.json({ status: "online", ipAddress: vehicle.ipAddress });
    }

    //? Verifica effettiva della connettività al veicolo
    try {
      const controller = new AbortController();
      //? Timeout breve per una migliore UX
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      //? URL di default per la connessione sulla porta 80
      const url = `http://${vehicle.ipAddress}`;

      //? Tentativo di connessione con timeout
      const response = await fetch(url, {
        method: 'HEAD', //? Usa HEAD perché più leggero di GET
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      //* Ping riuscito, il veicolo è online
      return NextResponse.json({ status: "online", ipAddress: vehicle.ipAddress });
    } catch (error) {
      //? Non loggare AbortError perché è un comportamento previsto
      if (error instanceof DOMException && error.name === 'AbortError') {
        //? Considera silenziosamente il veicolo come offline
      } else {
        //! Logga solo errori inaspettati
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Could not connect to ${vehicle.ipAddress}:`, errorMessage);
      }
      return NextResponse.json({ status: "offline", ipAddress: vehicle.ipAddress });
    }
  } catch (error) {
    //! Gestione degli errori generali
    console.error("Error checking vehicle status:", error);
    return NextResponse.json({ status: "unknown", message: "Failed to check vehicle status" }, { status: 500 });
  }
}

//TODO Implementare un endpoint per controllo periodico dello stato con WebSockets
//TODO Aggiungere endpoint per aggiornare lo stato del veicolo dal dispositivo stesso
