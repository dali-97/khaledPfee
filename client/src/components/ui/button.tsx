import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/40",
  ghost:
    "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary/20",
  outline:
    "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-primary/20",
  danger:
    "bg-danger text-danger-foreground hover:bg-danger/90 focus-visible:ring-danger/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3 text-sm",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-11 rounded-xl px-5 text-sm",
  icon: "h-10 w-10 rounded-xl",
};

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>;

export function Button({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
