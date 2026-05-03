import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, ChevronRight, Plus, Trash2, Upload } from "lucide-react";
import {
  expenseReportSchema,
  missionSchema,
  type ExpenseReportFormValues,
  type MissionFormValues,
} from "@/features/missions/schemas";
import { createExpenseReport, createMission } from "@/lib/api";
import { Field, Select } from "@/components/mission-flow/primitives";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";

export function MissionSubmissionPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? "employee";
  const canAccessHRForm = role === "manager" || role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>{canAccessHRForm ? "HR Forms" : "Mission Forms"}</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold">Mission documents workflow</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            The first form is based on the employee mission order document, and the second form follows the HR and PHR mission expense sheet.
          </p>
        </div>
        <Badge variant="muted">{canAccessHRForm ? "HR + PHR" : "Employee"}</Badge>
      </div>

      <Tabs defaultValue={canAccessHRForm ? "hr" : "employee"} className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="employee" disabled={canAccessHRForm && role !== "admin"}>
            Employee form
          </TabsTrigger>
          <TabsTrigger value="hr" disabled={!canAccessHRForm}>
            HR expense form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employee">
          <Annexe01Form />
        </TabsContent>

        <TabsContent value="hr">
          <Annexe03Form />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Annexe01Form() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
  });

  const onSubmit = async (data: MissionFormValues) => {
    try {
      await createMission(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Submission failed.",
      });
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-xl font-semibold">Mission request submitted</p>
          <p className="text-muted-foreground">Your request is pending manager approval.</p>
          <Button onClick={() => setSubmitted(false)}>Submit another</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Badge variant="default" className="w-fit">Annexe 01</Badge>
        <CardTitle>Ordre de mission - Employee</CardTitle>
        <CardDescription>
          This form follows the mission order template: employee identity, mission object, departure and return details, transport, meal expenses, and manager signatures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field label="Titre de la mission" error={errors.title?.message}>
            <Input {...register("title")} placeholder="Client implementation sprint" />
          </Field>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Matricule">
              <Input {...register("matricule")} placeholder="EMP-0148" />
            </Field>
            <Field label="Nom">
              <Input {...register("nom")} placeholder="Ben Salah" />
            </Field>
            <Field label="Prenom">
              <Input {...register("prenom")} placeholder="Khaled" />
            </Field>
            <Field label="Departement / Service">
              <Input {...register("department")} placeholder="Operations" />
            </Field>
          </div>

          <Field label="Objet de la mission">
            <Textarea
              {...register("purpose")}
              placeholder="Describe the mission purpose exactly as it should appear on the mission order."
              className="min-h-32"
            />
          </Field>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-border/60 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Departure details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Lieu de depart">
                  <Input {...register("departureLocation")} placeholder="Tunis" />
                </Field>
                <Field label="Date de depart">
                  <Input {...register("departureDate")} type="date" />
                </Field>
                <Field label="Heure de depart" className="md:col-span-2">
                  <Input {...register("departureTime")} type="time" />
                </Field>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Return details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Lieu de retour">
                  <Input {...register("returnLocation")} placeholder="Sfax" />
                </Field>
                <Field label="Date de retour">
                  <Input {...register("returnDate")} type="date" />
                </Field>
                <Field label="Heure de retour" className="md:col-span-2">
                  <Input {...register("returnTime")} type="time" />
                </Field>
              </CardContent>
            </Card>
          </div>

          <Field label="Extension de la mission / details complementaires">
            <Textarea
              {...register("extensions")}
              placeholder="Add any mission extension, destination extension, or operational note."
            />
          </Field>

          <div className="grid gap-5 xl:grid-cols-[0.85fr_0.55fr_0.6fr]">
            <Card className="border-border/60 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Moyen de transport utilise</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {(
                  [
                    ["public_transport", "Transports en commun"],
                    ["personal_vehicle", "Voiture personnelle"],
                    ["service_vehicle", "Vehicule de service"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("transportation")}
                      className="h-4 w-4"
                    />
                    {label}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Frais de repas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {(
                  [
                    ["mealBreakfast", "Petit dejeuner"],
                    ["mealLunch", "Dejeuner"],
                    ["mealDinner", "Diner"],
                  ] as const
                ).map(([field, label]) => (
                  <label
                    key={field}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...register(field)}
                      className="h-4 w-4"
                    />
                    {label}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Commentaire</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("comments")}
                  placeholder="Explications / commentaires"
                  className="min-h-36"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Responsable hierarchique">
              <Input {...register("hierarchicalManager")} placeholder="Manager name" />
            </Field>
            <Field label="Directeur du departement">
              <Input {...register("departmentDirector")} placeholder="Department director" />
            </Field>
            <Field label="Aval de la DRH">
              <Input {...register("hrApproval")} placeholder="HR approval" />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Piece jointe">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-5 py-6 text-sm">
                <Upload className="h-5 w-5 text-primary" />
                Upload mission order attachment
                <Input type="file" className="hidden" />
              </label>
            </Field>
            <Field label="Date de creation du formulaire">
              <Input {...register("formDate")} type="date" />
            </Field>
          </div>

          {errors.root && (
            <p className="text-sm text-danger">{errors.root.message}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Employee Request"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Annexe03Form() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ExpenseReportFormValues>({
    resolver: zodResolver(expenseReportSchema),
    defaultValues: { rows: [{}] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "rows" });

  const onSubmit = async (data: ExpenseReportFormValues) => {
    try {
      await createExpenseReport(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Submission failed.",
      });
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-xl font-semibold">Expense report submitted</p>
          <p className="text-muted-foreground">The report has been forwarded to admin for review.</p>
          <Button onClick={() => setSubmitted(false)}>Submit another</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Badge variant="warning" className="w-fit">Annexe 03</Badge>
        <CardTitle>Frais de mission - Ressource humaine</CardTitle>
        <CardDescription>
          This HR and PHR form follows the expense sheet template with employee identity, period, detailed mission rows, cost center, total amount, and verification fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nom">
              <Input {...register("nom")} placeholder="Khaled Ben Salah" />
            </Field>
            <Field label="Departement">
              <Input {...register("department")} placeholder="Operations" />
            </Field>
            <Field label="Matricule">
              <Input {...register("matricule")} placeholder="EMP-0148" />
            </Field>
            <Field label="Periode">
              <Input {...register("periode")} placeholder="April 2026" />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Date - Du">
              <Input {...register("dateFrom")} type="date" />
            </Field>
            <Field label="Date - Au">
              <Input {...register("dateTo")} type="date" />
            </Field>
          </div>

          <Card className="border-border/60 bg-background/70">
            <CardHeader className="md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-base">Mission detailed rows</CardTitle>
                <CardDescription>
                  Ref, date, mission detail, times, plage horaire, cost center, and mission expense.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({})}
              >
                <Plus className="h-4 w-4" />
                Add row
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-2xl border border-border/60 p-4 xl:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1.1fr_1fr_auto]"
                >
                  <Field label="Ref">
                    <Input
                      {...register(`rows.${index}.ref`)}
                      defaultValue={String(index + 1)}
                    />
                  </Field>
                  <Field label="Date">
                    <Input {...register(`rows.${index}.date`)} type="date" />
                  </Field>
                  <Field label="Mission detaillee">
                    <Input
                      {...register(`rows.${index}.description`)}
                      placeholder="Client meeting / site visit"
                    />
                  </Field>
                  <Field label="Heure depart">
                    <Input {...register(`rows.${index}.departureTime`)} type="time" />
                  </Field>
                  <Field label="Heure retour">
                    <Input {...register(`rows.${index}.returnTime`)} type="time" />
                  </Field>
                  <Field label="Plage horaire">
                    <Input
                      {...register(`rows.${index}.timeRange`)}
                      placeholder="08:00-16:00"
                    />
                  </Field>
                  <Field label="Cost center">
                    <Input
                      {...register(`rows.${index}.costCenter`)}
                      placeholder="OPS-004"
                    />
                  </Field>
                  <Field label="Frais mission">
                    <Input
                      {...register(`rows.${index}.cost`)}
                      type="number"
                      placeholder="120"
                    />
                  </Field>
                  <div className="flex items-end pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-danger hover:bg-danger/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.55fr]">
            <Field label="Commentaires RH / PHR">
              <Textarea
                {...register("hrComments")}
                placeholder="Add HR notes, verification remarks, reimbursement comments, or missing-document observations."
                className="min-h-32"
              />
            </Field>
            <Card className="border-primary/10 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Field label="Total frais mission">
                  <Input {...register("totalCost")} defaultValue="0" type="number" />
                </Field>
                <Field label="Prepare par">
                  <Input {...register("preparedBy")} placeholder="HR officer name" />
                </Field>
                <Field label="Initiales">
                  <Input {...register("initials")} placeholder="KB" />
                </Field>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Verification PHR Manager">
              <Input {...register("phrManager")} placeholder="PHR manager" />
            </Field>
            <Field label="Initiales">
              <Input {...register("phrInitials")} placeholder="NT" />
            </Field>
            <Field label="Signature / validation">
              <Select {...register("phrSignature")}>
                <option value="Pending">Pending</option>
                <option value="Validated">Validated</option>
                <option value="Returned for update">Returned for update</option>
              </Select>
            </Field>
          </div>

          {errors.root && (
            <p className="text-sm text-danger">{errors.root.message}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit HR Form"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
