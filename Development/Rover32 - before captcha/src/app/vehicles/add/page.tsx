import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { VehicleForm } from "@/src/components/vehicles/VehicleForm";

//? Metadati della pagina per il SEO
export const metadata = {
  title: "Add Vehicle - Rover32",
  description: "Add a new ESP32 vehicle to your collection",
};

export default async function AddVehiclePage() {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //! Protezione della rotta: reindirizza se l'utente non è autenticato
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">Add New Vehicle</h1>
      <VehicleForm />
    </div>
  );
}
