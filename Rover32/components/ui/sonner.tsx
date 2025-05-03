"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // Default/normal toast
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          
          // Success toast
          "--success-bg": "var(--success)",
          "--success-text": "var(--success-foreground)",
          "--success-border": "var(--success)",
          
          // Error toast
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",
          
          // Info toast
          "--info-bg": "var(--info, var(--primary))",
          "--info-text": "var(--info-foreground, var(--primary-foreground))",
          "--info-border": "var(--info, var(--primary))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
