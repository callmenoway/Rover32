import { ReactNode } from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "destructive";
};

export const Toaster = () => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-foreground text-sm font-semibold",
          description: "group-[.toast]:text-muted-foreground text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
};

// Use this export for client-side toast notifications
export function toast({ title, description, variant, action }: ToastProps) {
  return sonnerToast(title, {
    description,
    action,
    className: variant === "destructive" ? "destructive" : undefined,
  });
}
