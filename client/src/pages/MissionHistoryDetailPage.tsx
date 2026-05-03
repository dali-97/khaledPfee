import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getMission } from "@/lib/api";
import {
  InfoPair,
  StatusBadge,
} from "@/components/mission-flow/primitives";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MissionDetail } from "@/types/app";

export function MissionHistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getMission(id)
      .then((res) => setMission(res.mission))
      .catch(() => setError("Mission not found or could not be loaded."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/workspace/history")}>
          <ArrowLeft className="h-4 w-4" />
          Back to history
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">Mission details</h2>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading mission…</p>
      )}
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
      {!loading && mission && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{mission.title}</CardTitle>
                <CardDescription>
                  {mission.reference} — {mission.employee}
                </CardDescription>
              </div>
              <StatusBadge status={mission.status} />
            </CardHeader>
            <CardContent className="grid gap-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Employee
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair label="Full name" value={mission.employee} />
                  <InfoPair label="Email" value={mission.employeeEmail || "—"} />
                  <InfoPair label="Matricule" value={mission.matricule || "—"} />
                  <InfoPair label="Department" value={mission.department} />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Mission
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair label="Purpose" value={mission.purpose || "—"} />
                  <InfoPair
                    label="Transportation"
                    value={mission.transportation?.replace(/_/g, " ") ?? "—"}
                  />
                  <InfoPair
                    label="Departure"
                    value={`${mission.departureLocation} — ${mission.departureDate} ${mission.departureTime}`}
                  />
                  <InfoPair
                    label="Return"
                    value={`${mission.returnLocation} — ${mission.returnDate} ${mission.returnTime}`}
                  />
                  {mission.extensions && (
                    <InfoPair label="Extensions" value={mission.extensions} />
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Meals
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                    <span
                      key={meal}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        mission.meals?.[meal]
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 text-muted-foreground"
                      }`}
                    >
                      {meal}
                    </span>
                  ))}
                </div>
              </section>

              {(mission.comments || mission.managerComment) && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Comments
                  </h3>
                  {mission.comments && (
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Employee
                      </p>
                      <p className="text-sm">{mission.comments}</p>
                    </div>
                  )}
                  {mission.managerComment && (
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Manager
                      </p>
                      <p className="text-sm">{mission.managerComment}</p>
                    </div>
                  )}
                </section>
              )}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Approvals
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair
                    label="Hierarchical manager"
                    value={mission.hierarchicalManager || "—"}
                  />
                  <InfoPair
                    label="Department director"
                    value={mission.departmentDirector || "—"}
                  />
                  <InfoPair
                    label="HR approval"
                    value={mission.hrApproval || "—"}
                  />
                  <InfoPair label="Form date" value={mission.formDate || "—"} />
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
