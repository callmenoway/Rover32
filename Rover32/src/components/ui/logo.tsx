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
        className="h-auto w-32 object-contain" // Modified to maintain aspect ratio
      />
    </div>
  )
}
