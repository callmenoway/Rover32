"use client"

//? Importazioni delle icone e componenti
import { Home, Layers, KeyRound, FileSearch, FileCode2, Cpu, Microchip, MonitorSmartphone, ServerCog, Database, Braces, ChevronDown, ChevronRight, Sun, Moon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/src/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { useState } from "react"
import { useTheme } from "@/src/hooks/use-theme"
import { Button } from "@/src/components/ui/button"

//? Definizione delle voci di menu della sidebar
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Basics",
    url: "/docs",
    icon: FileSearch,
  },
  {
    title: "Techstack",
    icon: Layers,
    subItems: [
      { title: "Introduction", url: "/docs/techstack/introduction", icon: FileCode2},
      { title: "Core Framework", url: "/docs/techstack/core-framework", icon: Braces},
      { title: "Front-End", url: "/docs/techstack/front-end", icon: MonitorSmartphone },
      { title: "Back-End", url: "/docs/techstack/back-end", icon: ServerCog },
      { title: "Authentication", url: "/docs/techstack/authentication", icon:  KeyRound },
      { title: "ORM", url: "/docs/techstack/orm", icon:  Database },
    ]
  },
  {
    title: "Hardware",
    icon: Cpu,
    subItems: [
      { title: "Components", url: "/docs/hardware/components", icon: Microchip },
      { title: "Schematics", url: "/docs/hardware/schematics", icon: Microchip },
      { title: "Assembly", url: "/docs/hardware/assembly", icon: Microchip },
    ]
  },
]

//? Componente principale per la sidebar dell'applicazione
export function AppSidebar() {
  //? Stato per tenere traccia delle sezioni aperte/chiuse
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  //? Hook per gestire il tema (chiaro/scuro)
  const { theme, toggleTheme } = useTheme();

  //? Funzione per aprire/chiudere una sezione
  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rover32 Docs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {!item.subItems ? (
                    //? Voce di menu senza sottomenu
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  ) : (
                    //? Voce di menu con sottomenu collassabile
                    <Collapsible
                      open={openSections[item.title]}
                      onOpenChange={() => toggleSection(item.title)}
                    >
                      <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-muted rounded-md gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {openSections[item.title] ?
                          <ChevronDown className="h-4 w-4 ml-auto" /> :
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        }
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pt-1">
                        {item.subItems.map(subItem => (
                          <SidebarMenuButton key={subItem.title} asChild className="my-1">
                            <a href={subItem.url}>
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="ml-auto"
          title={theme === 'light' ? 'Passa alla modalità scura' : 'Passa alla modalità chiara'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">Cambia tema</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
