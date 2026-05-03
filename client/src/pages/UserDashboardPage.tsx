import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { listMissions } from "@/lib/api";
import {
  InfoPair,
  KpiCard,
  StatusBadge,
  StatusRow,
} from "@/components/mission-flow/primitives";
import { kpis } from "@/data/mission-flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import type { MissionDetail, MissionStatus } from "@/types/app";

function countByStatus(missions: MissionDetail[], status: MissionStatus) {
  return missions.filter((m) => m.status === status).length;
}

export function UserDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? "employee";
  const cards = kpis.employee;

  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMissions({ limit: 10 })
      .then((res) => setMissions(res.missions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeMission = missions.find((m) => m.status === "in-progress");
  const pending = countByStatus(missions, "pending");
  const approved = countByStatus(missions, "approved");
  const rejected = countByStatus(missions, "rejected");
  const inProgress = countByStatus(missions, "in-progress");

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-gradient-to-br from-primary/10 to-card">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <Badge className="mb-3 w-fit">
              {role === "manager" ? "Manager workspace" : "Employee workspace"}
            </Badge>
            <CardTitle className="text-3xl">
              Welcome back,{" "}
              {user ? `${user.firstName} ${user.lastName}` : "Mission User"}
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              {role === "manager"
                ? "Review pending approvals and monitor your team's travel activity."
                : "Track your active missions and submit new travel requests."}
            </CardDescription>
          </div>
          {role !== "manager" && (
            <Button
              size="lg"
              onClick={() => navigate("/workspace/new-mission")}
              className="hidden sm:inline-flex"
            >
              New mission
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardHeader>
            <Badge variant="muted" className="w-fit">
              Active mission
            </Badge>
            <CardTitle>Current trip summary</CardTitle>
            <CardDescription>
              Live mission details with status, timeline, and transport method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : activeMission ? (
              <>
                <div className="grid gap-3">
                  <StatusRow label="Status" value="In Progress" tone="default" />
                  <StatusRow
                    label="Departure"
                    value={`${activeMission.departureLocation} — ${activeMission.departureDate}`}
                    tone="default"
                  />
                  <StatusRow
                    label="Return"
                    value={`${activeMission.returnLocation} — ${activeMission.returnDate}`}
                    tone="default"
                  />
                  <StatusRow
                    label="Transport"
                    value={
                      activeMission.transportation?.replace(/_/g, " ") ??
                      "—"
                    }
                    tone="default"
                  />
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Mission</p>
                  <p className="mt-1 font-semibold">{activeMission.title}</p>
                  {activeMission.purpose && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeMission.purpose}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active mission right now.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              icon={kpi.icon}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent missions</CardTitle>
            <CardDescription>
              Your last submitted requests with live approval status.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/workspace/history")}
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading missions…</p>
          ) : missions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No missions yet.{" "}
              {role !== "manager" && (
                <button
                  className="text-primary hover:underline"
                  onClick={() => navigate("/workspace/new-mission")}
                >
                  Submit your first mission.
                </button>
              )}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Mission
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Reference
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Departure
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Return
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {missions.slice(0, 5).map((mission) => (
                    <tr key={mission.id} className="group">
                      <td className="py-4 font-medium">{mission.title}</td>
                      <td className="py-4 text-muted-foreground">
                        {mission.reference}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {mission.departureDate}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {mission.returnDate}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={mission.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status overview</CardTitle>
            <CardDescription>
              Mission distribution across all lifecycle stages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow
              label="Pending review"
              value={`${pending} mission${pending !== 1 ? "s" : ""}`}
              tone="warning"
            />
            <StatusRow
              label="Approved"
              value={`${approved} mission${approved !== 1 ? "s" : ""}`}
              tone="success"
            />
            <StatusRow
              label="Rejected"
              value={`${rejected} mission${rejected !== 1 ? "s" : ""}`}
              tone="danger"
            />
            <StatusRow
              label="In progress"
              value={`${inProgress} mission${inProgress !== 1 ? "s" : ""}`}
              tone="default"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Common tasks for your workspace role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoPair label="Department" value={user?.email ?? "—"} />
              <InfoPair label="Role" value={role} />
              <InfoPair label="Active missions" value={String(inProgress)} />
              <InfoPair label="Pending approval" value={String(pending)} />
            </div>
            {role !== "manager" && (
              <Button
                className="mt-2 w-full sm:hidden"
                onClick={() => navigate("/workspace/new-mission")}
              >
                New mission
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
