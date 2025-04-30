import { PrismaClient } from "@prisma/client";

//? Dichiarazione globale per estendere il namespace NodeJS
declare global {
  //? Estende l'interfaccia NodeJS.Global per includere prisma
  var prisma: PrismaClient | undefined;
}

//? Esportazione dell'istanza di Prisma Client
//! Usiamo globalThis per evitare di creare nuove istanze durante l'hot reloading in sviluppo
export const db = globalThis.prisma || new PrismaClient();

//? In ambiente di sviluppo, mantieni l'istanza nell'oggetto globale per evitare connessioni multiple
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

//TODO Implementare logging personalizzato delle query
//TODO Aggiungere middleware Prisma per tracciamento delle performance
//TODO Configurare gestione centralizzata degli errori del database