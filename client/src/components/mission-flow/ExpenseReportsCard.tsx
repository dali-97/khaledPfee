import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Eye, FileSpreadsheet } from "lucide-react";
import { listExpenseReports } from "@/lib/api";
import {
  ExpenseReportDetails,
  SignatureBadge,
} from "@/components/mission-flow/ExpenseReportDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notificationStore";
import type { ExpenseReport } from "@/types/app";

/**
 * HR / PHR expense reports submitted by employees.
 *
 * The initial list comes from GET /expense-reports (already scoped by role on
 * the server). New submissions arrive over SSE and are prepended live, so an
 * admin or manager sees a report the moment the employee submits it.
 */
export function ExpenseReportsCard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    listExpenseReports()
      .then((res) => setReports(res.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Newest notification of this type — the store prepends, so find() is latest.
  const latestEvent = useNotificationStore((state) =>
    state.notifications.find((n) => n.type === "expense_report:created"),
  );
  const appliedEventId = useRef<string | null>(null);

  useEffect(() => {
    if (!latestEvent || appliedEventId.current === latestEvent.id) return;
    appliedEventId.current = latestEvent.id;

    const incoming = (latestEvent.data as { report?: ExpenseReport })?.report;
    if (!incoming) return;

    setReports((prev) =>
      prev.some((r) => r.id === incoming.id) ? prev : [incoming, ...prev],
    );
  }, [latestEvent]);

  return (
    <Card>
      <CardHeader>
        <Badge variant="warning" className="w-fit">
          Annexe 03
        </Badge>
        <CardTitle>HR expense reports</CardTitle>
        <CardDescription>
          Expense sheets submitted by employees. New submissions appear here in
          real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading reports…</p>
        )}

        {!loading && reports.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No expense reports submitted yet.
          </p>
        )}

        {reports.map((report) => {
          const isOpen = expandedId === report.id;
          return (
            <div
              key={report.id}
              className="rounded-2xl border border-border/60 bg-background/70"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : report.id)}
                className="flex w-full items-start justify-between gap-4 p-4 text-left"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {report.employeeName || report.submittedBy || "Unnamed"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[
                        report.department,
                        report.periode,
                        report.missionReference,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "No period specified"}
                    </p>
                    {report.submittedBy && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted by {report.submittedBy}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold">
                    {report.totalCost}
                  </span>
                  <SignatureBadge signature={report.phrSignature} />
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-border/60 p-4">
                  <ExpenseReportDetails report={report} />

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/workspace/history/expense/${report.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(null)}
                    >
                      Collapse
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
