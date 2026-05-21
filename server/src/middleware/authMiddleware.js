import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";

/**
 * Attach req.user from Bearer token in Authorization header
 * or from ?token= query param (needed for SSE / EventSource).
 */
export async function protect(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query?.token) {
    token = String(req.query.token);
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-me");
    const db = getDb();
    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, role, company, manager_id, active, created_at, updated_at
         FROM users WHERE id = ? LIMIT 1`,
      [decoded.id],
    );
    req.user = users[0] ?? null;

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists." });
    }
    if (!req.user.active) {
      return res.status(403).json({ message: "Account is disabled. Contact your administrator." });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

/**
 * Gate a route to one or more roles.
 *   router.patch('/status', protect, requireRole('admin', 'manager'), handler)
 * @param {...string} roles
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    }
    next();
  };
}
