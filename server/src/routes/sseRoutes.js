import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sseManager } from "../services/sseService.js";

const router = Router();

/**
 * GET /api/events
 *
 * Opens a persistent SSE stream for the authenticated user.
 * Clients pass the JWT via ?token= because EventSource doesn't support headers.
 *
 * Events emitted:
 *   connected            – initial handshake
 *   mission:created      – new mission submitted (admins + managers)
 *   mission:status_changed – mission approved/rejected (owner + managers)
 *   expense_report:created – new HR expense report (admins)
 *   : heartbeat          – keep-alive comment every 25 s
 */
router.get("/", protect, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx proxy buffering
  res.flushHeaders();

  const userId = req.user.id;
  const role = req.user.role;

  sseManager.addClient(userId, role, res);

  // Initial handshake event
  res.write(
    `event: connected\ndata: ${JSON.stringify({
      userId,
      role,
      connectedAt: new Date().toISOString(),
    })}\n\n`,
  );

  // Heartbeat to keep the TCP connection alive through proxies
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 25_000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseManager.removeClient(userId, res);
  });
});

export default router;
