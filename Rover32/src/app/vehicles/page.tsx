import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import VehiclesPageClient from "@/src/components/vehicles/VehiclesPageClient";

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

  return <VehiclesPageClient />;
}
