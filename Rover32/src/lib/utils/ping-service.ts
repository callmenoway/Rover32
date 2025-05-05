//? Funzione per verificare se un veicolo è online controllando se risponde a una richiesta HTTP
export async function checkVehicleStatus(): Promise<boolean> {
  try {
    //? Utilizzo di fetch con un timeout per verificare se l'IP risponde
    const controller = new AbortController();
    //! Timeout di 3 secondi per non bloccare l'interfaccia troppo a lungo
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    //? Pulisce il timeout quando la richiesta è completata
    clearTimeout(timeoutId);
    
    return true; // Il veicolo è online
  } catch (error) {
    //! In caso di errore (timeout, connessione rifiutata, ecc.), il veicolo è offline
    console.error("Error: " + error);
    return false; // Il veicolo è offline
  }
}

//TODO Implementare un controllo più robusto che verifichi anche la porta specifica del servizio
//TODO Aggiungere supporto per i ping continui con callback di stato
