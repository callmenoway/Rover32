import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/src/components/form/SignInForm"; 
import { authOptions } from "@/src/lib/auth";

//? Componente principale della pagina di accesso
export default async function SignInPage() {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);
  
  //! Se l'utente è già loggato, reindirizza alla pagina dei veicoli
  if (session) {
    redirect("/vehicles");
  }
  
  // Renderizza direttamente il componente SignInForm senza wrapper aggiuntivi
  return <SignInForm />;
}

//TODO Implementare recupero password
//TODO Aggiungere opzione "ricordami" per sessioni più lunghe