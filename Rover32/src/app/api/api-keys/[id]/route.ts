import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

//! Handler DELETE per rimuovere una API key
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    //? Recupera la sessione utente dal server
    const session = await getServerSession(authOptions);

    //? Se l'utente non è autenticato, restituisce errore 401
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    //? Risolve i parametri (utile se params è una Promise)
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    //? Controlla se la API key esiste
    const apiKey = await db.apiKey.findUnique({
      where: { id },
    });

    //? Se la API key non esiste, restituisce errore 404
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "API key not found" }, { status: 404 });
    }

    //? Verifica che la API key appartenga all'utente autenticato
    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "You don't have permission to delete this API key" }, { status: 403 });
    }

    //! Elimina la API key dal database
    await db.apiKey.delete({
      where: { id },
    });

    //? Risposta di successo
    return NextResponse.json({ success: true, message: "API key deleted successfully" });
  } catch (error) {
    //! Gestione degli errori
    console.error("Error deleting API key:", error);
    return NextResponse.json({ success: false, message: "Failed to delete API key" }, { status: 500 });
  }
}
