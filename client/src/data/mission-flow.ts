import {
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  Plane,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { KpiMetric, Mission, MissionStatus, Role, SidebarItem } from "@/types/app";

export const missions: Mission[] = [
  {
    id: "MF-2048",
    title: "Client Implementation Sprint",
    destination: "Paris, France",
    dates: "Apr 12 - Apr 16",
    budget: "$2,480",
    employee: "Yasmine Ali",
    department: "Operations",
    status: "in-progress",
  },
  {
    id: "MF-2037",
    title: "Partner Alignment Meeting",
    destination: "Dubai, UAE",
    dates: "Apr 24 - Apr 28",
    budget: "$4,320",
    employee: "Khaled Ben Salah",
    department: "Sales",
    status: "pending",
  },
  {
    id: "MF-2021",
    title: "Regional Audit Review",
    destination: "Casablanca, Morocco",
    dates: "May 03 - May 06",
    budget: "$1,960",
    employee: "Lina Harbi",
    department: "Finance",
    status: "approved",
  },
  {
    id: "MF-2006",
    title: "Supplier Renegotiation Tour",
    destination: "Milan, Italy",
    dates: "May 08 - May 10",
    budget: "$2,140",
    employee: "Sami Cherif",
    department: "Procurement",
    status: "rejected",
  },
];

export const activityFeed = [
  "Mission MF-2048 moved to in progress after travel check-in confirmation.",
  "Finance exported the Q1 reimbursement report in CSV format.",
  "Manager comment added on MF-2037 requesting hotel rate details.",
  "New account provisioned for a regional sales coordinator.",
];

export const heroMetrics = [
  { label: "Approval time", value: "< 24h" },
  { label: "Missions managed", value: "1.2k+" },
  { label: "Expense visibility", value: "100%" },
];

export const kpis: Record<"employee" | "admin", KpiMetric[]> = {
  employee: [
    { label: "Total Missions", value: "28", delta: "+12% this quarter", icon: BriefcaseBusiness },
    { label: "In Progress", value: "3", delta: "1 departing this week", icon: Plane },
    { label: "Approved Missions", value: "19", delta: "Fast-tracked approvals", icon: CheckCircle2 },
    { label: "Pending / Rejected", value: "6", delta: "2 need updates", icon: Clock3 },
  ],
  admin: [
    { label: "Total Users", value: "468", delta: "+14 hires this month", icon: Users },
    { label: "Total Missions", value: "1,284", delta: "+8.2% MoM", icon: BriefcaseBusiness },
    { label: "Pending Missions", value: "56", delta: "12 urgent reviews", icon: Clock3 },
    { label: "Approved Missions", value: "924", delta: "71.9% completion", icon: CheckCircle2 },
    { label: "Rejected Missions", value: "81", delta: "Improving quality", icon: XCircle },
    { label: "In Progress", value: "223", delta: "Global travel live", icon: Plane },
  ],
};

export const sidebarItems: Record<Role, SidebarItem[]> = {
  employee: [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard },
    { key: "new-mission", label: "Mission Forms", icon: FileText },
    { key: "history", label: "Mission History", icon: CalendarRange },
    { key: "settings", label: "Profile & Settings", icon: Settings },
  ],
  manager: [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard },
    { key: "history", label: "Mission History", icon: CalendarRange },
    { key: "approval", label: "Approvals", icon: ShieldCheck },
    { key: "settings", label: "Profile & Settings", icon: Settings },
  ],
  admin: [
    { key: "admin", label: "Admin Dashboard", icon: LayoutDashboard },
    { key: "new-mission", label: "HR Forms", icon: FileText },
    { key: "history", label: "Mission Management", icon: CalendarRange },
    { key: "approval", label: "Approvals", icon: ShieldCheck },
    { key: "settings", label: "System Settings", icon: Settings },
  ],
};

export const statusStyle: Record<
  MissionStatus,
  { label: string; variant: "warning" | "success" | "danger" | "default" }
> = {
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  "in-progress": { label: "In Progress", variant: "default" },
};

export const benefitCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Employee workspace",
    description:
      "Create missions, track approvals, and keep every trip plan, budget, and attachment in one place.",
    icon: UserRound,
  },
  {
    title: "Manager approval flow",
    description:
      "Review requests with full context, add comments, approve faster, and keep departments moving.",
    icon: ShieldCheck,
  },
  {
    title: "Admin control center",
    description:
      "Monitor platform-wide activity, manage users, export reports, and archive records without friction.",
    icon: Building2,
  },
];
