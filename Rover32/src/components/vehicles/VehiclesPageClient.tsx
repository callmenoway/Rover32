'use client';

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, Key, Plus } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import dynamic from 'next/dynamic';
import Ballpit from '@/src/components/ui/Ballpit';

// Dynamic import with no SSR for the VehicleList component
const VehicleList = dynamic(
  () => import('@/src/components/vehicles/VehicleList').then(mod => mod.VehicleList),
  { ssr: false }
);

export default function VehiclesPageClient() {
  return (
    <div className="relative min-h-screen">
      {/* Ballpit Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Ballpit
          count={100}
          gravity={0.5}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={[0x3b82f6, 0x60a5fa, 0x93c5fd, 0x2563eb]} // Hexadecimal format for three.js colors
          fillColors={['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb']}  // String format for CSS colors
          strokeColor="#1d4ed8"
          strokeWidth={1}
          minRadius={5}
          maxRadius={15}
        />
      </div>
      
      {/* Content with higher z-index to display above the Ballpit */}
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
        
        {/* Adding a backdrop to improve content readability over the Ballpit */}
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <VehicleList />
        </div>
      </div>
    </div>
  );
}
