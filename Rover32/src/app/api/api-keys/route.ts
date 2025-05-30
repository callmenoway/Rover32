import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import * as z from "zod";
import { generateApiKey } from "@/src/lib/utils/api-key";

//? Schema di validazione per la creazione di una API key
const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
});

//? Handler GET per elencare tutte le API key dell'utente corrente
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    //! Se l'utente non è autenticato, restituisce 401
    if (!session?.user?.id) {
      return NextResponse.json({ apiKeys: [], message: "Unauthorized" }, { status: 401 });
    }

    //? Recupera tutte le API key dell'utente, ordinate per data di creazione (descrescente)
    const apiKeys = await db.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        //? Non restituisce la chiave vera e propria per motivi di sicurezza
      }
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    //! Gestione errori durante il recupero delle API key
    console.error("Error fetching API keys:", error);
    return NextResponse.json({ apiKeys: [], message: "Failed to fetch API keys" }, { status: 500 });
  }
}

//? Handler POST per creare una nuova API key
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    //! Se l'utente non è autenticato, restituisce 401
    if (!session?.user?.id) {
      return NextResponse.json({ apiKey: null, message: "Unauthorized" }, { status: 401 });
    }

    //? Parsing e validazione del body della richiesta
    const body = await req.json();
    const { name } = apiKeySchema.parse(body);

    //? Genera una nuova API key sicura
    const apiKeyValue = generateApiKey();

    //? Salva la nuova API key nel database
    const apiKey = await db.apiKey.create({
      data: {
        key: apiKeyValue,
        name,
        userId: session.user.id,
      },
    });

    //? Restituisce la chiave appena creata (solo in questo momento viene mostrata all'utente)
    return NextResponse.json({
      apiKey: {
        id: apiKey.id,
        key: apiKeyValue,
        name: apiKey.name,
        createdAt: apiKey.createdAt
      },
      message: "API key created successfully"
    });
  } catch (error) {
    //! Gestione errori di validazione (Zod)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ apiKey: null, message: error.errors[0].message }, { status: 400 });
    }
    
    //! Gestione errori generici durante la creazione della API key
    console.error("Error creating API key:", error);
    return NextResponse.json({ apiKey: null, message: "Failed to create API key" }, { status: 500 });
  }
}
