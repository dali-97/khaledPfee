import { Router } from "express";
import {
  createReport,
  getReport,
  listReports,
  updateReport,
  updateReportStatus,
} from "../controllers/expenseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listReports);
router.post("/", createReport);
router.get("/:id", getReport);
// updateReport enforces "owner or admin" itself.
router.put("/:id", updateReport);
// updateReportStatus further restricts managers to their own direct reports.
router.patch("/:id/status", requireRole("admin", "manager"), updateReportStatus);

export default router;
