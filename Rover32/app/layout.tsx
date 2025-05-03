//? Importazione del font Inter da Google Fonts
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/use-toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

//TODO Implementare caricamento condizionale di script e SEO avanzato
