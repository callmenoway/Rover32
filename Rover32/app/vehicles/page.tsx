import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VehicleList } from "@/components/vehicles/VehicleList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Key, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

//? Metadati della pagina per il SEO
export const metadata = {
  title: "Your Vehicles - Rover32",
  description: "View and manage your ESP32 vehicles",
};

export default async function VehiclesPage() {
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
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/vehicles/add" className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/api-keys" className="flex items-center">
              <Key className="mr-1 h-4 w-4" />
              Manage API Keys
            </Link>
          </Button>
        </div>
      </div>
      <VehicleList />
    </div>
  );
}
