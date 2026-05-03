import { Router } from "express";
import { login, me, register, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, changePassword);

export default router;
