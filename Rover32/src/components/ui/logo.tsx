import Image from "next/image"
import { cn } from "@/src/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/trasparent-logo.png" 
        alt="Rover32 Logo" 
        width={512} 
        height={512} 
        className="h-32 w-32" // Aumentato da h-8 w-8 a h-12 w-12
      />
    </div>
  )
}
