import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  MoonStar,
  SunMedium,
  type LucideIcon,
} from "lucide-react";
import { statusStyle } from "@/data/mission-flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { MissionStatus, Role, Theme } from "@/types/app";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge variant="muted" className="w-fit">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="text-lg leading-8 text-muted-foreground">{description}</p>
    </div>
  );
}

export function RolePill({
  role,
  active,
  onClick,
  inverted = false,
}: {
  role: Role;
  active: boolean;
  onClick: () => void;
  inverted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm font-medium transition",
        inverted
          ? active
            ? "bg-white text-slate-900"
            : "bg-white/10 text-primary-foreground/80 hover:bg-white/15"
          : active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {role === "employee" ? "Employee" : role === "manager" ? "Manager" : "Admin"}
    </button>
  );
}

export function ThemeToggleButton({
  theme,
  onClick,
  lightOnDark = false,
}: {
  theme: Theme;
  onClick: () => void;
  lightOnDark?: boolean;
}) {
  return (
    <Button
      variant={lightOnDark ? "ghost" : "outline"}
      size="icon"
      className={
        lightOnDark
          ? "text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          : ""
      }
      onClick={onClick}
    >
      {theme === "light" ? (
        <MoonStar className="h-4 w-4" />
      ) : (
        <SunMedium className="h-4 w-4" />
      )}
    </Button>
  );
}

export function Field({
  label,
  className,
  error,
  children,
}: {
  label: string;
  className?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium", className)}>
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FileUploadField({ description }: { description: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center">
      <Input type="file" className="hidden" />
      <div>
        <p className="font-medium">Drop files here or click to upload</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}

export function MetricSurface({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{delta}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: MissionStatus }) {
  const style = statusStyle[status];
  return <Badge variant={style.variant}>{style.label}</Badge>;
}

export function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "warning" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/15 text-success"
      : tone === "warning"
        ? "bg-warning/15 text-warning"
        : tone === "danger"
          ? "bg-danger/15 text-danger"
          : "bg-primary/15 text-primary";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-sm font-medium">{label}</p>
      <span className={cn("rounded-full px-3 py-1 text-sm font-medium", toneClass)}>
        {value}
      </span>
    </div>
  );
}

export function PreferenceRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} label={label} />
    </div>
  );
}

export function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

export function SimpleBarChart({
  title,
  data,
  suffix = "",
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
  suffix?: string;
}) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            Interactive-looking chart built with responsive utility layouts.
          </p>
        </div>
        <Badge variant="muted">Last 6 months</Badge>
      </div>
      <div className="flex h-64 items-end gap-3">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">
              {point.value}
              {suffix}
            </div>
            <div className="flex h-48 w-full items-end rounded-2xl bg-muted/50 p-1">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-primary to-cyan-400"
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full">
      <Input className="pl-10" placeholder={placeholder} />
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <BriefcaseBusiness className="h-4 w-4 opacity-0" />
      </div>
    </div>
  );
}
