import { create } from "zustand";
import { clearSession, getSessionToken, getSessionUser, saveSession } from "@/lib/session";
import type { AuthUser } from "@/types/app";

interface AuthState {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  hydrateUser: (user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getSessionUser(),

  login(token, user) {
    saveSession(token, user);
    set({ user });
  },

  hydrateUser(user) {
    set({ user });
  },

  updateUser(user) {
    const token = getSessionToken();
    if (token) saveSession(token, user);
    set({ user });
  },

  logout() {
    clearSession();
    set({ user: null });
  },
}));
