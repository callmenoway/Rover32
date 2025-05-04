import { ReactNode } from "react";

//? Interfaccia che definisce le proprietà accettate dal componente EmptyState
interface EmptyStateProps {
  title: string;        // Titolo principale mostrato nello stato vuoto
  description: string;  // Descrizione dettagliata dello stato vuoto
  action?: ReactNode;   // Elemento React opzionale per un'azione (es. un pulsante)
  icon?: ReactNode;     // Icona opzionale da mostrare
}

//? Componente che mostra uno stato vuoto/iniziale con possibili azioni
export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed space-y-4">
      {icon && <div className="mx-auto">{icon}</div>}

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

//TODO Aggiungere varianti di stile (success, warning, error)
//TODO Implementare animazioni opzionali per migliorare l'esperienza utente
