import { Router } from "express";
import {
  createManager,
  deleteManager,
  getManagerEmployees,
  getStats,
  listManagers,
  toggleManagerStatus,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/stats", getStats);
router.post("/managers", createManager);
router.get("/managers", listManagers);
router.get("/managers/:id/employees", getManagerEmployees);
router.patch("/managers/:id/status", toggleManagerStatus);
router.delete("/managers/:id", deleteManager);

export default router;
