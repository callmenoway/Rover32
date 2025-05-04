import React from 'react';
import { Card, CardContent } from "@/src/components/ui/card";
import { Braces } from "lucide-react";

export default function TechStackCoreFramework() {
    return(
        <div className='container mx-auto py-10 px-4 md:px-6'>
            <div className='max-w-5xl mx-auto'>
                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <Braces className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Core Framework</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Framework of the full-stack application
                    </p>
                </div>

            <Card className='mb-8'>
                <CardContent className='p-6'>
                    <p className='text-lg mb-4'>
                    Next.js serves as the foundation of the application,
                    providing a robust React framework with built-in server-side
                    rendering, API routes, and routing capabilities. It was chosen for:
                    </p>
                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Server-side rendering: Improves initial load performance and SEO (server engine optimization)</li>
                        <li>App Router: File Base Routing specifically with App Routing, because server side rendering is more optimized than Pages Routing system</li>
                        <li>API Routes: Backend functionality without separate server setup</li>
                        <li>TypeScript integration: Strong typing system to reduce bugs</li>
                        <li>Nested Layouts: Improves performance because if you are using same components in more pages, it render only one time instead of rendering every time the entire page</li>
                        <li>Caching: With server-side rendering Next.Js implements caching from the server side. This help a lot because the user can't modify what is cached so it also improve security</li>
                    </ul>
                    <p className='text-lg mb-4'>
                        You can find all this optimized feautures at {" "}
                        <a href={"https://nextjs.org/docs/pages/building-your-application/optimizing"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Next.Js Docs
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>

            </div>
        </div>
    );
}