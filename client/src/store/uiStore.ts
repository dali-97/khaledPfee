import { create } from "zustand";
import type { Theme } from "@/types/app";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("mission-flow-theme");
  return saved === "dark" ? "dark" : "light";
};

const initialTheme = getInitialTheme();
document.documentElement.classList.toggle("dark", initialTheme === "dark");

export const useUIStore = create<UIState>((set, get) => ({
  theme: initialTheme,
  sidebarOpen: false,

  toggleTheme() {
    const next: Theme = get().theme === "light" ? "dark" : "light";
    localStorage.setItem("mission-flow-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    set({ theme: next });
  },

  setTheme(theme) {
    localStorage.setItem("mission-flow-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },

  setSidebarOpen(sidebarOpen) {
    set({ sidebarOpen });
  },

  toggleSidebar() {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
}));
