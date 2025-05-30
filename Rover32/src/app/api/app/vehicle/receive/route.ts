import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import * as z from 'zod';

//? Schema di validazione dei dati ricevuti dal client
const vehicleReceiveSchema = z.object({
    apiKey: z.string().min(1, 'API key is required'), //? Chiave API obbligatoria
    macAddress: z.string().min(1, 'MAC address is required'), //? MAC obbligatorio
    date: z.string().optional(), //? Data opzionale in formato 'YYYY-MM-DD'
    uptimeHours: z.number().min(0, 'Uptime hours must be a positive number'), //? Ore di uptime >= 0
    controlHours: z.number().min(0, 'Control hours must be a positive number'), //? Ore di controllo >= 0
    kilometersDriven: z.number().min(0, 'Kilometers driven must be a positive number'), //? Km percorsi >= 0
});

export async function POST(req: Request) {
    try{
        const body = await req.json();
        //? Parsing e validazione del body tramite Zod
        const { apiKey, macAddress, date, uptimeHours, controlHours, kilometersDriven } = vehicleReceiveSchema.parse(body);

        //? Parsing della data: se fornita, viene creata come UTC midnight, altrimenti si usa la data attuale
        let statsDate;
        if (date) {
            statsDate = new Date(date + 'T00:00:00.000Z'); //? Data fornita, forzata a mezzanotte UTC
        } else {
            statsDate = new Date();
            statsDate = new Date(Date.UTC(
                statsDate.getFullYear(),
                statsDate.getMonth(),
                statsDate.getDate()
            )); //? Data attuale, forzata a mezzanotte UTC
        }

        console.log(`Parsed date: ${statsDate.toISOString()}`);
        console.log(`Date string: ${date}`);
        console.log(`Local date: ${statsDate.toString()}`);

        //? Verifica che la chiave API esista e recupera l'utente associato
        const apiKeyRecord = await db.apiKey.findUnique({
            where: { key: apiKey },
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!apiKeyRecord) {
            //! API key non valida
            return NextResponse.json(
            { success: false, message: "Unauthorized: Invalid API key" },
            { status: 401 }
            );
        }

        //? Cerca il veicolo tramite MAC e verifica che appartenga all'utente della chiave API
        const vehicle = await db.vehicle.findFirst({
            where: { 
                macAddress: macAddress,
                userId: apiKeyRecord.user.id
            }
        });

        if(!vehicle) {
            //! Veicolo non trovato o non associato all'utente
            return NextResponse.json(
                { success: false, message: "Unauthorized: Vehicle not found or does not belong to this user" },
                { status: 401 }
            );
        }

        //? Aggiorna il timestamp dell'ultimo utilizzo della chiave API
        await db.apiKey.update({
            where: { id: apiKeyRecord.id },
            data: { lastUsed: new Date() }
        });

        //? Log di debug
        console.log(`Processing request for vehicle: ${vehicle.id}`);
        console.log(`Date: ${statsDate.toISOString()}`);
        console.log(`Stats to add: Uptime=${uptimeHours}, Control=${controlHours}, KM=${kilometersDriven}`);

        //? Aggiorna i totali del veicolo
        await db.vehicle.update({
            where: { id: vehicle.id },
            data: {
                uptimeHours: { increment: uptimeHours },
                controlHours: { increment: controlHours },
                kilometersDriven: { increment: kilometersDriven }
            }
        });
        console.log("Vehicle total stats updated successfully");

        try {
            //? Verifica se esiste già un record stats per questa data
            console.log("Checking for existing stats record...");
            const existingStats = await db.vehicleStats.findFirst({
                where: {
                    vehicleId: vehicle.id,
                    date: statsDate
                }
            });
            console.log("Existing stats check completed:", existingStats ? "Found" : "Not found");

            if (existingStats) {
                //? Aggiorna il record esistente
                console.log(`Updating existing stats record ID: ${existingStats.id}`);
                await db.vehicleStats.update({
                    where: {
                        id: existingStats.id
                    },
                    data: {
                        uptimeHours: { increment: uptimeHours },
                        controlHours: { increment: controlHours },
                        kilometersDriven: { increment: kilometersDriven },
                        updatedAt: new Date()
                    }
                });
                console.log("Existing stats record updated successfully");
            } else {
                //? Crea un nuovo record stats
                console.log("Creating new stats record");
                const newStats = await db.vehicleStats.create({
                    data: {
                        vehicleId: vehicle.id,
                        date: statsDate,
                        uptimeHours,
                        controlHours,
                        kilometersDriven
                    }
                });
                console.log(`New stats record created with ID: ${newStats?.id || 'unknown'}`);
            }
        } catch (statsError) {
            //! Errore nella gestione delle stats giornaliere, ma si continua comunque
            console.error("Error handling vehicle stats:", statsError);
            console.error("Error details:", JSON.stringify(statsError, null, 2));
        }

        //? Log finale dell'operazione
        console.log(`Updated stats for vehicle ${vehicle.id} on date ${statsDate.toISOString().split('T')[0]}`);

        return NextResponse.json({
            success: true,
            message: "Vehicle stats updated successfully"
        });

    } catch (error) {
        //! Gestione errori generici e di validazione
        console.error("Vehicle stats update error:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        //? Gestione errori di validazione Zod
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, message: error.errors[0].message },
                { status: 400 }
            );
        }
        
        //? Gestione errori generici
        console.error("Vehicle stats update error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
