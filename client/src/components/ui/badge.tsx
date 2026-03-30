import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "muted";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  muted: "bg-muted text-muted-foreground",
};

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
  }
>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
