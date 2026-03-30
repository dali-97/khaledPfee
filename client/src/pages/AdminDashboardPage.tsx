import { ArrowRight, Download, Eye, TrendingUp } from "lucide-react";
import { activityFeed, kpis, missions } from "@/data/mission-flow";
import {
  KpiCard,
  SimpleBarChart,
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

export function AdminDashboardPage({ onOpenHistory }: { onOpenHistory: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader className="md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="muted" className="mb-3">
                Admin analytics
              </Badge>
              <CardTitle className="text-3xl">System-wide visibility for missions, users, and approvals.</CardTitle>
              <CardDescription className="mt-3 max-w-2xl">
                A premium command center with KPI cards, charts, activity logs, exports, and clear operations controls.
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={onOpenHistory}>
                Review missions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approvals overview</CardTitle>
            <CardDescription>Mission states across the organization.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <StatusRow label="Pending" value="56" tone="warning" />
            <StatusRow label="Approved" value="924" tone="success" />
            <StatusRow label="Rejected" value="81" tone="danger" />
            <StatusRow label="In progress" value="223" tone="default" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.admin.map((card) => (
          <KpiCard key={card.label} label={card.label} value={card.value} delta={card.delta} icon={card.icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Analytics charts</CardTitle>
            <CardDescription>Mission flow volume and approval momentum over the last six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              <SimpleBarChart
                title="Monthly missions"
                data={[
                  { label: "Jan", value: 58 },
                  { label: "Feb", value: 72 },
                  { label: "Mar", value: 84 },
                  { label: "Apr", value: 66 },
                  { label: "May", value: 94 },
                  { label: "Jun", value: 88 },
                ]}
              />
              <SimpleBarChart
                title="Approval rate"
                data={[
                  { label: "Jan", value: 74 },
                  { label: "Feb", value: 79 },
                  { label: "Mar", value: 82 },
                  { label: "Apr", value: 86 },
                  { label: "May", value: 91 },
                  { label: "Jun", value: 94 },
                ]}
                suffix="%"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Live operational signals for admins and supervisors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((entry) => (
              <div key={entry} className="flex gap-3 rounded-2xl border border-border/60 p-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{entry}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>User management</CardTitle>
              <CardDescription>Role overview, recent account actions, and quick governance access.</CardDescription>
            </div>
            <Button variant="outline">Manage users</Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Yasmine Ali", "Employee", "Operations", "Active"],
                  ["Nadia Trabelsi", "Manager", "Executive Office", "Active"],
                  ["Amine Gharbi", "Admin", "Platform", "Suspended"],
                ].map(([name, currentRole, department, status]) => (
                  <tr key={name} className="border-b border-border/50 last:border-none">
                    <td className="py-4 font-medium">{name}</td>
                    <td className="py-4">{currentRole}</td>
                    <td className="py-4">{department}</td>
                    <td className="py-4">
                      <Badge variant={status === "Active" ? "success" : "warning"}>{status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Mission management</CardTitle>
              <CardDescription>Global mission table with export and archive actions.</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Archive</Button>
              <Button>Export data</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{mission.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mission.employee} - {mission.destination} - {mission.budget}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={mission.status} />
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
