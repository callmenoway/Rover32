import { cn } from "@/src/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"></div>
      <span className="font-bold text-lg">Rover32</span>
    </div>
  )
}
