"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo" // assicurati di avere questa o rimuoviamo il logo
import * as React from "react"

const components = [
  {
    title: "Control Interface",
    href: "/dashboard",
    description: "Drive and steer your ESP32 Rover in real-time from the browser.",
  },
  {
    title: "Live Camera",
    href: "/dashboard",
    description: "View the rover's onboard live camera feed.",
  },
  {
    title: "Custom Commands",
    href: "/dashboard",
    description: "Send low-level commands directly to the ESP32 board.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <nav className="border-b shadow-sm px-4 py-2 bg-white">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
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
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Learn how to set up your Rover32 system.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to flash the firmware and connect the rover.
                  </ListItem>
                  <ListItem href="/docs/api" title="API Reference">
                    Full control and camera streaming API.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
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

        {/* Sign In Button */}
        <div className="ml-auto mt-2 md:mt-0 md:absolute right-4 top-2">
          <Link href="/api/auth/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col flex-1 items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
          Rover32
        </h1>
        <p className="max-w-xl text-lg text-gray-600 mb-8">
          Control your ESP32 S3 CAM powered rover directly from your browser. Real-time camera feed, joystick control, and much more!
        </p>
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      </main>
    </div>
  )
}

// Utility ListItem for NavigationMenu
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
