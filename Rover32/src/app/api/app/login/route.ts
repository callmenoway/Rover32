import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import * as z from "zod";

//? Schema per validare la richiesta di login
const loginSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export async function POST(req: Request) {
  try {
    //? Parsing e validazione del body della richiesta
    const body = await req.json();
    const { apiKey } = loginSchema.parse(body);

    //? Ricerca della API key nel database
    const apiKeyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            username: true,
            vehicles: {
              select: {
                name: true,
                ipAddress: true,
                macAddress: true
              }
            }
          }
        }
      }
    });

    //! Se la API key non esiste, ritorna 401 Unauthorized
    if (!apiKeyRecord) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid API key" },
        { status: 401 }
      );
    }

    //? Aggiorna il timestamp dell'ultimo utilizzo della API key
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsed: new Date() }
    });

    //? Ritorna i dati dell'utente con i veicoli associati
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: apiKeyRecord.user
    });
  } catch (error) {
    //! Gestione degli errori di validazione Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    //! Gestione di altri errori generici
    console.error("API login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
