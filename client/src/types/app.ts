import type { LucideIcon } from "lucide-react";

export type Theme = "light" | "dark";
export type Role = "employee" | "manager" | "admin";
export type WorkspacePage =
  | "overview"
  | "new-mission"
  | "history"
  | "approval"
  | "settings"
  | "admin";
export type MissionStatus = "pending" | "approved" | "rejected" | "in-progress";
export type Transportation =
  | "public_transport"
  | "personal_vehicle"
  | "service_vehicle";

// ─── Domain models ────────────────────────────────────────────────────────────

export type Mission = {
  id: string;
  title: string;
  destination: string;
  dates: string;
  budget: string;
  employee: string;
  department: string;
  status: MissionStatus;
};

/** Full mission record returned from the API */
export type MissionDetail = {
  id: string;
  reference: string;
  title: string;
  employeeId: string;
  employee: string;
  employeeEmail: string;
  matricule: string;
  department: string;
  purpose: string;
  departureLocation: string;
  departureDate: string;
  departureTime: string;
  returnLocation: string;
  returnDate: string;
  returnTime: string;
  extensions: string;
  transportation: Transportation;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  comments: string;
  managerComment: string;
  hierarchicalManager: string;
  departmentDirector: string;
  hrApproval: string;
  formDate: string;
  status: MissionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseRow = {
  id?: string;
  rowOrder?: number;
  ref: string;
  date: string;
  description: string;
  departureTime: string;
  returnTime: string;
  timeRange: string;
  costCenter: string;
  cost: number;
};

export type ExpenseReport = {
  id: string;
  missionId: string | null;
  createdBy: string;
  employeeName: string;
  department: string;
  matricule: string;
  periode: string;
  periodFrom: string;
  periodTo: string;
  hrComments: string;
  totalCost: number;
  preparedBy: string;
  initials: string;
  phrManager: string;
  phrInitials: string;
  phrSignature: "Pending" | "Validated" | "Returned for update";
  status: "draft" | "submitted" | "approved";
  rows: ExpenseRow[];
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  totalUsers: number;
  totalMissions: number;
  pending: number;
  approved: number;
  rejected: number;
  inProgress: number;
  totalReports: number;
};

// ─── UI / layout models ───────────────────────────────────────────────────────

export type KpiMetric = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
};

export type SidebarItem = {
  key: WorkspacePage;
  label: string;
  icon: LucideIcon;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};
