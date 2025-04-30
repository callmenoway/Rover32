"use client";

//? Importazioni di React e Next.js
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

//? Interfaccia delle props per il componente
interface MainNavProps {
  className?: string;
}

//? Componente di navigazione principale dell'applicazione
export function MainNav({ className }: MainNavProps) {
  //? Ottenimento del percorso attuale per evidenziare il link corrente
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {/* Link alla home page */}
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      
      {/* Link alla pagina dei veicoli */}
      <Link
        href="/vehicles"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/vehicles") ? "text-primary" : "text-muted-foreground"
        )}
      >
        Vehicles
      </Link>
      
      {/* Link alla documentazione */}
      <Link
        href="/docs"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/docs") ? "text-primary" : "text-muted-foreground"
        )}
      >
        Documentation
      </Link>
    </nav>
  );
}

//TODO Aggiungere supporto per dropdown menu nelle voci di navigazione
//TODO Implementare una versione mobile con menu hamburger
//TODO Aggiungere highlight animato per l'elemento attivo
