import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building2, ChevronDown, ChevronRight, Mail, Plus, Users, X } from "lucide-react";
import {
  createManager,
  deleteManager,
  getManagerEmployees,
  listManagers,
  toggleManagerStatus,
  type EmployeeUser,
  type ManagerUser,
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

const createManagerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
});

type CreateManagerValues = z.infer<typeof createManagerSchema>;

export function ManagersPage() {
  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [employeeMap, setEmployeeMap] = useState<Record<string, EmployeeUser[]>>({});
  const [loadingEmployees, setLoadingEmployees] = useState<Set<string>>(new Set());

  useEffect(() => {
    listManagers()
      .then((res) => setManagers(res.managers))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newManager: ManagerUser) => {
    setManagers((prev) => [{ ...newManager, employeeCount: 0 }, ...prev]);
    setShowForm(false);
  };

  const handleToggleActive = async (manager: ManagerUser) => {
    try {
      const res = await toggleManagerStatus(manager.id);
      setManagers((prev) =>
        prev.map((m) => (m.id === manager.id ? { ...m, active: res.active } : m))
      );
    } catch { /* silently ignore */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteManager(id);
      setManagers((prev) => prev.filter((m) => m.id !== id));
      setExpanded((prev) => { const s = new Set(prev); s.delete(id); return s; });
    } catch { /* silently ignore */ }
  };

  const handleToggleExpand = async (managerId: string) => {
    const isOpen = expanded.has(managerId);
    if (isOpen) {
      setExpanded((prev) => { const s = new Set(prev); s.delete(managerId); return s; });
      return;
    }

    setExpanded((prev) => new Set(prev).add(managerId));

    if (!employeeMap[managerId]) {
      setLoadingEmployees((prev) => new Set(prev).add(managerId));
      try {
        const res = await getManagerEmployees(managerId);
        setEmployeeMap((prev) => ({ ...prev, [managerId]: res.employees }));
      } catch { /* silently ignore */ }
      finally {
        setLoadingEmployees((prev) => { const s = new Set(prev); s.delete(managerId); return s; });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Manage Managers</h2>
          <p className="mt-2 text-muted-foreground">
            Create manager accounts and view their teams.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <><X className="h-4 w-4" />Cancel</> : <><Plus className="h-4 w-4" />New Manager</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create manager account</CardTitle>
            <CardDescription>
              The manager can log in immediately and create their own employee accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateManagerForm onCreated={handleCreated} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All managers</CardTitle>
          <CardDescription>
            {managers.length} manager{managers.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loading && managers.length === 0 && (
            <p className="text-sm text-muted-foreground">No managers yet. Create the first one above.</p>
          )}
          {managers.map((manager) => {
            const isOpen = expanded.has(manager.id);
            const employees = employeeMap[manager.id] ?? [];
            const isFetching = loadingEmployees.has(manager.id);

            return (
              <div key={manager.id} className="rounded-2xl border border-border/60 overflow-hidden">
                {/* Manager row */}
                <div className="flex items-center gap-3 bg-background/70 px-4 py-3">
                  <button
                    onClick={() => handleToggleExpand(manager.id)}
                    className="flex shrink-0 items-center gap-1 text-muted-foreground hover:text-foreground"
                    aria-label={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen
                      ? <ChevronDown className="h-4 w-4" />
                      : <ChevronRight className="h-4 w-4" />
                    }
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {manager.firstName} {manager.lastName}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {manager.email}
                      </span>
                      {manager.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {manager.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {manager.employeeCount}
                    </span>
                    <Badge variant={manager.active ? "default" : "muted"}>
                      {manager.active ? "Active" : "Disabled"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(manager)}
                    >
                      {manager.active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger hover:bg-danger/10"
                      onClick={() => handleDelete(manager.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Employees section */}
                {isOpen && (
                  <div className="border-t border-border/50 bg-muted/30 px-4 py-3 space-y-2">
                    {isFetching && (
                      <p className="text-sm text-muted-foreground">Loading employees…</p>
                    )}
                    {!isFetching && employees.length === 0 && (
                      <p className="text-sm text-muted-foreground">No employees assigned to this manager yet.</p>
                    )}
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/70 px-4 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{emp.email}</p>
                        </div>
                        <Badge variant={emp.active ? "muted" : "danger"} className="shrink-0 text-xs">
                          {emp.active ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function CreateManagerForm({ onCreated }: { onCreated: (m: ManagerUser) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateManagerValues>({ resolver: zodResolver(createManagerSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await createManager(data);
      reset();
      onCreated({ ...(res.user as ManagerUser), employeeCount: 0 });
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create manager.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name">
          <Input {...register("firstName")} placeholder="Jane" />
          {errors.firstName && <span className="text-xs text-danger">{errors.firstName.message}</span>}
        </Field>
        <Field label="Last name">
          <Input {...register("lastName")} placeholder="Doe" />
          {errors.lastName && <span className="text-xs text-danger">{errors.lastName.message}</span>}
        </Field>
        <Field label="Email address">
          <Input {...register("email")} type="email" placeholder="jane.doe@company.com" />
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
          {isSubmitting ? "Creating…" : "Create Manager"}
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
