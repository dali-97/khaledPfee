import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  getMission,
  listMissions,
  updateMissionStatus,
} from "@/lib/api";
import {
  Field,
  InfoPair,
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
import type { MissionDetail } from "@/types/app";

export function MissionApprovalPage() {
  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [selected, setSelected] = useState<MissionDetail | null>(null);
  const [comment, setComment] = useState("");
  const [actionError, setActionError] = useState("");
  const [isActing, setIsActing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMissions({ status: "pending" })
      .then((res) => setMissions(res.missions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (id: string) => {
    try {
      const res = await getMission(id);
      setSelected(res.mission);
      setComment("");
      setActionError("");
    } catch {
      // silently ignore — item stays unselected
    }
  };

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selected) return;
    setIsActing(true);
    setActionError("");
    try {
      await updateMissionStatus(selected.id, status, comment || undefined);
      setMissions((prev) => prev.filter((m) => m.id !== selected.id));
      setSelected(null);
      setShowModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setIsActing(false);
    }
  };

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
              Managers can review details, comments, budgets, and attachments
              before deciding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <p className="text-sm text-muted-foreground">Loading missions…</p>
            )}
            {!loading && missions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pending missions to review.
              </p>
            )}
            {missions.map((mission) => (
              <button
                key={mission.id}
                onClick={() => handleSelect(mission.id)}
                className="flex w-full items-start justify-between gap-4 rounded-2xl border border-border/60 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div>
                  <p className="font-medium">{mission.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mission.employee} - {mission.department}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mission.departureLocation} → {mission.returnLocation}
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
              Employee information, attachments, and review notes stay visible
              in one clean panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {selected ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoPair label="Employee" value={selected.employee} />
                  <InfoPair label="Department" value={selected.department} />
                  <InfoPair
                    label="Departure"
                    value={`${selected.departureLocation} (${selected.departureDate})`}
                  />
                  <InfoPair
                    label="Return"
                    value={`${selected.returnLocation} (${selected.returnDate})`}
                  />
                  <InfoPair label="Reference" value={selected.reference} />
                  <InfoPair label="Purpose" value={selected.purpose || "—"} />
                </div>
                <Field label="Manager comment">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add feedback, approval conditions, or a rejection reason."
                  />
                </Field>
                {actionError && (
                  <p className="text-sm text-danger">{actionError}</p>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(true)}
                  >
                    View full details
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    disabled={isActing}
                    onClick={() => handleAction("rejected")}
                  >
                    Reject Mission
                  </Button>
                  <Button
                    size="lg"
                    disabled={isActing}
                    onClick={() => handleAction("approved")}
                  >
                    Approve Mission
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a mission from the queue to review it.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <Badge variant="warning" className="mb-3">
                  Full details
                </Badge>
                <CardTitle>{selected.title}</CardTitle>
                <CardDescription>
                  {selected.employee} — {selected.reference}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoPair label="Matricule" value={selected.matricule || "—"} />
                <InfoPair label="Department" value={selected.department} />
                <InfoPair label="Purpose" value={selected.purpose || "—"} />
                <InfoPair
                  label="Transportation"
                  value={selected.transportation?.replace(/_/g, " ") ?? "—"}
                />
                <InfoPair
                  label="Departure"
                  value={`${selected.departureLocation} — ${selected.departureDate} ${selected.departureTime}`}
                />
                <InfoPair
                  label="Return"
                  value={`${selected.returnLocation} — ${selected.returnDate} ${selected.returnTime}`}
                />
              </div>
              {selected.comments && (
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-sm font-medium">Employee comment</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selected.comments}
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
