import { getSessionToken } from "@/lib/session";
import type {
  AdminStats,
  AuthUser,
  ExpenseReport,
  MissionDetail,
  MissionStatus,
  Role,
} from "@/types/app";
import type {
  ExpenseReportFormValues,
  MissionFormValues,
} from "@/features/missions/schemas";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

async function request<T>(path: string, options: RequestInit) {
  const token = getSessionToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed.");
  }

  return payload as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<{ user: AuthUser }>("/auth/me", { method: "GET" });
}

export type UpdateProfilePayload = { firstName: string; lastName: string; email: string };
export type ChangePasswordPayload = { currentPassword: string; newPassword: string };

export function updateProfile(payload: UpdateProfilePayload) {
  return request<{ user: AuthUser }>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return request<{ message: string }>("/auth/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ─── Missions ─────────────────────────────────────────────────────────────────

export function createMission(payload: MissionFormValues) {
  return request<{ mission: MissionDetail }>("/missions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type ListMissionsParams = {
  status?: MissionStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export type ListMissionsResponse = {
  missions: MissionDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function listMissions(params?: ListMissionsParams) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return request<ListMissionsResponse>(
    `/missions${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
}

export function getMission(id: string) {
  return request<{ mission: MissionDetail }>(`/missions/${id}`, { method: "GET" });
}

export function updateMissionStatus(id: string, status: MissionStatus, managerComment?: string) {
  return request<{ mission: MissionDetail }>(`/missions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, managerComment }),
  });
}

// ─── Expense reports ──────────────────────────────────────────────────────────

export function createExpenseReport(payload: ExpenseReportFormValues) {
  return request<{ report: ExpenseReport }>("/expense-reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Scoped server-side by role: admins get every report, managers get their
 * team's, employees get their own.
 */
export function listExpenseReports() {
  return request<{ reports: ExpenseReport[] }>("/expense-reports", {
    method: "GET",
  });
}

export function getExpenseReport(id: string) {
  return request<{ report: ExpenseReport }>(`/expense-reports/${id}`, {
    method: "GET",
  });
}

/** Admin, or the submitter's own manager, approves or rejects a report. */
export function updateExpenseReportStatus(
  id: string,
  status: "approved" | "rejected",
  managerComment?: string,
) {
  return request<{ report: ExpenseReport }>(`/expense-reports/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, managerComment }),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function getAdminStats() {
  return request<{ stats: AdminStats }>("/admin/stats", { method: "GET" });
}

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  company: string;
  active: boolean;
  createdAt: string;
};

export type ManagerUser = AdminUser & { employeeCount: number };

export function createManager(payload: CreateUserPayload) {
  return request<{ user: AdminUser }>("/admin/managers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listManagers() {
  return request<{ managers: ManagerUser[] }>("/admin/managers", { method: "GET" });
}

export function getManagerEmployees(managerId: string) {
  return request<{ employees: EmployeeUser[] }>(`/admin/managers/${managerId}/employees`, {
    method: "GET",
  });
}

export function toggleManagerStatus(managerId: string) {
  return request<{ active: boolean }>(`/admin/managers/${managerId}/status`, {
    method: "PATCH",
  });
}

export function deleteManager(managerId: string) {
  return request<{ message: string }>(`/admin/managers/${managerId}`, {
    method: "DELETE",
  });
}

// ─── Manager ──────────────────────────────────────────────────────────────────

export type EmployeeUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  company: string;
  managerId: string | null;
  active: boolean;
  createdAt: string;
};

export function createEmployee(payload: CreateUserPayload) {
  return request<{ user: EmployeeUser }>("/manager/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listManagerEmployees() {
  return request<{ employees: EmployeeUser[] }>("/manager/employees", { method: "GET" });
}

export function toggleEmployeeStatus(employeeId: string) {
  return request<{ active: boolean }>(`/manager/employees/${employeeId}/status`, {
    method: "PATCH",
  });
}
