import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Eye, Filter, Search } from "lucide-react";
import { listExpenseReports, listMissions } from "@/lib/api";
import { SignatureBadge } from "@/components/mission-flow/ExpenseReportDetails";
import {
  RecordTypeToggle,
  type RecordType,
} from "@/components/mission-flow/RecordTypeToggle";
import { StatusBadge } from "@/components/mission-flow/primitives";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ExpenseReport, MissionDetail, MissionStatus } from "@/types/app";

const PAGE_SIZE = 10;

const STATUS_FILTERS: { label: string; value: MissionStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "In Progress", value: "in-progress" },
];

type ExpenseStatus = ExpenseReport["status"];

const EXPENSE_STATUS_FILTERS: { label: string; value: ExpenseStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "submitted" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Draft", value: "draft" },
];

export function MissionHistoryPage() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);

  const [recordType, setRecordType] = useState<RecordType>("missions");
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [expenseStatus, setExpenseStatus] = useState<ExpenseStatus | "">("");

  useEffect(() => {
    listExpenseReports()
      .then((res) => setReports(res.reports))
      .catch(() => {})
      .finally(() => setReportsLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    listMissions({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      status: statusFilter || undefined,
    })
      .then((res) => {
        setMissions(res.missions);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: MissionStatus | "") => {
    setStatusFilter(value);
    setPage(1);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  const isExpenses = recordType === "expenses";

  const filteredReports = reports.filter((report) => {
    if (expenseStatus && report.status !== expenseStatus) return false;
    if (!search.trim()) return true;
    const haystack = [
      report.employeeName,
      report.submittedBy,
      report.department,
      report.periode,
      report.matricule,
      report.missionReference,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const orderedReports = sortDesc ? filteredReports : [...filteredReports].reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">
            {isExpenses ? "HR expense reports" : "Mission history"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Responsive table layout with filters, search, sorting, status badges, and detail actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setSortDesc((v) => !v)}
          >
            <CalendarRange className="h-4 w-4" />
            {sortDesc ? "Newest first" : "Oldest first"}
          </Button>
        </div>
      </div>

      <RecordTypeToggle
        value={recordType}
        onChange={setRecordType}
        missionCount={total}
        expenseCount={reports.length}
      />

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-row">
            <div>
              <CardTitle>
                {isExpenses ? "Expense report records" : "Mission records"}
              </CardTitle>
              <CardDescription>
                {isExpenses
                  ? "Search and review Annexe 03 expense sheets submitted by employees."
                  : "Search and review submitted, approved, rejected, and active missions."}
              </CardDescription>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder={
                  isExpenses
                    ? "Search by employee, department…"
                    : "Search by title, employee…"
                }
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Filter className="h-4 w-4 self-center text-muted-foreground" />
            {isExpenses
              ? EXPENSE_STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setExpenseStatus(f.value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      expenseStatus === f.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              : STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => handleStatusFilter(f.value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      statusFilter === f.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
          </div>
        </CardHeader>

        {isExpenses ? (
          <CardContent className="space-y-6">
            {reportsLoading ? (
              <p className="text-sm text-muted-foreground">Loading reports…</p>
            ) : orderedReports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No expense reports found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="text-muted-foreground">
                    <tr className="border-b border-border/60">
                      <th className="pb-3 font-medium">Employee</th>
                      <th className="pb-3 font-medium">Submitted by</th>
                      <th className="pb-3 font-medium">Department</th>
                      <th className="pb-3 font-medium">Period</th>
                      <th className="pb-3 font-medium">Rows</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Signature</th>
                      <th className="pb-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderedReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-border/50 last:border-none"
                      >
                        <td className="py-4">
                          <div className="font-medium">
                            {report.employeeName || report.submittedBy || "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.matricule || `#${report.id}`}
                          </div>
                        </td>
                        <td className="py-4">{report.submittedBy || "—"}</td>
                        <td className="py-4">{report.department || "—"}</td>
                        <td className="py-4">
                          {report.periode || "—"}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {report.periodFrom || "—"} → {report.periodTo || "—"}
                          </span>
                        </td>
                        <td className="py-4">{report.rows.length}</td>
                        <td className="py-4 font-medium">{report.totalCost}</td>
                        <td className="py-4">
                          <SignatureBadge signature={report.phrSignature} />
                        </td>
                        <td className="py-4 text-right">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-border/60 pt-6">
              <p className="text-sm text-muted-foreground">
                Showing {orderedReports.length} of {reports.length} expense
                report entries
              </p>
            </div>
          </CardContent>
        ) : (
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading missions…</p>
          ) : missions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No missions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <th className="pb-3 font-medium">Mission</th>
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Departure</th>
                    <th className="pb-3 font-medium">Return</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(sortDesc ? [...missions].reverse() : missions).map(
                    (mission) => (
                      <tr
                        key={mission.id}
                        className="border-b border-border/50 last:border-none"
                      >
                        <td className="py-4">
                          <div className="font-medium">{mission.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {mission.reference}
                          </div>
                        </td>
                        <td className="py-4">{mission.employee}</td>
                        <td className="py-4">{mission.department}</td>
                        <td className="py-4">
                          {mission.departureLocation}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {mission.departureDate}
                          </span>
                        </td>
                        <td className="py-4">
                          {mission.returnLocation}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {mission.returnDate}
                          </span>
                        </td>
                        <td className="py-4">
                          <StatusBadge status={mission.status} />
                        </td>
                        <td className="py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/workspace/history/${mission.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {missions.length} of {total} mission entries
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {pageNumbers.map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    variant={page === n ? "default" : "outline"}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                ))}
                {totalPages > 5 && page < totalPages && (
                  <span className="text-sm text-muted-foreground">…</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        )}
      </Card>
    </div>
  );
}
