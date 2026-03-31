import { useEffect, useState } from "react";
import { heroMetrics } from "@/data/mission-flow";
import { getCurrentUser, login, register, type AuthFormPayload } from "@/lib/api";
import { clearSession, getSessionToken, getSessionUser, saveSession } from "@/lib/session";
import { WorkspaceLayout } from "@/layouts/WorkspaceLayout";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AuthPage } from "@/pages/AuthPage";
import { LandingPage } from "@/pages/LandingPage";
import { MissionApprovalPage } from "@/pages/MissionApprovalPage";
import { MissionHistoryPage } from "@/pages/MissionHistoryPage";
import { MissionSubmissionPage } from "@/pages/MissionSubmissionPage";
import { ProfileSettingsPage } from "@/pages/ProfileSettingsPage";
import { UserDashboardPage } from "@/pages/UserDashboardPage";
import type { AppScreen, AuthUser, Role, Theme, WorkspacePage } from "@/types/app";

function App() {
  const initialUser = getSessionUser();
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("mission-flow-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [role, setRole] = useState<Role>(initialUser?.role ?? "employee");
  const [workspacePage, setWorkspacePage] = useState<WorkspacePage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("mission-flow-theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = getSessionToken();
    const user = getSessionUser();

    if (!token || !user) {
      clearSession();
      setCurrentUser(null);
      return;
    }

    setCurrentUser(user);
    setRole(user.role);

    void getCurrentUser()
      .then((response) => {
        saveSession(token, response.user);
        setCurrentUser(response.user);
        setRole(response.user.role);
      })
      .catch(() => {
        clearSession();
        setCurrentUser(null);
        setRole("employee");
      });
  }, []);

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
    saveSession(response.token, response.user);
    setCurrentUser(response.user);
    openWorkspace(response.user.role);
  };

  const handleLogin = async (payload: AuthFormPayload) => {
    const response = await login({
      email: payload.email,
      password: payload.password,
    });
    saveSession(response.token, response.user);
    setCurrentUser(response.user);
    openWorkspace(response.user.role);
  };

  const handleGetStarted = () => {
    if (currentUser) {
      openWorkspace(currentUser.role);
      return;
    }

    setScreen("login");
  };

  const handleSignOut = () => {
    clearSession();
    setCurrentUser(null);
    setRole("employee");
    setScreen("landing");
    setWorkspacePage("overview");
    setSidebarOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" />

      {screen === "landing" && (
        <LandingPage
          theme={theme}
          onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
          onNavigate={setScreen}
          onGetStarted={handleGetStarted}
          onLogin={() => setScreen("login")}
          metrics={heroMetrics}
          isAuthenticated={Boolean(currentUser)}
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
          onSignOut={handleSignOut}
          currentUser={currentUser}
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
