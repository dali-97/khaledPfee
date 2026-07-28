import { FileSpreadsheet, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export type RecordType = "missions" | "expenses";

/**
 * Segmented switch between mission records and HR expense reports.
 * Used on the history and approval screens so both share one control.
 */
export function RecordTypeToggle({
  value,
  onChange,
  missionCount,
  expenseCount,
}: {
  value: RecordType;
  onChange: (value: RecordType) => void;
  missionCount?: number;
  expenseCount?: number;
}) {
  const options = [
    {
      key: "missions" as const,
      label: "Missions",
      icon: Plane,
      count: missionCount,
    },
    {
      key: "expenses" as const,
      label: "HR expense reports",
      icon: FileSpreadsheet,
      count: expenseCount,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Record type"
      className="inline-flex rounded-2xl border border-border/60 bg-muted/40 p-1"
    >
      {options.map((option) => {
        const isActive = value === option.key;
        return (
          <button
            key={option.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-border/60 text-muted-foreground",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
