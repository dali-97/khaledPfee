import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "@/lib/api";
import { useSSE } from "@/hooks/useSSE";
import { getSessionToken, saveSession } from "@/lib/session";
import { router } from "@/router";
import { useAuthStore } from "@/store/authStore";

export default function App() {
  const hydrateUser = useAuthStore((state) => state.hydrateUser);
  const logout = useAuthStore((state) => state.logout);

  useSSE();

  useEffect(() => {
    const token = getSessionToken();
    if (!token) return;

    void getCurrentUser()
      .then((response) => {
        saveSession(token, response.user);
        hydrateUser(response.user);
      })
      .catch(() => {
        logout();
      });
  }, [hydrateUser, logout]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  );
}
