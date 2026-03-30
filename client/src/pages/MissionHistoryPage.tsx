import { CalendarRange, Eye, Filter, Search } from "lucide-react";
import { missions } from "@/data/mission-flow";
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

export function MissionHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Mission history</h2>
          <p className="mt-2 text-muted-foreground">
            Responsive table layout with filters, search, sorting, status badges, and detail actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <CalendarRange className="h-4 w-4" />
            Sort by date
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Mission records</CardTitle>
            <CardDescription>Search and review submitted, approved, rejected, and active missions.</CardDescription>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by title, employee, destination..." />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="pb-3 font-medium">Mission</th>
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Dates</th>
                  <th className="pb-3 font-medium">Budget</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => (
                  <tr key={mission.id} className="border-b border-border/50 last:border-none">
                    <td className="py-4">
                      <div className="font-medium">{mission.title}</div>
                      <div className="text-xs text-muted-foreground">{mission.destination}</div>
                    </td>
                    <td className="py-4">{mission.employee}</td>
                    <td className="py-4">{mission.department}</td>
                    <td className="py-4">{mission.dates}</td>
                    <td className="py-4">{mission.budget}</td>
                    <td className="py-4">
                      <StatusBadge status={mission.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing 1-4 of 48 mission entries</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
