import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building2, Mail, Plus, X } from "lucide-react";
import {
  createEmployee,
  listManagerEmployees,
  toggleEmployeeStatus,
  type EmployeeUser,
} from "@/lib/api";
import { Field } from "@/components/mission-flow/primitives";
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

const createEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
});

type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;

export function TeamPage() {
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    listManagerEmployees()
      .then((res) => setEmployees(res.employees))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newEmployee: EmployeeUser) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    setShowForm(false);
  };

  const handleToggleActive = async (employee: EmployeeUser) => {
    try {
      const res = await toggleEmployeeStatus(employee.id);
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, active: res.active } : e))
      );
    } catch { /* silently ignore */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">My Team</h2>
          <p className="mt-2 text-muted-foreground">
            Create and manage the employees assigned to you.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm
            ? <><X className="h-4 w-4" />Cancel</>
            : <><Plus className="h-4 w-4" />Add Employee</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create employee account</CardTitle>
            <CardDescription>
              The employee will be linked to you and can log in immediately with these credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateEmployeeForm onCreated={handleCreated} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your employees</CardTitle>
          <CardDescription>
            {employees.length} employee{employees.length !== 1 ? "s" : ""} in your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loading && employees.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No employees yet. Add the first member to your team above.
            </p>
          )}
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {employee.email}
                  </span>
                  {employee.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {employee.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={employee.active ? "default" : "muted"}>
                  {employee.active ? "Active" : "Disabled"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(employee)}
                >
                  {employee.active ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CreateEmployeeForm({ onCreated }: { onCreated: (e: EmployeeUser) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmployeeValues>({ resolver: zodResolver(createEmployeeSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await createEmployee(data);
      reset();
      onCreated(res.user);
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create employee.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name">
          <Input {...register("firstName")} placeholder="John" />
          {errors.firstName && <span className="text-xs text-danger">{errors.firstName.message}</span>}
        </Field>
        <Field label="Last name">
          <Input {...register("lastName")} placeholder="Smith" />
          {errors.lastName && <span className="text-xs text-danger">{errors.lastName.message}</span>}
        </Field>
        <Field label="Email address">
          <Input {...register("email")} type="email" placeholder="john.smith@company.com" />
          {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
        </Field>
        <Field label="Password">
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              className="pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <span className="text-xs text-danger">{errors.password.message}</span>}
        </Field>
        <Field label="Company (optional)">
          <Input {...register("company")} placeholder="Acme Corp" />
        </Field>
      </div>

      {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Add Employee"}
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
