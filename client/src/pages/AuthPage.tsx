import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { login as apiLogin, register as apiRegister } from "@/lib/api";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  Field,
  RolePill,
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
import type { Role } from "@/types/app";

type AuthPageProps = {
  mode: "login" | "register";
};

const PANEL_CONTENT = {
  login: {
    title: "Welcome back",
    subtitle:
      "Monitor missions, approvals, and travel budgets with one polished workspace.",
  },
  register: {
    title: "Create your workspace",
    subtitle:
      "Launch a clean mission management flow for employees, directors, and administrators.",
  },
};

const FEATURE_LIST = [
  "Submit and track travel missions from any device.",
  "Review approvals with comments, budgets, and files in one place.",
  "Keep admins aligned through analytics, exports, and archive controls.",
];

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUIStore();
  const storeLogin = useAuthStore((state) => state.login);
  const [role, setRole] = useState<Role>("employee");
  const isRegister = mode === "register";
  const { title, subtitle } = PANEL_CONTENT[mode];

  return (
    <div className="container flex min-h-screen items-center py-8">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-2xl lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left gradient panel */}
        <div className="flex flex-col justify-between gap-10 bg-gradient-to-br from-primary/95 via-blue-500 to-cyan-400 p-8 text-primary-foreground lg:p-12">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition hover:text-primary-foreground"
              onClick={() => navigate("/")}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back
            </button>
            <ThemeToggleButton theme={theme} onClick={toggleTheme} lightOnDark />
          </div>

          <div className="space-y-6">
            <Badge variant="muted" className="w-fit bg-white/15 text-primary-foreground">
              Mission Flow workspace
            </Badge>
            <div>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">
                {title}
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-primary-foreground/80">
                {subtitle}
              </p>
            </div>
            <div className="grid gap-4">
              {FEATURE_LIST.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-primary-foreground/80">Preview roles</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <RolePill
                role="employee"
                active={role === "employee"}
                onClick={() => setRole("employee")}
                inverted
              />
              <RolePill
                role="manager"
                active={role === "manager"}
                onClick={() => setRole("manager")}
                inverted
              />
              <RolePill
                role="admin"
                active={role === "admin"}
                onClick={() => setRole("admin")}
                inverted
              />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-xl border-border/70 bg-background/95">
            <CardHeader className="space-y-3">
              <Badge variant="muted" className="w-fit">
                {isRegister ? "Register" : "Login"}
              </Badge>
              <CardTitle className="text-3xl">
                {isRegister ? "Set up your account" : "Access your dashboard"}
              </CardTitle>
              <CardDescription>
                Connected authentication using JWT, role selection, and a clean
                responsive form layout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRegister ? (
                <RegisterForm role={role} onSuccess={(token, user) => { storeLogin(token, user); navigate("/workspace"); }} />
              ) : (
                <LoginForm onSuccess={(token, user) => { storeLogin(token, user); navigate("/workspace"); }} />
              )}
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {isRegister ? "Already have access?" : "Need an account?"}{" "}
                <button
                  type="button"
                  onClick={() => navigate(isRegister ? "/login" : "/register")}
                  className="font-medium text-primary"
                >
                  {isRegister ? "Go to login" : "Create one"}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────

type AuthUser = { id: string; firstName: string; lastName: string; email: string; role: Role };

function LoginForm({
  onSuccess,
}: {
  onSuccess: (token: string, user: AuthUser) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await apiLogin({ email: data.email, password: data.password });
      onSuccess(response.token, response.user);
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Authentication failed.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Email address">
        <Input {...register("email")} type="email" placeholder="Enter your email" />
        {errors.email && (
          <span className="text-xs text-danger">{errors.email.message}</span>
        )}
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-24"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <span className="text-xs text-danger">{errors.password.message}</span>
        )}
      </Field>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-border" />
          Keep me signed in
        </label>
        <button type="button" className="font-medium text-primary">
          Forgot password?
        </button>
      </div>

      {errors.root && (
        <p className="text-sm text-danger">{errors.root.message}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : "Sign in to Mission Flow"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({
  role,
  onSuccess,
}: {
  role: Role;
  onSuccess: (token: string, user: AuthUser) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await apiRegister({ ...data, role });
      onSuccess(response.token, response.user);
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="First name">
          <Input {...register("firstName")} placeholder="Enter your first name" />
          {errors.firstName && (
            <span className="text-xs text-danger">{errors.firstName.message}</span>
          )}
        </Field>
        <Field label="Last name">
          <Input {...register("lastName")} placeholder="Enter your last name" />
          {errors.lastName && (
            <span className="text-xs text-danger">{errors.lastName.message}</span>
          )}
        </Field>
      </div>

      <Field label="Email address">
        <Input {...register("email")} type="email" placeholder="Enter your email" />
        {errors.email && (
          <span className="text-xs text-danger">{errors.email.message}</span>
        )}
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-24"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <span className="text-xs text-danger">{errors.password.message}</span>
        )}
      </Field>

      <Field label="Company name">
        <Input {...register("company")} placeholder="Mission Flow Group" />
        {errors.company && (
          <span className="text-xs text-danger">{errors.company.message}</span>
        )}
      </Field>

      {errors.root && (
        <p className="text-sm text-danger">{errors.root.message}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : "Create Mission Flow account"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
