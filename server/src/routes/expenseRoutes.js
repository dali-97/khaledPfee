import { Router } from "express";
import {
  createReport,
  getReport,
  listReports,
  updateReport,
} from "../controllers/expenseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listReports);
router.post("/", requireRole("manager", "admin"), createReport);
router.get("/:id", getReport);
router.put("/:id", requireRole("manager", "admin"), updateReport);

export default router;
