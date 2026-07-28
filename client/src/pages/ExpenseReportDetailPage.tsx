import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getExpenseReport } from "@/lib/api";
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
import type { ExpenseReport } from "@/types/app";

export function ExpenseReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getExpenseReport(id)
      .then((res) => setReport(res.report))
      .catch(() =>
        setError("Expense report not found or could not be loaded."),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/workspace/history")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to history
        </Button>
        <h2 className="text-2xl font-semibold">Expense report details</h2>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading report…</p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}

      {!loading && report && (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <Badge variant="warning" className="mb-3 w-fit">
                Annexe 03
              </Badge>
              <CardTitle>
                {report.employeeName || report.submittedBy || "Expense report"}
              </CardTitle>
              <CardDescription>
                {[report.department, report.periode]
                  .filter(Boolean)
                  .join(" — ") || "Frais de mission"}
              </CardDescription>
            </div>
            <SignatureBadge signature={report.phrSignature} />
          </CardHeader>
          <CardContent>
            <ExpenseReportDetails report={report} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
