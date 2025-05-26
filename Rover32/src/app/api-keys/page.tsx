import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import ApiKeysPageClient from "@/src/components/api-keys/ApiKeysPageClient";

//?metadati della pagina per il SEO
export const metadata = {
  title: "API Keys - Rover32",
  description: "Manage your Rover32 API keys",
};

export default async function ApiKeysPage() {
  //?ottiene la sessione dell'utente dal server
  const session = await getServerSession(authOptions);

  //!protezione della rotta: reindirizza se l'utente non è autenticato
  if (!session?.user) {
    redirect("/sign-in");
  }

  return <ApiKeysPageClient />;
}
