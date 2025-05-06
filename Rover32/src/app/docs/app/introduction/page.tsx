"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";
import { ArrowRight, Monitor, Cpu, Radio, Layers } from "lucide-react";

export default function AppDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <BreadcrumbPage>App</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Introduction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center mb-8 gap-3">
        <Monitor className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">RoverClient Application</h1>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md mb-8 border-l-4 border-blue-500">
        <p className="text-blue-800 dark:text-blue-300">
          RoverClient is a cross-platform Flutter desktop application designed to control the Rover32 
          robot remotely using direct TCP socket communication and real-time video streaming.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Documentation Sections</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Layers className="h-5 w-5 mr-2 text-blue-500" />
              Overview
            </CardTitle>
            <CardDescription>Architecture and system components</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm dark:text-gray-300">
              Learn about the application&apos;s architecture, its components, and how they interact with the Rover32 hardware.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/docs/app/overview" className="flex items-center justify-between">
                View Details <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Monitor className="h-5 w-5 mr-2 text-blue-500" />
              User Interface
            </CardTitle>
            <CardDescription>App layout and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm dark:text-gray-300">
              Explore the user interface components and learn how to navigate and control your Rover32 effectively.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/docs/app/interface" className="flex items-center justify-between">
                View Details <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Radio className="h-5 w-5 mr-2 text-blue-500" />
              Communication
            </CardTitle>
            <CardDescription>TCP socket protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm dark:text-gray-300">
              Deep dive into the communication protocols, data formats, and socket connections that power the app.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="https://learn.microsoft.com/en-us/windows/win32/winsock/tcp-ip-raw-sockets-2" className="flex items-center justify-between">
                View Details <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Cpu className="h-5 w-5 mr-2 text-blue-500" />
              Configuration
            </CardTitle>
            <CardDescription>Setup and requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm dark:text-gray-300">
              Get information about setup requirements, configuration options, and compatibility.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/docs/quickstart" className="flex items-center justify-between">
                View Details <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
        <li><strong>Cross-Platform Desktop App:</strong> Built with Flutter for Windows, macOS, and Linux</li>
        <li><strong>Direct TCP Communication:</strong> Low-latency control and video streaming</li>
        <li><strong>Real-Time Video:</strong> Live camera feed from the rover with efficient JPEG processing</li>
        <li><strong>Intuitive Controls:</strong> On-screen controls, keyboard bindings, and joystick support</li>
        <li><strong>Special Movement Modes:</strong> Drift modes and precision steering controls</li>
        <li><strong>Hardware Control:</strong> Manage headlights, taillights, and other rover accessories</li>
      </ul>

      <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">System Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Minimum:</h4>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>64-bit operating system</li>
              <li>4GB RAM</li>
              <li>Wi-Fi connectivity</li>
              <li>1280x720 display resolution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 dark:text-white">Recommended:</h4>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>8GB RAM</li>
              <li>Dedicated graphics card</li>
              <li>1920x1080 display resolution</li>
              <li>5GHz Wi-Fi connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
