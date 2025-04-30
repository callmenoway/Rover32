import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function TechStackOrm() {
    return(
        <div className='container mx-auto py-10 px-4 md:px-6'>
            <div className='max-w-5xl mx-auto'>
                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <Database className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Authentication</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Authentication is the process of verifying user identity, ensuring that only authorized individuals can access protected resources in our application.
                    </p>
                </div>
                
                <Card className='mb-8'>
                    <CardContent className='p-6'>
                        <p className='text-lg mb-4'>
                            <a href={"https://www.prisma.io"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                                Prisma
                            </a>
                        </p>

                        <p className='text-lg mb-4'>
                            Modern ORM (object relational mapping) for database access:
                        </p>

                        <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                            <li>Typr safety: Generated TypeScript types based on your schema</li>
                            <li>Migrations: Automated database schema migrations</li>
                            <li>Query building: Intuitive API for database operations</li>
                            <li>Multiple databases: Works with PostgreSQL, MySQL, SQlite, etc...</li>
                        </ul>

                        <p className='text-lg mb-4'>
                            <a href={"https://supabase.com"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                                Supabase
                            </a>
                        </p>

                        <p className='text-lg mb-4'>
                            Supabase is a PostgreSQL-based database with an integrated connection to Prisma library:
                        </p>

                        <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                            <li>PostgreSQL foundation: Full relational database session handling</li>
                            <li>Built-in authentication: User management and session handling</li>
                            <li>Real-time subsriptions: Live data update via WebSockets</li>
                            <li>Storage soltions: File and image hosting for rover assets</li>
                            <li>Row-level security: Fine-grainded access control</li>
                            <li>Serverless functions: Edge functions for custom backend logic</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
