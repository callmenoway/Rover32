//? Definizione del tipo User che rappresenta un utente dell'applicazione
export type User = {
  id: string;         // Identificatore univoco dell'utente
  name: string;       // Nome completo dell'utente
  email: string;      // Indirizzo email dell'utente (usato per l'autenticazione)
  createdAt: string;  // Data di creazione dell'account (formato ISO string)
  updatedAt: string;  // Data dell'ultimo aggiornamento del profilo (formato ISO string)
}

//? Definizione del tipo Vehicle che rappresenta un veicolo controllabile
export type Vehicle = {
  id: string;                 // Identificatore univoco del veicolo
  name: string;               // Nome personalizzato del veicolo
  ipAddress: string;          // Indirizzo IP per la connessione al veicolo
  macAddress?: string;        // Indirizzo MAC del veicolo per identificazione univoca
  userId: string;             // ID dell'utente proprietario del veicolo
  createdAt: string | Date;   // Data di aggiunta del veicolo
  updatedAt: string | Date;   // Data dell'ultimo aggiornamento delle informazioni
}

//? Definizione degli stati possibili di un veicolo
export type VehicleStatus = "online" | "offline" | "unknown";

//TODO Aggiungere tipi per i dati dei sensori del veicolo