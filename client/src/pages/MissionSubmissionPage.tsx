import { ArrowRight, ChevronRight, Plus, Upload } from "lucide-react";
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

const expenseRows = Array.from({ length: 4 }, (_, index) => index + 1);

export function MissionSubmissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>Mission Forms</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold">Mission documents workflow</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            The first form is based on the employee mission order document, and the second form follows the HR and PHR mission expense sheet.
          </p>
        </div>
        <Badge variant="muted">Employee + RH</Badge>
      </div>

      <Tabs defaultValue="employee" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="employee">Employee form</TabsTrigger>
          <TabsTrigger value="hr">HR expense form</TabsTrigger>
        </TabsList>

        <TabsContent value="employee">
          <Card>
            <CardHeader>
              <Badge variant="default" className="w-fit">
                Annexe 01
              </Badge>
              <CardTitle>Ordre de mission - Employee</CardTitle>
              <CardDescription>
                This form follows the mission order template: employee identity, mission object, departure and return details, transport, meal expenses, and manager signatures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Matricule">
                  <Input placeholder="EMP-0148" />
                </Field>
                <Field label="Nom">
                  <Input placeholder="Ben Salah" />
                </Field>
                <Field label="Prenom">
                  <Input placeholder="Khaled" />
                </Field>
                <Field label="Departement / Service">
                  <Input placeholder="Operations" />
                </Field>
              </div>

              <Field label="Objet de la mission">
                <Textarea placeholder="Describe the mission purpose exactly as it should appear on the mission order." className="min-h-32" />
              </Field>

              <div className="grid gap-5 lg:grid-cols-2">
                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Departure details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field label="Lieu de depart">
                      <Input placeholder="Tunis" />
                    </Field>
                    <Field label="Date de depart">
                      <Input type="date" />
                    </Field>
                    <Field label="Heure de depart" className="md:col-span-2">
                      <Input type="time" />
                    </Field>
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Return details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field label="Lieu de retour">
                      <Input placeholder="Sfax" />
                    </Field>
                    <Field label="Date de retour">
                      <Input type="date" />
                    </Field>
                    <Field label="Heure de retour" className="md:col-span-2">
                      <Input type="time" />
                    </Field>
                  </CardContent>
                </Card>
              </div>

              <Field label="Extension de la mission / details complementaires">
                <Textarea placeholder="Add any mission extension, destination extension, or operational note that should be validated by management and HR." />
              </Field>

              <div className="grid gap-5 xl:grid-cols-[0.85fr_0.55fr_0.6fr]">
                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Moyen de transport utilise</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {["Transports en commun", "Voiture personnelle", "Vehicule de service"].map((item) => (
                      <label key={item} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm">
                        <input type="radio" name="transport" className="h-4 w-4" />
                        {item}
                      </label>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Frais de repas</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {["Petit dejeuner", "Dejeuner", "Diner"].map((item) => (
                      <label key={item} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-sm">
                        <input type="checkbox" className="h-4 w-4" />
                        {item}
                      </label>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Commentaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea placeholder="Explications / commentaires" className="min-h-36" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Responsable hierarchique">
                  <Input placeholder="Manager name" />
                </Field>
                <Field label="Directeur du departement">
                  <Input placeholder="Department director" />
                </Field>
                <Field label="Aval de la DRH">
                  <Input placeholder="HR approval" />
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
                  <Input type="date" />
                </Field>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" size="lg">
                  Save Draft
                </Button>
                <Button size="lg">
                  Submit Employee Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hr">
          <Card>
            <CardHeader>
              <Badge variant="warning" className="w-fit">
                Annexe 03
              </Badge>
              <CardTitle>Frais de mission - Ressource humaine</CardTitle>
              <CardDescription>
                This HR and PHR form follows the expense sheet template with employee identity, period, detailed mission rows, cost center, total amount, and verification fields.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Nom">
                  <Input placeholder="Khaled Ben Salah" />
                </Field>
                <Field label="Departement">
                  <Input placeholder="Operations" />
                </Field>
                <Field label="Matricule">
                  <Input placeholder="EMP-0148" />
                </Field>
                <Field label="Periode">
                  <Input placeholder="April 2026" />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Date - Du">
                  <Input type="date" />
                </Field>
                <Field label="Date - Au">
                  <Input type="date" />
                </Field>
              </div>

              <Card className="border-border/60 bg-background/70">
                <CardHeader className="md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-base">Mission detailed rows</CardTitle>
                    <CardDescription>Ref, date, mission detail, times, plage horaire, cost center, and mission expense.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    Add row
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseRows.map((row) => (
                    <div key={row} className="grid gap-3 rounded-2xl border border-border/60 p-4 xl:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1.1fr_1fr]">
                      <Field label="Ref">
                        <Input defaultValue={String(row)} />
                      </Field>
                      <Field label="Date">
                        <Input type="date" />
                      </Field>
                      <Field label="Mission detaillee">
                        <Input placeholder="Client meeting / site visit / audit task" />
                      </Field>
                      <Field label="Heure depart">
                        <Input type="time" />
                      </Field>
                      <Field label="Heure retour">
                        <Input type="time" />
                      </Field>
                      <Field label="Plage horaire">
                        <Input placeholder="08:00-16:00" />
                      </Field>
                      <Field label="Cost center">
                        <Input placeholder="OPS-004" />
                      </Field>
                      <Field label="Frais mission">
                        <Input type="number" placeholder="120" />
                      </Field>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-5 lg:grid-cols-[1fr_0.55fr]">
                <Field label="Commentaires RH / PHR">
                  <Textarea placeholder="Add HR notes, verification remarks, reimbursement comments, or missing-document observations." className="min-h-32" />
                </Field>
                <Card className="border-primary/10 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Field label="Total frais mission">
                      <Input defaultValue="0" type="number" />
                    </Field>
                    <Field label="Prepare par">
                      <Input placeholder="HR officer name" />
                    </Field>
                    <Field label="Initiales">
                      <Input placeholder="KB" />
                    </Field>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Verification PHR Manager">
                  <Input placeholder="PHR manager" />
                </Field>
                <Field label="Initiales">
                  <Input placeholder="NT" />
                </Field>
                <Field label="Signature / validation">
                  <Select>
                    <option>Pending</option>
                    <option>Validated</option>
                    <option>Returned for update</option>
                  </Select>
                </Field>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" size="lg">
                  Save HR Draft
                </Button>
                <Button size="lg">
                  Submit HR Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
