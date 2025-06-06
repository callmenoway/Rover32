"use client"

//? Importazioni da librerie e componenti
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/src/components/ui/navigation-menu"
import { cn } from "@/src/lib/utils"
import { Logo } from "@/src/components/ui/logo"
import { LogOut, Menu } from "lucide-react"
import * as React from "react"
import { useSession, SessionProvider, signOut } from "next-auth/react"
import { ThemeToggle } from "@/src/components/theme/ThemeToggle"
import LetterGlitch from '@/src/components/ui/LetterGlitch'
import SplitText from "@/src/components/ui/SplitText";

//? Componente wrapper che utilizza il SessionProvider
function HomeContent() {
  //? Ottiene lo stato della sessione utente
  const { status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleAnimationComplete = () => {

    console.log('All letters have animated!');

  };

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b shadow-sm px-4 py-2 bg-white dark:bg-gray-950 flex justify-between items-center z-10">
        <div className="flex md:hidden">
          <Logo className="h-8 w-8" />
        </div>
        
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Logo />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Rover32
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            ESP32 Rover Control Platform
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Learn how to set up your Rover32 system.
                    </ListItem>
                    <ListItem href="/docs/quickstart" title="Installation">
                      How to flash the firmware and connect the rover.
                    </ListItem>
                    <ListItem href="/docs/api" title="API Reference">
                      Statistics of vehicles and api calls.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/docs" className={navigationMenuTriggerStyle()}>
                  Documentation
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isLoading ? (
            //? Stato di caricamento della sessione
            <Button variant="outline" size="sm" disabled>Loading...</Button>
          ) : isAuthenticated ? (
            //? Utente autenticato: mostra pulsanti per gestire veicoli e logout
            <>
              <Link href="/vehicles" className="hidden sm:block">
                <Button variant="outline" size="sm">Manage Vehicles</Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => signOut({ callbackUrl: window.location.origin })}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            //? Utente non autenticato: mostra pulsante di login
            <Link href="/sign-in">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b shadow-sm p-4 z-10">
          <div className="flex flex-col space-y-2">
            <Link href="/docs" className="p-2 hover:bg-muted rounded-md">
              Getting Started
            </Link>
            <Link href="/docs" className="p-2 hover:bg-muted rounded-md">
              Documentation
            </Link>
            {isAuthenticated && (
              <Link href="/vehicles" className="p-2 hover:bg-muted rounded-md">
                Manage Vehicles
              </Link>
            )}
          </div>
        </div>
      )}

      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="relative w-full h-full">
          <LetterGlitch 
            glitchColors={['#2b4539', '#61dca3', '#61b3dc']} 
            glitchSpeed={50} 
            centerVignette={true} 
            outerVignette={false} 
            smooth={true} 
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SplitText

              text="Welcome to Rover32!"

              className="text-6xl md:text-8xl font-bold text-white dark:text-white tracking-wider"

              delay={100}

              duration={0.6}

              ease="power3.out"

              splitType="chars"

              from={{ opacity: 0, y: 40 }}

              to={{ opacity: 1, y: 0 }}

              threshold={0.1}

              rootMargin="-100px"

              textAlign="center"

              onLetterAnimationComplete={handleAnimationComplete}

            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
