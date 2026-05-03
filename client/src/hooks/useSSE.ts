import { useEffect, useRef } from "react";
import { getSessionToken } from "@/lib/session";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/**
 * Opens a persistent SSE connection to /api/events whenever the user is
 * authenticated.  Automatically closes on sign-out and reconnects on sign-in.
 *
 * Events are forwarded to the notification store so any component can read
 * them without knowing about the SSE connection.
 */
export function useSSE() {
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!user) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    const token = getSessionToken();
    if (!token) return;

    // EventSource doesn't support custom headers → pass JWT as query param
    const url = `${API_BASE}/events?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("connected", () => {
      // Silently acknowledged – no user-visible notification needed
    });

    es.addEventListener("mission:created", (e) => {
      const data = JSON.parse(e.data) as { message: string };
      addNotification({
        type: "mission:created",
        title: "New Mission",
        message: data.message,
        data,
      });
    });

    es.addEventListener("mission:status_changed", (e) => {
      const data = JSON.parse(e.data) as { message: string; status: string };
      addNotification({
        type: "mission:status_changed",
        title: `Mission ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
        message: data.message,
        data,
      });
    });

    es.addEventListener("expense_report:created", (e) => {
      const data = JSON.parse(e.data) as { message: string };
      addNotification({
        type: "expense_report:created",
        title: "New Expense Report",
        message: data.message,
        data,
      });
    });

    es.onerror = () => {
      // Browser will auto-reconnect after a short delay — no action needed
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [user, addNotification]);
}
