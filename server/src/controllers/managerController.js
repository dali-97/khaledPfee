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

// ─── POST /api/manager/employees ─────────────────────────────────────────────

export async function createEmployee(req, res, next) {
  try {
    const { firstName, lastName, email, password, company } = req.body;
    const managerId = req.user.id;
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
      "INSERT INTO users (first_name, last_name, email, password, role, company, manager_id) VALUES (?, ?, ?, ?, 'employee', ?, ?)",
      [firstName, lastName, normalizedEmail, hashedPassword, company || "", managerId],
    );

    const [[user]] = await db.execute(
      "SELECT id, first_name, last_name, email, role, company, manager_id, active, created_at FROM users WHERE id = ?",
      [result.insertId],
    );

    return res.status(201).json({ message: "Employee created.", user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/manager/employees ──────────────────────────────────────────────

export async function listEmployees(req, res, next) {
  try {
    const managerId = req.user.id;
    const db = getDb();

    const [employees] = await db.execute(
      `SELECT id, first_name, last_name, email, role, company, manager_id, active, created_at
         FROM users WHERE manager_id = ? AND role = 'employee' ORDER BY created_at DESC`,
      [managerId],
    );

    return res.json({ employees: employees.map(serializeUser) });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/manager/employees/:id/status ─────────────────────────────────

export async function toggleEmployeeStatus(req, res, next) {
  try {
    const managerId = req.user.id;
    const { id } = req.params;
    const db = getDb();

    const [[employee]] = await db.execute(
      "SELECT id, active FROM users WHERE id = ? AND manager_id = ? AND role = 'employee' LIMIT 1",
      [id, managerId],
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const newActive = employee.active ? 0 : 1;
    await db.execute("UPDATE users SET active = ? WHERE id = ?", [newActive, id]);

    return res.json({ active: Boolean(newActive) });
  } catch (err) {
    next(err);
  }
}
