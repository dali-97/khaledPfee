import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-me");
    const db = getDb();
    const [users] = await db.execute(
      "SELECT id, first_name, last_name, email, role, company, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [decoded.id],
    );
    req.user = users[0] ?? null;

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
