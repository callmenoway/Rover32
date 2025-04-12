import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientHome from "@/components/ClientHome";

export default async function HomePage() {
    const session = await getServerSession(authOptions);

    return <ClientHome session={session} />;
}