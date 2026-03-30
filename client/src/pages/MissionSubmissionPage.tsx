import { ArrowRight, ChevronRight, Upload } from "lucide-react";
import {
  Field,
  Select,
} from "@/components/mission-flow/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MissionSubmissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>New Mission</span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold">Create a new mission</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A clean, responsive form with clear structure, date fields, attachments, and action buttons for drafts and submissions.
          </p>
        </div>
        <Badge variant="muted">Form layout</Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Mission title">
              <Input placeholder="Annual regional planning summit" />
            </Field>
            <Field label="Destination">
              <Input placeholder="Barcelona, Spain" />
            </Field>
            <Field label="Purpose">
              <Input placeholder="Client strategy workshop" />
            </Field>
            <Field label="Estimated budget">
              <Input placeholder="$2,800" type="number" />
            </Field>
            <Field label="Departure date">
              <Input type="date" />
            </Field>
            <Field label="Return date">
              <Input type="date" />
            </Field>
            <Field label="Transport type">
              <Select>
                <option>Flight</option>
                <option>Train</option>
                <option>Car</option>
                <option>Mixed</option>
              </Select>
            </Field>
            <Field label="Accommodation details">
              <Input placeholder="Hotel, nights, company rate" />
            </Field>
          </div>
          <div className="mt-5 grid gap-5">
            <Field label="Notes / Description">
              <Textarea placeholder="Add mission objectives, expected meetings, travel notes, and any special approvals needed." />
            </Field>
            <Field label="File upload">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center">
                <Upload className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Drop files here or click to upload</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Travel brief, invitation letter, budget estimate, or approval memo.
                  </p>
                </div>
                <Input type="file" className="hidden" />
              </label>
            </Field>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" size="lg">
                Save Draft
              </Button>
              <Button size="lg">
                Submit Mission
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
