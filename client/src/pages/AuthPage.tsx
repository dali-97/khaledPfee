import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import {
  Field,
  RolePill,
  Select,
  ThemeToggleButton,
} from "@/components/mission-flow/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AuthFormPayload } from "@/lib/api";
import type { Role, Theme } from "@/types/app";

type AuthPageProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  alternateLabel: string;
  alternateAction: string;
  onAlternate: () => void;
  role: Role;
  setRole: (role: Role) => void;
  onSubmit: (payload: AuthFormPayload) => Promise<void>;
  onBack: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  register?: boolean;
};

export function AuthPage({
  title,
  subtitle,
  actionLabel,
  alternateLabel,
  alternateAction,
  onAlternate,
  role,
  setRole,
  onSubmit,
  onBack,
  showPassword,
  onTogglePassword,
  theme,
  onThemeToggle,
  register = false,
}: AuthPageProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        firstName,
        lastName,
        company,
        email,
        password,
        role,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center py-8">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-2xl lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-between gap-10 bg-gradient-to-br from-primary/95 via-blue-500 to-cyan-400 p-8 text-primary-foreground lg:p-12">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition hover:text-primary-foreground"
              onClick={onBack}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>
            <ThemeToggleButton theme={theme} onClick={onThemeToggle} lightOnDark />
          </div>
          <div className="space-y-6">
            <Badge variant="muted" className="w-fit bg-white/15 text-primary-foreground">
              Mission Flow workspace
            </Badge>
            <div>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">{title}</h1>
              <p className="mt-4 max-w-md text-base leading-7 text-primary-foreground/80">
                {subtitle}
              </p>
            </div>
            <div className="grid gap-4">
              {[
                "Submit and track travel missions from any device.",
                "Review approvals with comments, budgets, and files in one place.",
                "Keep admins aligned through analytics, exports, and archive controls.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-primary-foreground/80">Preview roles</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <RolePill role="employee" active={role === "employee"} onClick={() => setRole("employee")} inverted />
              <RolePill role="manager" active={role === "manager"} onClick={() => setRole("manager")} inverted />
              <RolePill role="admin" active={role === "admin"} onClick={() => setRole("admin")} inverted />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-xl border-border/70 bg-background/95">
            <CardHeader className="space-y-3">
              <Badge variant="muted" className="w-fit">
                {register ? "Register" : "Login"}
              </Badge>
              <CardTitle className="text-3xl">
                {register ? "Set up your account" : "Access your dashboard"}
              </CardTitle>
              <CardDescription>
                Connected authentication using JWT, role selection, and a clean responsive form layout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {register && (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First name">
                    <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Enter your first name" />
                  </Field>
                  <Field label="Last name">
                    <Input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Enter your last name" />
                  </Field>
                </div>
              )}
              <Field label="Email address">
                <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" type="email" />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="pr-24"
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
              {register && (
                <Field label="Company name">
                  <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Mission Flow Group" />
                </Field>
              )}
              <Field label="Role selector">
                <Select value={role} onChange={(event) => setRole(event.target.value as Role)}>
                  <option value="employee">Employee / User</option>
                  <option value="manager">Manager / Director</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="h-4 w-4 rounded border-border" />
                  Keep me signed in
                </label>
                <button className="font-medium text-primary">Forgot password?</button>
              </div>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {alternateLabel}{" "}
                <button onClick={onAlternate} className="font-medium text-primary">
                  {alternateAction}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
