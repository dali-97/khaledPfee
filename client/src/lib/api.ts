import { getSessionToken } from "@/lib/session";
import type { AuthUser, Role } from "@/types/app";

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
