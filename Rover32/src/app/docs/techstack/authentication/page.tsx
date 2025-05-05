import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { KeyRound } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";

export default function TechStackAuthentication() {
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
                            <BreadcrumbPage>Authentication</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <KeyRound className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Authentication</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Authentication is the process of verifying user identity, ensuring that only authorized individuals can access protected resources in our application.
                    </p>
                </div>

            <Card className='mb-8 dark:bg-gray-800 dark:border-gray-700'>
                <CardContent className='p-6'>
                    <p className='text-lg mb-4'>
                        <a href={"https://next-auth.js.org"} className="text-blue-600 dark:text-blue-400 font-bold underline">
                            NextAuth
                        </a>
                    </p>

                    <p className='text-lg mb-4 dark:text-gray-300'>
                        Authentication solution with built-in providers:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2 dark:text-gray-300">
                        <li>Multiple providers: Support for OAuth (Google, GitHub, Discord)</li>
                        <li>Credential authentication: Username/password login</li>
                        <li>JWT sessions: Secure, stateless authentication</li>
                        <li>Database integration: Works with Prisma for user storage</li>
                    </ul>

                    <p className='text-lg mb-4'>
                        <a href={"https://www.npmjs.com/package/bcryptjs-react"} className="text-blue-600 dark:text-blue-400 font-bold underline">
                            Bcrypt
                        </a>
                    </p>

                    <p className='text-lg mb-4 dark:text-gray-300'>
                        Password hashing library:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2 dark:text-gray-300">
                        <li>Secure hashing: Industry-standard password security</li>
                        <li>Salt-round: Configurable work factor for future-proofing</li>
                        <li>Async support: Non-blocking passowrd operations</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}