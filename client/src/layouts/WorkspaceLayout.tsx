import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Globe2,
  LogOut,
  Menu,
  Plane,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { sidebarItems } from "@/data/mission-flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggleButton } from "@/components/mission-flow/primitives";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUIStore } from "@/store/uiStore";
import type { Role, SidebarItem, WorkspacePage } from "@/types/app";

const pageTitles: Record<WorkspacePage, (isAdmin: boolean) => string> = {
  overview: () => "Dashboard",
  "new-mission": (isAdmin) => (isAdmin ? "HR Forms" : "Mission Forms"),
  history: (isAdmin) => (isAdmin ? "Mission Management" : "Mission History"),
  approval: () => "Mission Validation",
  settings: (isAdmin) => (isAdmin ? "System Settings" : "Profile & Settings"),
  admin: () => "Admin Dashboard",
  managers: () => "Manage Managers",
  team: () => "My Team",
};

export function WorkspaceLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, toggleSidebar } =
    useUIStore();

  const role = user?.role ?? "employee";
  const segment = pathname.split("/").at(-1) as WorkspacePage;
  const isAdmin = role === "admin";
  const title = pageTitles[segment]?.(isAdmin) ?? "Dashboard";
  const navItems = sidebarItems[role];

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[290px] border-r border-border/60 bg-card/95 p-5 shadow-xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          role={role}
          pathname={pathname}
          items={navItems}
          onNavigate={(path) => {
            navigate(path);
            setSidebarOpen(false);
          }}
          onBackToLanding={() => {
            navigate("/");
            setSidebarOpen(false);
          }}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside className="hidden w-[290px] shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-[290px] border-r border-border/60 bg-card/95 p-5">
          <SidebarContent
            role={role}
            pathname={pathname}
            items={navItems}
            onNavigate={(path) => navigate(path)}
            onBackToLanding={() => navigate("/")}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Mission Flow</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="capitalize">
                    {role === "employee"
                      ? "Employee"
                      : role === "manager"
                        ? "Manager"
                        : "Admin"}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold">{title}</h1>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="relative hidden w-full max-w-sm md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search missions, employees, destinations..."
                />
              </div>
              <ThemeToggleButton theme={theme} onClick={toggleTheme} />
              <NotificationBell />
              <div className="group relative">
                <button className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 py-2 text-left shadow-sm transition hover:border-primary/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Mission User"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role}
                    </p>
                  </div>
                </button>
                <div className="invisible absolute right-0 top-[calc(100%+0.75rem)] z-20 w-64 rounded-2xl border border-border/70 bg-popover p-2 opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => navigate("/workspace/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    Profile settings
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger hover:bg-danger/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotificationStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-80 rounded-2xl border border-border/70 bg-popover shadow-xl">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 border-b border-border/40 px-4 py-3 last:border-none",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        aria-label="Mark read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
      )}
    </div>
  );
}

function SidebarContent({
  role,
  pathname,
  items,
  onNavigate,
  onBackToLanding,
  onClose,
}: {
  role: Role;
  pathname: string;
  items: SidebarItem[];
  onNavigate: (path: string) => void;
  onBackToLanding: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Mission Flow</p>
            <p className="text-sm text-muted-foreground capitalize">
              {role} workspace
            </p>
          </div>
        </div>
        {onClose ? (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-2">
        {items.map((item) => {
          const path = `/workspace/${item.key}`;
          const isActive = pathname === path;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(path)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <Card className="mt-8 border-primary/10 bg-gradient-to-br from-primary/10 to-card">
        <CardHeader className="space-y-3">
          <Badge className="w-fit">Mission health</Badge>
          <CardTitle className="text-base">Policy compliance stays visible.</CardTitle>
          <CardDescription>
            Travel budgets, approvals, and attachments remain organized across the
            full mission cycle.
          </CardDescription>
        </CardHeader>
      </Card>

      <button
        onClick={onBackToLanding}
        className="mt-auto flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <Globe2 className="h-4 w-4" />
        Back to landing page
      </button>
    </div>
  );
}
