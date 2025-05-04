import { cn } from "@/src/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

//TODO Aggiungere varianti per diversi tipi di contenuto (testo, avatar, immagine)
//TODO Implementare durata e ritardo dell'animazione personalizzabili
