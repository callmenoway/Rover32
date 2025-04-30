//? Importazioni di React e componenti UI
import React from 'react';
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, ServerIcon, ShieldIcon, Database, MonitorIcon } from "lucide-react";

//? Componente principale della pagina di introduzione al tech stack
export default function TechStackIntroduction() {
    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Intestazione della pagina */}
                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <CodeIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Tech Stack</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Understanding the modern technologies powering the Rover32 application
                    </p>
                </div>

                {/* Card introduttiva */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <p className="text-lg mb-4">
                            The Rover32 web application leverages a modern tech stack to control an ESP32-based rover, 
                            featuring real-time camera streaming capabilities. Below is a detailed overview of the 
                            technologies employed and the reasoning behind each choice.
                        </p>
                        <p className="text-lg">
                            React, combined with TypeScript, provides a type-safe development environment that 
                            enhances code reliability and significantly improves user security by reducing potential 
                            vulnerabilities and preventing common attack vectors.
                        </p>
                    </CardContent>
                </Card>

                {/* Griglia delle sezioni tecnologiche principali */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {/* Card Backend */}
                    <Card className="p-4 text-center hover:shadow-md transition-all">
                        <ServerIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">Backend</h3>
                        <p className="text-sm text-muted-foreground">Server technologies</p>
                    </Card>
                    
                    {/* Card Frontend */}
                    <Card className="p-4 text-center hover:shadow-md transition-all">
                        <MonitorIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">Frontend</h3>
                        <p className="text-sm text-muted-foreground">UI technologies</p>
                    </Card>
                    
                    {/* Card ORM */}
                    <Card className="p-4 text-center hover:shadow-md transition-all">
                        <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">ORM</h3>
                        <p className="text-sm text-muted-foreground">Database technology</p>
                    </Card>
                    
                    {/* Card Authentication */}
                    <Card className="p-4 text-center hover:shadow-md transition-all">
                        <ShieldIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">Authentication</h3>
                        <p className="text-sm text-muted-foreground">0Auth and user authentication</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

//TODO Aggiungere tabelle comparative con altre tecnologie simili
//TODO Integrare diagrammi esplicativi dell'architettura
//TODO Aggiungere sezione performance e sicurezza