'use client';

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, Key, Plus } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import dynamic from 'next/dynamic';

// Dynamic import with no SSR for the VehicleList component
const VehicleList = dynamic(
  () => import('@/src/components/vehicles/VehicleList').then(mod => mod.VehicleList),
  { ssr: false }
);

export default function VehiclesPageClient() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/vehicles/add" className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Add Vehicle
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/api-keys" className="flex items-center">
              <Key className="mr-1 h-4 w-4" />
              Manage API Keys
            </Link>
          </Button>
        </div>
      </div>
      
      <VehicleList />
    </div>
  );
}
