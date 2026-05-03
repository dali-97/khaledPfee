import { createBrowserRouter, Navigate } from "react-router-dom";
import { WorkspaceLayout } from "@/layouts/WorkspaceLayout";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { AuthPage } from "@/pages/AuthPage";
import { LandingPage } from "@/pages/LandingPage";
import { MissionApprovalPage } from "@/pages/MissionApprovalPage";
import { MissionHistoryPage } from "@/pages/MissionHistoryPage";
import { MissionSubmissionPage } from "@/pages/MissionSubmissionPage";
import { ProfileSettingsPage } from "@/pages/ProfileSettingsPage";
import { UserDashboardPage } from "@/pages/UserDashboardPage";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "./ProtectedRoute";

function WorkspaceIndex() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;
  if (user.role === "admin") return <Navigate to="/workspace/admin" replace />;
  if (user.role === "manager") return <Navigate to="/workspace/approval" replace />;
  return <Navigate to="/workspace/overview" replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute>
        <WorkspaceLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <WorkspaceIndex /> },
      { path: "overview", element: <UserDashboardPage /> },
      { path: "new-mission", element: <MissionSubmissionPage /> },
      { path: "history", element: <MissionHistoryPage /> },
      { path: "approval", element: <MissionApprovalPage /> },
      { path: "admin", element: <AdminDashboardPage /> },
      { path: "settings", element: <ProfileSettingsPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
