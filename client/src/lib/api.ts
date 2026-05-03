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

export type AuthFormPayload = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: Role;
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

export function register(payload: AuthFormPayload) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: Pick<AuthFormPayload, "email" | "password">) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<{ user: AuthUser }>("/auth/me", {
    method: "GET",
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
  return request<{ mission: MissionDetail }>(`/missions/${id}`, {
    method: "GET",
  });
}

export function updateMissionStatus(
  id: string,
  status: MissionStatus,
  managerComment?: string,
) {
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

// ─── Profile ──────────────────────────────────────────────────────────────────

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
  createdAt: string;
};

export function listAdminUsers(params?: { search?: string; role?: Role }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.role) qs.set("role", params.role);
  const query = qs.toString();
  return request<{ users: AdminUser[] }>(
    `/admin/users${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
}

export function updateUserRole(userId: string, role: Role) {
  return request<{ user: AdminUser }>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
