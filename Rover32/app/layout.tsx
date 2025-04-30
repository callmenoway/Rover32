//? Importazione del font Inter da Google Fonts
import { Inter } from "next/font/google";
import "./globals.css";

//? Configurazione del font Inter con il sottoinsieme latino
const inter = Inter({ subsets: ["latin"] });

//? Metadati globali dell'applicazione per SEO
export const metadata = {
  title: "Rover32",
  description: "ESP32-based vehicle control platform",
};

//? Layout principale dell'applicazione che avvolge tutte le pagine
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

//TODO Aggiungere provider per tema chiaro/scuro
//TODO Implementare caricamento condizionale di script e SEO avanzato
