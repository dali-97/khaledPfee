import { CheckCircle2, X } from "lucide-react";
import { missions } from "@/data/mission-flow";
import {
  Field,
  InfoPair,
  MetricSurface,
  StatusBadge,
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
import { Textarea } from "@/components/ui/textarea";

export function MissionApprovalPage({
  showDetails,
  setShowDetails,
}: {
  showDetails: boolean;
  setShowDetails: (open: boolean) => void;
}) {
  const selectedMission = missions[1];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <Badge variant="warning" className="w-fit">
              Pending requests
            </Badge>
            <CardTitle>Mission validation queue</CardTitle>
            <CardDescription>
              Managers can review details, comments, budgets, and attachments before deciding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions
              .filter((mission) => mission.status === "pending")
              .map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => setShowDetails(true)}
                  className="flex w-full items-start justify-between gap-4 rounded-2xl border border-border/60 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <div>
                    <p className="font-medium">{mission.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mission.employee} - {mission.department}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mission.destination} - {mission.dates}
                    </p>
                  </div>
                  <StatusBadge status={mission.status} />
                </button>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mission details</CardTitle>
            <CardDescription>
              Employee information, attachments, and review notes stay visible in one clean panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoPair label="Employee" value={selectedMission.employee} />
              <InfoPair label="Department" value={selectedMission.department} />
              <InfoPair label="Destination" value={selectedMission.destination} />
              <InfoPair label="Estimated budget" value={selectedMission.budget} />
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-medium">Attachments</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Badge variant="muted">Invitation Letter.pdf</Badge>
                <Badge variant="muted">Projected Budget.xlsx</Badge>
                <Badge variant="muted">Hotel Quote.pdf</Badge>
              </div>
            </div>
            <Field label="Manager comment">
              <Textarea placeholder="Add feedback, approval conditions, or a rejection reason." />
            </Field>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="danger" size="lg">
                Reject Mission
              </Button>
              <Button size="lg">
                Approve Mission
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <Badge variant="warning" className="mb-3">
                  Review modal
                </Badge>
                <CardTitle>{selectedMission.title}</CardTitle>
                <CardDescription>
                  {selectedMission.employee} - {selectedMission.destination} - {selectedMission.dates}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <MetricSurface label="Budget" value={selectedMission.budget} helper="Within department limit" />
                <MetricSurface label="Status" value="Pending" helper="Submitted 2 hours ago" />
                <MetricSurface label="Files" value="3" helper="Travel brief included" />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                This dialog demonstrates a clean detail review surface for opening mission requests without leaving the approval queue.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setShowDetails(false)}>Close details</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
