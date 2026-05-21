import bcrypt from "bcryptjs";
import { getDb } from "../config/db.js";

function serializeUser(u) {
  return {
    id: String(u.id),
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    role: u.role,
    company: u.company || "",
    managerId: u.manager_id ? String(u.manager_id) : null,
    active: Boolean(u.active),
    createdAt: u.created_at,
  };
}

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

export async function getStats(req, res, next) {
  try {
    const db = getDb();

    const [
      [[{ totalUsers }]],
      [[{ totalMissions }]],
      [[{ pending }]],
      [[{ approved }]],
      [[{ rejected }]],
      [[{ inProgress }]],
      [[{ totalReports }]],
    ] = await Promise.all([
      db.execute("SELECT COUNT(*) AS totalUsers FROM users"),
      db.execute("SELECT COUNT(*) AS totalMissions FROM missions"),
      db.execute("SELECT COUNT(*) AS pending FROM missions WHERE status = 'pending'"),
      db.execute("SELECT COUNT(*) AS approved FROM missions WHERE status = 'approved'"),
      db.execute("SELECT COUNT(*) AS rejected FROM missions WHERE status = 'rejected'"),
      db.execute("SELECT COUNT(*) AS inProgress FROM missions WHERE status = 'in-progress'"),
      db.execute("SELECT COUNT(*) AS totalReports FROM expense_reports"),
    ]);

    const [monthly] = await db.execute(`
      SELECT DATE_FORMAT(created_at, '%b') AS month,
             COUNT(*)                      AS count
      FROM missions
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
      ORDER BY MIN(created_at)
    `);

    return res.json({
      stats: { totalUsers, totalMissions, pending, approved, rejected, inProgress, totalReports },
      monthly: monthly.map((m) => ({ label: m.month, value: Number(m.count) })),
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/admin/managers ─────────────────────────────────────────────────

export async function createManager(req, res, next) {
  try {
    const { firstName, lastName, email, password, company } = req.body;
    const db = getDb();

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const normalizedEmail = email.toLowerCase();
    const [[existing]] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (first_name, last_name, email, password, role, company) VALUES (?, ?, ?, ?, 'manager', ?)",
      [firstName, lastName, normalizedEmail, hashedPassword, company || ""],
    );

    const [[user]] = await db.execute(
      "SELECT id, first_name, last_name, email, role, company, manager_id, active, created_at FROM users WHERE id = ?",
      [result.insertId],
    );

    return res.status(201).json({ message: "Manager created.", user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/admin/managers ──────────────────────────────────────────────────

export async function listManagers(req, res, next) {
  try {
    const db = getDb();
    const [managers] = await db.execute(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.company,
             u.manager_id, u.active, u.created_at,
             COUNT(e.id) AS employee_count
      FROM users u
      LEFT JOIN users e ON e.manager_id = u.id
      WHERE u.role = 'manager'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return res.json({
      managers: managers.map((m) => ({
        ...serializeUser(m),
        employeeCount: Number(m.employee_count),
      })),
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/admin/managers/:id/employees ────────────────────────────────────

export async function getManagerEmployees(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const [employees] = await db.execute(
      `SELECT id, first_name, last_name, email, role, company, manager_id, active, created_at
         FROM users WHERE manager_id = ? AND role = 'employee' ORDER BY created_at DESC`,
      [id],
    );

    return res.json({ employees: employees.map(serializeUser) });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/admin/managers/:id/status ────────────────────────────────────

export async function toggleManagerStatus(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const [[manager]] = await db.execute(
      "SELECT id, active FROM users WHERE id = ? AND role = 'manager' LIMIT 1",
      [id],
    );
    if (!manager) return res.status(404).json({ message: "Manager not found." });

    const newActive = manager.active ? 0 : 1;
    await db.execute("UPDATE users SET active = ? WHERE id = ?", [newActive, id]);

    return res.json({ active: Boolean(newActive) });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/admin/managers/:id ──────────────────────────────────────────

export async function deleteManager(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const actorId = req.user.id;

    if (Number(id) === actorId) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const [[manager]] = await db.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'manager' LIMIT 1",
      [id],
    );
    if (!manager) return res.status(404).json({ message: "Manager not found." });

    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "Manager deleted." });
  } catch (err) {
    next(err);
  }
}
