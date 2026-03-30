import { ArrowRight } from "lucide-react";
import { kpis, missions } from "@/data/mission-flow";
import {
  InfoPair,
  KpiCard,
  StatusBadge,
  StatusRow,
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
import type { Role } from "@/types/app";

export function UserDashboardPage({
  role,
  onNewMission,
}: {
  role: Role;
  onNewMission: () => void;
}) {
  const cards = kpis.employee;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader className="md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="muted" className="mb-3">
                {role === "manager" ? "Manager workspace" : "Employee workspace"}
              </Badge>
              <CardTitle className="text-3xl">Stay on top of every mission in motion.</CardTitle>
              <CardDescription className="mt-3 max-w-2xl">
                See upcoming travel, approval bottlenecks, and mission history at a glance with a clean operations dashboard.
              </CardDescription>
            </div>
            <Button size="lg" onClick={onNewMission}>
              New Mission
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Current trip summary</CardDescription>
            <CardTitle>Berlin product workshop</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <InfoPair label="Status" value="Checked in - in progress" />
            <InfoPair label="Dates" value="Apr 12 - Apr 16" />
            <InfoPair label="Budget" value="$3,420 approved" />
            <InfoPair label="Travel" value="Flight + hotel + rail" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCard key={card.label} label={card.label} value={card.value} delta={card.delta} icon={card.icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Recent missions</CardTitle>
              <CardDescription>Latest requests, statuses, and budgets for your team.</CardDescription>
            </div>
            <Button variant="outline">View all</Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="pb-3 font-medium">Mission</th>
                  <th className="pb-3 font-medium">Destination</th>
                  <th className="pb-3 font-medium">Dates</th>
                  <th className="pb-3 font-medium">Budget</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {missions.slice(0, 3).map((mission) => (
                  <tr key={mission.id} className="border-b border-border/50 last:border-none">
                    <td className="py-4">
                      <div className="font-medium">{mission.title}</div>
                      <div className="text-xs text-muted-foreground">{mission.id}</div>
                    </td>
                    <td className="py-4">{mission.destination}</td>
                    <td className="py-4">{mission.dates}</td>
                    <td className="py-4">{mission.budget}</td>
                    <td className="py-4">
                      <StatusBadge status={mission.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status overview</CardTitle>
              <CardDescription>Mission states are clear across the full lifecycle.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <StatusRow label="Pending review" value="08" tone="warning" />
              <StatusRow label="Approved" value="19" tone="success" />
              <StatusRow label="Rejected" value="02" tone="danger" />
              <StatusRow label="In progress" value="03" tone="default" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mission history preview</CardTitle>
              <CardDescription>Past activity for quick review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missions.slice(0, 3).map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 p-4"
                >
                  <div>
                    <p className="font-medium">{mission.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mission.destination} - {mission.dates}
                    </p>
                  </div>
                  <StatusBadge status={mission.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
