import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { VehicleForm } from "@/src/components/vehicles/VehicleForm";
import { db } from "@/src/lib/db";
import { notFound } from "next/navigation";

//? Metadati della pagina per il SEO
export const metadata = {
  title: "Edit Vehicle - Rover32",
  description: "Edit your ESP32 vehicle settings",
};

//? Modifica veicolo
export default async function EditVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  //? Ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //! Protezione della rotta: reindirizza se l'utente non è autenticato
  if (!session?.user) {
    redirect("/sign-in");
  }

  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  //? Recupera i dati del veicolo dal database
  const vehicle = await db.vehicle.findUnique({
    where: { id },
  });

  //! Se il veicolo non esiste, mostra la pagina 404
  if (!vehicle) {
    notFound();
  }

  //! Controlla che il veicolo appartenga all'utente corrente
  if (vehicle.userId !== session.user.id) {
    redirect("/vehicles");
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">Edit Vehicle</h1>
      <VehicleForm vehicle={vehicle} isEdit />
    </div>
  );
}
