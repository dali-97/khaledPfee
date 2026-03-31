import { useEffect, useState } from "react";
import { heroMetrics } from "@/data/mission-flow";
import { login, register, type AuthFormPayload } from "@/lib/api";
import { WorkspaceLayout } from "@/layouts/WorkspaceLayout";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AuthPage } from "@/pages/AuthPage";
import { LandingPage } from "@/pages/LandingPage";
import { MissionApprovalPage } from "@/pages/MissionApprovalPage";
import { MissionHistoryPage } from "@/pages/MissionHistoryPage";
import { MissionSubmissionPage } from "@/pages/MissionSubmissionPage";
import { ProfileSettingsPage } from "@/pages/ProfileSettingsPage";
import { UserDashboardPage } from "@/pages/UserDashboardPage";
import type { AppScreen, Role, Theme, WorkspacePage } from "@/types/app";

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("mission-flow-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [role, setRole] = useState<Role>("employee");
  const [workspacePage, setWorkspacePage] = useState<WorkspacePage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("mission-flow-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (role === "admin" && workspacePage === "overview") {
      setWorkspacePage("admin");
      return;
    }

    if (role !== "admin" && workspacePage === "admin") {
      setWorkspacePage("overview");
      return;
    }

    if (role === "manager" && workspacePage === "new-mission") {
      setWorkspacePage("approval");
      return;
    }

    if (screen === "workspace" && role === "employee" && workspacePage === "approval") {
      setWorkspacePage("overview");
    }
  }, [role, screen, workspacePage]);

  const openWorkspace = (selectedRole: Role, page?: WorkspacePage) => {
    setRole(selectedRole);
    setScreen("workspace");
    setWorkspacePage(
      page ??
        (selectedRole === "admin"
          ? "admin"
          : selectedRole === "manager"
            ? "approval"
            : "overview"),
    );
  };

  const handleRegister = async (payload: AuthFormPayload) => {
    const response = await register(payload);
    window.localStorage.setItem("mission-flow-token", response.token);
    openWorkspace(response.user.role);
  };

  const handleLogin = async (payload: AuthFormPayload) => {
    const response = await login({
      email: payload.email,
      password: payload.password,
    });
    window.localStorage.setItem("mission-flow-token", response.token);
    openWorkspace(response.user.role);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" />

      {screen === "landing" && (
        <LandingPage
          theme={theme}
          onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
          onNavigate={setScreen}
          onGetStarted={() => openWorkspace("employee")}
          onLogin={() => setScreen("login")}
          metrics={heroMetrics}
        />
      )}

      {screen === "login" && (
        <AuthPage
          title="Welcome back"
          subtitle="Monitor missions, approvals, and travel budgets with one polished workspace."
          actionLabel="Sign in to Mission Flow"
          alternateLabel="Need an account?"
          alternateAction="Create one"
          onAlternate={() => setScreen("register")}
          role={role}
          setRole={setRole}
          onSubmit={handleLogin}
          onBack={() => setScreen("landing")}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
          theme={theme}
          onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      )}

      {screen === "register" && (
        <AuthPage
          title="Create your workspace"
          subtitle="Launch a clean mission management flow for employees, directors, and administrators."
          actionLabel="Create Mission Flow account"
          alternateLabel="Already have access?"
          alternateAction="Go to login"
          onAlternate={() => setScreen("login")}
          role={role}
          setRole={setRole}
          onSubmit={handleRegister}
          onBack={() => setScreen("landing")}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
          theme={theme}
          onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
          register
        />
      )}

      {screen === "workspace" && (
        <WorkspaceLayout
          role={role}
          page={workspacePage}
          onPageChange={(page) => {
            setWorkspacePage(page);
            setSidebarOpen(false);
          }}
          onBackToLanding={() => {
            setScreen("landing");
            setSidebarOpen(false);
          }}
          theme={theme}
          onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen((open) => !open)}
          onSidebarClose={() => setSidebarOpen(false)}
          setRole={setRole}
          setScreen={setScreen}
        >
          {role === "admin" && workspacePage === "admin" ? (
            <AdminDashboardPage onOpenHistory={() => setWorkspacePage("history")} />
          ) : null}
          {workspacePage === "overview" ? (
            <UserDashboardPage role={role} onNewMission={() => setWorkspacePage("new-mission")} />
          ) : null}
          {workspacePage === "new-mission" ? <MissionSubmissionPage /> : null}
          {workspacePage === "history" ? <MissionHistoryPage /> : null}
          {workspacePage === "approval" ? (
            <MissionApprovalPage showDetails={showDetails} setShowDetails={setShowDetails} />
          ) : null}
          {workspacePage === "settings" ? (
            <ProfileSettingsPage
              theme={theme}
              setTheme={setTheme}
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              digestEnabled={digestEnabled}
              setDigestEnabled={setDigestEnabled}
              role={role}
            />
          ) : null}
        </WorkspaceLayout>
      )}
    </div>
  );
}

export default App;
