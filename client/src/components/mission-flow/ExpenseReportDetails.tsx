import { InfoPair } from "@/components/mission-flow/primitives";
import { Badge } from "@/components/ui/badge";
import type { ExpenseReport } from "@/types/app";

const signatureVariant = {
  Pending: "warning",
  Validated: "success",
  "Returned for update": "danger",
} as const;

export function SignatureBadge({
  signature,
}: {
  signature: ExpenseReport["phrSignature"];
}) {
  return <Badge variant={signatureVariant[signature]}>{signature}</Badge>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Full read-only breakdown of an Annexe 03 expense report.
 *
 * Shared by the history detail page, the approval panel, and the dashboard
 * card so all three stay in sync.
 */
export function ExpenseReportDetails({ report }: { report: ExpenseReport }) {
  return (
    <div className="grid gap-6">
      <Section title="Employee">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Nom" value={report.employeeName || "—"} />
          <InfoPair label="Matricule" value={report.matricule || "—"} />
          <InfoPair label="Departement" value={report.department || "—"} />
          <InfoPair
            label="Submitted by"
            value={
              report.submittedBy
                ? `${report.submittedBy}${report.submittedByEmail ? ` (${report.submittedByEmail})` : ""}`
                : "—"
            }
          />
        </div>
      </Section>

      <Section title="Period">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Periode" value={report.periode || "—"} />
          <InfoPair
            label="Du → Au"
            value={
              report.periodFrom || report.periodTo
                ? `${report.periodFrom || "—"} → ${report.periodTo || "—"}`
                : "—"
            }
          />
          <InfoPair
            label="Linked mission"
            value={report.missionReference || "—"}
          />
          <InfoPair
            label="Total frais mission"
            value={String(report.totalCost)}
          />
        </div>
      </Section>

      <Section title={`Mission rows (${report.rows.length})`}>
        {report.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No detailed rows on this report.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="pb-2 pr-3 font-medium">Ref</th>
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Mission detaillee</th>
                  <th className="pb-2 pr-3 font-medium">Depart</th>
                  <th className="pb-2 pr-3 font-medium">Retour</th>
                  <th className="pb-2 pr-3 font-medium">Plage horaire</th>
                  <th className="pb-2 pr-3 font-medium">Cost center</th>
                  <th className="pb-2 text-right font-medium">Frais</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, index) => (
                  <tr
                    key={row.id ?? index}
                    className="border-b border-border/40 last:border-none"
                  >
                    <td className="py-2 pr-3">{row.ref || "—"}</td>
                    <td className="py-2 pr-3">{row.date || "—"}</td>
                    <td className="py-2 pr-3">{row.description || "—"}</td>
                    <td className="py-2 pr-3">{row.departureTime || "—"}</td>
                    <td className="py-2 pr-3">{row.returnTime || "—"}</td>
                    <td className="py-2 pr-3">{row.timeRange || "—"}</td>
                    <td className="py-2 pr-3">{row.costCenter || "—"}</td>
                    <td className="py-2 text-right">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border/60">
                  <td colSpan={7} className="pt-3 pr-3 font-medium">
                    Total
                  </td>
                  <td className="pt-3 text-right font-semibold">
                    {report.totalCost}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Section>

      {(report.hrComments || report.managerComment) && (
        <Section title="Comments">
          {report.hrComments && (
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Commentaires RH / PHR
              </p>
              <p className="text-sm">{report.hrComments}</p>
            </div>
          )}
          {report.managerComment && (
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Manager
              </p>
              <p className="text-sm">{report.managerComment}</p>
            </div>
          )}
        </Section>
      )}

      <Section title="Verification">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoPair label="Prepare par" value={report.preparedBy || "—"} />
          <InfoPair label="Initiales" value={report.initials || "—"} />
          <InfoPair label="PHR manager" value={report.phrManager || "—"} />
          <InfoPair label="Initiales PHR" value={report.phrInitials || "—"} />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-sm text-muted-foreground">
            Signature / validation
          </span>
          <SignatureBadge signature={report.phrSignature} />
        </div>
      </Section>
    </div>
  );
}
