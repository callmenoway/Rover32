import React from 'react';
import { Card, CardContent } from "@/src/components/ui/card";
import { Braces } from "lucide-react";

export default function TechStackFrontEnd() {
    return(
        <div className='container mx-auto py-10 px-4 md:px-6'>
            <div className='max-w-5xl mx-auto'>
                <div className="space-y-4 text-center mb-12">
                    <div className="inline-block p-2 bg-primary/10 rounded-full">
                        <Braces className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Front-End</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The front-end focuses on designing the visual elements of a website or application, including layout, colors, typography, and interactive components
                    </p>
                </div>

            <Card className='mb-8'>
                <CardContent className='p-6'>
                    <p className='text-lg mb-4'>
                        <a href={"https://react.dev"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            React
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                    React is the UI library that powers the interactive components. It uses a component-based architecture where UI elements are modular and reusable. This architecture was released at least a year ago and today is the best way to render a page.
                    </p>

                    <p className='text-lg mb-4'>
                        <a href={"https://www.typescriptlang.org"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            TypeScript
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        TypeScript adds static type-checking to JavaScript, enhancing code quality and developer experience:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Type safety: Catches errors during development rather than runtime</li>
                        <li>Better IDE support: Intelligent code completion and documentation</li>
                        <li>Easier refactoring: Types make large-scale changes safer</li>
                    </ul>

                    <p className='text-lg mb-4'>
                        <a href={"https://tailwindcss.com"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Tailwind CSS
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        Tailwind is a utility-first CSS framework that allows styling directly in markup:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                            <li>Rapid development: Pre-defined utility classes speed up UI implementation</li>
                            <li>Consistency: Standardized design tokens for spacing, colors, etc.</li>
                            <li>Responsive design: Built-in responsive utilities</li>
                            <li>Minimal CSS output: Only includes used styles</li>
                    </ul>

                    <h2 className='text-2xl font-bold mb-4'>
                        UI Component Libraries
                    </h2>

                    <p className='text-lg mb-4'>
                        <a href={"https://ui.shadcn.com"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            shadcn/ui
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        A collection of reusable, accessible UI components built with Tailwind CSS and Radix UI:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Customizable: Components that can be copied and modified directly in your project</li>
                        <li>Accessibility: Built on accessible primitives from Radix UI</li>
                        <li>No external dependencies: Components are added directly to your codebase</li>
                    </ul>
                    <p className='text-lg mb-4'>
                        <a href={"https://www.radix-ui.com"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Radix UI
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        Provides unstyled, accessible UI primitives:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>React-label: Accessible label components</li>
                        <li>React-navigation-menu: Navigation components</li>
                        <li>React-slot: Utility for component composition</li>
                        <li>React-toast: Toast notification system</li>
                        <li>React-collapsible: Expandable/collapsible content sections with animations</li>
                        <li>React-tooltip: Contextual information displayed on hover or focus</li>
                        <li>React-dialog: Modal dialog windows with accessibility features</li>
                    </ul>

                    <p className='text-lg mb-4'>
                        <a href={"https://lucide.dev/guide/packages/lucide-react"} style={{ color: '#0044ff', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Lucide React
                        </a>
                    </p>

                    <p className='text-lg mb-4'>
                        A library of simple, consistent SVG icons:
                    </p>

                    <ul className="list-disc pl-6 text-lg mb-4 space-y-2">
                        <li>Small bundle size: Optimized SVGs reduce page weight</li>
                        <li>Customizable: Easy styling via props</li>
                    </ul>
                </CardContent>
            </Card>

            </div>
        </div>
    );
}