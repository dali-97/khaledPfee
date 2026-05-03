import { Router } from "express";
import {
  deleteUser,
  getStats,
  listUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
