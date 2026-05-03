import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sseRoutes from "./routes/sseRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { sseManager } from "./services/sseService.js";

dotenv.config();

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Mission Flow server is running.",
    allowedOrigin,
    sseClients: sseManager.connectedCount,
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/expense-reports", expenseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", sseRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
