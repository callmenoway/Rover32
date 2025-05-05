import React from 'react';
import { Card, CardContent } from "@/src/components/ui/card";
import { ServerCog } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";

export default function TechStackBackEnd() {
    return(
        <div className='container mx-auto py-10 px-4 md:px-6'>
            <div className='max-w-5xl mx-auto'></div>
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/techstack">Technology Stack</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Back-End</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <ServerCog className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Back-End</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The back-end is the part that handles everything behind the scenes, including servers, databases, and APIs.
                    </p>
                </div>

            <Card className='mb-8'>
                <CardContent className='p-6'>
                    <p className='text-lg mb-4'>
                        <a href={"https://nextjs.org/docs/app/building-your-application/routing/route-handlers"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Next.js Serverless
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        Serverless API functionality built into Next.js:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Route handlers: File-based API endpoints with minimal configuration</li>
                        <li>Edge runtime: Deploy to global edge network for low-latency responses</li>
                        <li>Serverless functions: Automatic scaling without managing servers</li>
                        <li>Full-stack integration: Seamless communication between frontend and backend</li>
                    </ul>

                    <p className='text-lg mb-4'>
                        <a href={"https://zod.dev"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Zod
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        Schema validation library for runtime type checking:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Type inference: Generated TypeScript types from schemas</li>
                        <li>Validation chains: Composable validation rules</li>
                        <li>Error messages: Detailed, customizable validation errors</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}