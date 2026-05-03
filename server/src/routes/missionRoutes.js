import { Router } from "express";
import {
  createMission,
  deleteMission,
  getMission,
  listMissions,
  updateMission,
  updateStatus,
} from "../controllers/missionController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication
router.use(protect);

router.get("/", listMissions);
router.post("/", createMission);
router.get("/:id", getMission);
router.put("/:id", updateMission);
router.patch("/:id/status", requireRole("admin", "manager"), updateStatus);
router.delete("/:id", requireRole("admin"), deleteMission);

export default router;
