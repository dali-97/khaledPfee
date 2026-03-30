import type { LucideIcon } from "lucide-react";

export type Theme = "light" | "dark";
export type Role = "employee" | "manager" | "admin";
export type AppScreen = "landing" | "login" | "register" | "workspace";
export type WorkspacePage =
  | "overview"
  | "new-mission"
  | "history"
  | "approval"
  | "settings"
  | "admin";
export type MissionStatus = "pending" | "approved" | "rejected" | "in-progress";

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
