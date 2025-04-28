import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/form/SignInForm"; // Import nominale
import { authOptions } from "@/lib/auth";

//? Componente principale della pagina di accesso
export default async function SignInPage() {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //! Se l'utente è già loggato, reindirizza alla pagina dei veicoli
  if (session) {
    redirect("/vehicles");
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>
      <SignInForm />
    </div>
  );
}

//TODO Implementare recupero password
//TODO Aggiungere opzione "ricordami" per sessioni più lunghe