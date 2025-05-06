'use client';

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Key, Plus } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";

export default function ClientButtons() {
  return (
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
  );
}
