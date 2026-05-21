import { Router } from "express";
import {
  createEmployee,
  listEmployees,
  toggleEmployeeStatus,
} from "../controllers/managerController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("manager"));

router.post("/employees", createEmployee);
router.get("/employees", listEmployees);
router.patch("/employees/:id/status", toggleEmployeeStatus);

export default router;
