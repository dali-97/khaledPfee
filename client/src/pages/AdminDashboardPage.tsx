import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Plane,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { getAdminStats, listMissions } from "@/lib/api";
import {
  KpiCard,
  SimpleBarChart,
  StatusBadge,
  StatusRow,
} from "@/components/mission-flow/primitives";
import { ExpenseReportsCard } from "@/components/mission-flow/ExpenseReportsCard";
import { activityFeed } from "@/data/mission-flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminStats, MissionDetail } from "@/types/app";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentMissions, setRecentMissions] = useState<MissionDetail[]>([]);

  useEffect(() => {
    void getAdminStats().then((res) => setStats(res.stats)).catch(() => {});
    void listMissions({ limit: 5 })
      .then((res) => setRecentMissions(res.missions))
      .catch(() => {});
  }, []);

  const kpiCards = stats
    ? [
        {
          label: "Total Users",
          value: String(stats.totalUsers),
          delta: "Registered accounts",
          icon: Users,
        },
        {
          label: "Total Missions",
          value: String(stats.totalMissions),
          delta: "All time",
          icon: BriefcaseBusiness,
        },
        {
          label: "Pending Missions",
          value: String(stats.pending),
          delta: "Awaiting review",
          icon: Clock3,
        },
        {
          label: "Approved Missions",
          value: String(stats.approved),
          delta: "Successfully approved",
          icon: CheckCircle2,
        },
        {
          label: "Rejected Missions",
          value: String(stats.rejected),
          delta: "Declined requests",
          icon: XCircle,
        },
        {
          label: "In Progress",
          value: String(stats.inProgress),
          delta: "Active travel",
          icon: Plane,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-gradient-to-br from-primary/10 to-card">
        <CardHeader className="flex-wrap flex-row items-center justify-between gap-4">
          <div>
            <Badge className="mb-3 w-fit">Admin dashboard</Badge>
            <CardTitle className="text-3xl">Organization analytics</CardTitle>
            <CardDescription className="mt-2 text-base">
              Full visibility across users, missions, budgets, and approval
              activity.
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export report
            </Button>
            <Button onClick={() => navigate("/workspace/approval")}>
              Review queue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Approvals overview</CardTitle>
            <CardDescription>
              Live mission status distribution across all departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow
              label="Pending review"
              value={`${stats.pending} missions`}
              tone="warning"
            />
            <StatusRow
              label="Approved"
              value={`${stats.approved} missions`}
              tone="success"
            />
            <StatusRow
              label="Rejected"
              value={`${stats.rejected} missions`}
              tone="danger"
            />
            <StatusRow
              label="Currently in progress"
              value={`${stats.inProgress} missions`}
              tone="default"
            />
          </CardContent>
        </Card>
      )}

      {kpiCards.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              icon={kpi.icon}
            />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleBarChart
          title="Monthly mission volume"
          data={[
            { label: "Nov", value: 42 },
            { label: "Dec", value: 38 },
            { label: "Jan", value: 47 },
            { label: "Feb", value: 33 },
            { label: "Mar", value: 51 },
            { label: "Apr", value: 29 },
          ]}
        />
        <SimpleBarChart
          title="Approval rate"
          suffix="%"
          data={[
            { label: "Nov", value: 94 },
            { label: "Dec", value: 92 },
            { label: "Jan", value: 96 },
            { label: "Feb", value: 88 },
            { label: "Mar", value: 91 },
            { label: "Apr", value: 85 },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Latest system events and mission lifecycle changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground">{activity}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Mission management</CardTitle>
              <CardDescription>
                Recent missions with status and quick actions.
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
          <CardContent className="space-y-4">
            {recentMissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No missions yet.</p>
            ) : (
              recentMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{mission.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mission.employee} · {mission.reference}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={mission.status} />
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ExpenseReportsCard />
    </div>
  );
}
