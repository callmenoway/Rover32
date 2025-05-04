import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ApiKeyList } from "@/src/components/api-keys/ApiKeyList";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";

//? Metadati della pagina per il SEO
export const metadata = {
  title: "API Keys - Rover32",
  description: "Manage your Rover32 API keys",
};

export default async function ApiKeysPage() {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //! Protezione della rotta: reindirizza se l'utente non è autenticato
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vehicles" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Vehicles
          </Link>
        </Button>
        
        <ThemeToggle />
      </div>
      <ApiKeyList />
    </div>
  );
}
