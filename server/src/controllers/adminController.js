import { getDb } from "../config/db.js";

function serializeUser(u) {
  return {
    id: String(u.id),
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    role: u.role,
    company: u.company || "",
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

    // Monthly mission counts (last 6 months)
    const [monthly] = await db.execute(`
      SELECT DATE_FORMAT(created_at, '%b') AS month,
             COUNT(*)                      AS count
      FROM missions
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
      ORDER BY MIN(created_at)
    `);

    return res.json({
      stats: {
        totalUsers,
        totalMissions,
        pending,
        approved,
        rejected,
        inProgress,
        totalReports,
      },
      monthly: monthly.map((m) => ({ label: m.month, value: Number(m.count) })),
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

export async function listUsers(req, res, next) {
  try {
    const db = getDb();
    const { search, role } = req.query;

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push(
        "(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)",
      );
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (role) {
      conditions.push("role = ?");
      params.push(role);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email, role, company, created_at
         FROM users ${where} ORDER BY created_at DESC`,
      params,
    );

    return res.json({ users: users.map(serializeUser) });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/admin/users/:id/role ─────────────────────────────────────────

export async function updateUserRole(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const { role } = req.body;

    const valid = ["employee", "manager", "admin"];
    if (!valid.includes(role)) {
      return res.status(400).json({ message: "Invalid role value." });
    }

    const [[user]] = await db.execute(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id],
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    // Prevent removing the last admin
    if (role !== "admin") {
      const [[{ adminCount }]] = await db.execute(
        "SELECT COUNT(*) AS adminCount FROM users WHERE role = 'admin'",
      );
      const [[target]] = await db.execute(
        "SELECT role FROM users WHERE id = ?",
        [id],
      );
      if (target.role === "admin" && adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Cannot remove the last admin." });
      }
    }

    await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    return res.json({ message: "User role updated." });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────

export async function deleteUser(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;
    const actorId = req.user.id;

    if (Number(id) === actorId) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const [[user]] = await db.execute(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id],
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
}
