'use client';

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import dynamic from 'next/dynamic';

// Dynamic import with no SSR for the ApiKeyList component
const ApiKeyList = dynamic(
  () => import('@/src/components/api-keys/ApiKeyList').then(mod => mod.ApiKeyList),
  { ssr: false }
);

export default function ApiKeysPageClient() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vehicles" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Vehicles
          </Link>
        </Button>
        
        <ThemeToggle />
      </div>
      <ApiKeyList />
    </div>
  );
}
