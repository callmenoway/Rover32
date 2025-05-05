import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//? Funzione di utilità per combinare nomi di classe in modo ottimale
//? Combina clsx (per condizioni) e tailwind-merge (per risoluzione conflitti classi Tailwind)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//? Funzione per formattare la data in un formato leggibile
export function formatDate(date: Date | string): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  //? Verifica se la data è valida
  if (isNaN(d.getTime())) return "Invalid date";
  
  //? Usa l'API Intl per formattare la data
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

//? Funzione di ritardo basata su Promise per uso con async/await
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//? Funzione per troncare il testo a una lunghezza specifica
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

//? Genera colori casuali nel formato esadecimale
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

//? Funzione per creare un'URL sicura
export function safeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const isSafe = ["http:", "https:"].includes(urlObj.protocol);
    return isSafe ? url : "";
  } catch (e) {
    console.error("Error: " + e);
    return "";
  }
}

//? Funzione di utilità per validare email (versione semplificata)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}
