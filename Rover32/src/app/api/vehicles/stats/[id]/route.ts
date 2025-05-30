import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

//? Funzione handler per la richiesta GET delle statistiche del veicolo
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //? Ottieni la sessione utente dal server
    const session = await getServerSession(authOptions);

    //! Verifica che l'utente sia autenticato
    if (!session?.user?.id) {
      return NextResponse.json({ stats: [], message: "Unauthorized" }, { status: 401 });
    }

    //? Risolvi i parametri della richiesta
    const resolvedParams = await Promise.resolve(params);
    const vehicleId = resolvedParams.id;

    //! Verifica che il veicolo appartenga all'utente
    const vehicle = await db.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: session.user.id
      }
    });

    //! Se il veicolo non esiste o non appartiene all'utente, restituisci errore
    if (!vehicle) {
      return NextResponse.json({ stats: [], message: "Vehicle not found or access denied" }, { status: 404 });
    }

    //? Estrai il parametro 'days' dalla query string, default a 90 giorni
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '90');
    
    //? Calcola l'intervallo di date da considerare
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    //? Recupera le statistiche del veicolo nell'intervallo di date
    const stats = await db.vehicleStats.findMany({
      where: {
        vehicleId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    //? Formatto le statistiche per il grafico (YYYY-MM-DD)
    interface VehicleStat {
      date: Date;
      uptimeHours: number;
      controlHours: number;
    }

    interface FormattedStat {
      date: string;
      uptime: number;
      control: number;
    }

    const formattedStats: FormattedStat[] = stats.map((stat: VehicleStat): FormattedStat => ({
      date: stat.date.toISOString().split('T')[0], //? Formatta la data
      uptime: stat.uptimeHours,
      control: stat.controlHours
    }));

    //? Riempio le date mancanti con valori a zero
    const filledStats = fillMissingDates(formattedStats, startDate, endDate);

    //? Restituisco la risposta con le statistiche
    return NextResponse.json({ stats: filledStats });
  } catch (error) {
    //! Gestione degli errori generici
    console.error("Error fetching vehicle stats:", error);
    return NextResponse.json({ stats: [], message: "Failed to fetch vehicle stats" }, { status: 500 });
  }
}

//? Funzione helper per riempire le date mancanti con valori a zero
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fillMissingDates(stats: any[], startDate: Date, endDate: Date) {
  const dateMap = new Map();
  
  //? Mappa le date già presenti nelle statistiche
  stats.forEach(stat => {
    dateMap.set(stat.date, stat);
  });
  
  const filledStats = [];
  const currentDate = new Date(startDate);
  
  //? Cicla ogni giorno nell'intervallo
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    //? Usa la statistica esistente o crea una nuova con valori a zero
    if (dateMap.has(dateStr)) {
      filledStats.push(dateMap.get(dateStr));
    } else {
      filledStats.push({
        date: dateStr,
        uptime: 0,
        control: 0
      });
    }
    
    //? Passa al giorno successivo
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return filledStats;
}
