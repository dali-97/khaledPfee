import { getDb } from "../config/db.js";
import { sseManager } from "../services/sseService.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n) {
  return `MF-${String(n).padStart(4, "0")}`;
}

function serialize(row) {
  const dep = row.departure_date
    ? new Date(row.departure_date).toISOString().split("T")[0]
    : "";
  const ret = row.return_date
    ? new Date(row.return_date).toISOString().split("T")[0]
    : "";

  return {
    id: String(row.id),
    reference: row.reference || pad(row.id),
    title: row.title,
    employeeId: String(row.employee_id),
    employee: row.first_name ? `${row.first_name} ${row.last_name}` : "",
    employeeEmail: row.email || "",
    matricule: row.matricule || "",
    department: row.department || "",
    purpose: row.purpose || "",
    departureLocation: row.departure_location || "",
    departureDate: dep,
    departureTime: row.departure_time || "",
    returnLocation: row.return_location || "",
    returnDate: ret,
    returnTime: row.return_time || "",
    extensions: row.extensions || "",
    transportation: row.transportation || "public_transport",
    meals: {
      breakfast: Boolean(row.meal_breakfast),
      lunch: Boolean(row.meal_lunch),
      dinner: Boolean(row.meal_dinner),
    },
    comments: row.comments || "",
    managerComment: row.manager_comment || "",
    hierarchicalManager: row.hierarchical_manager || "",
    departmentDirector: row.department_director || "",
    hrApproval: row.hr_approval || "",
    formDate: row.form_date
      ? new Date(row.form_date).toISOString().split("T")[0]
      : "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const JOIN = `
  SELECT m.*, u.first_name, u.last_name, u.email, u.manager_id
  FROM missions m
  LEFT JOIN users u ON m.employee_id = u.id
`;

// ─── GET /api/missions ────────────────────────────────────────────────────────

export async function listMissions(req, res, next) {
  try {
    const db = getDb();
    const { role, id: userId } = req.user;

    const { status, department, search } = req.query;
    const conditions = [];
    const params = [];

    if (role === "employee") {
      conditions.push("m.employee_id = ?");
      params.push(userId);
    } else if (role === "manager") {
      conditions.push("u.manager_id = ?");
      params.push(userId);
    }

    if (status) {
      conditions.push("m.status = ?");
      params.push(status);
    }
    if (department) {
      conditions.push("m.department = ?");
      params.push(department);
    }
    if (search) {
      conditions.push(
        "(m.title LIKE ? OR m.department LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR m.departure_location LIKE ?)",
      );
      const like = `%${search}%`;
      params.push(like, like, like, like, like);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await db.execute(
      `${JOIN} ${where} ORDER BY m.created_at DESC`,
      params,
    );

    return res.json({ missions: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/missions ───────────────────────────────────────────────────────

export async function createMission(req, res, next) {
  try {
    const db = getDb();
    const { id: userId, role } = req.user;

    const {
      title,
      matricule,
      nom,
      prenom,
      department,
      purpose,
      departureLocation,
      departureDate,
      departureTime,
      returnLocation,
      returnDate,
      returnTime,
      extensions,
      transportation,
      mealBreakfast,
      mealLunch,
      mealDinner,
      comments,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Mission title is required." });
    }

    const [result] = await db.execute(
      `INSERT INTO missions
         (employee_id, title, matricule, department, purpose,
          departure_location, departure_date, departure_time,
          return_location, return_date, return_time,
          extensions, transportation,
          meal_breakfast, meal_lunch, meal_dinner,
          comments, form_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURDATE())`,
      [
        userId,
        title.trim(),
        matricule || "",
        department || "",
        purpose || "",
        departureLocation || "",
        departureDate || null,
        departureTime || null,
        returnLocation || "",
        returnDate || null,
        returnTime || null,
        extensions || "",
        transportation || "public_transport",
        mealBreakfast ? 1 : 0,
        mealLunch ? 1 : 0,
        mealDinner ? 1 : 0,
        comments || "",
      ],
    );

    const missionId = result.insertId;
    await db.execute("UPDATE missions SET reference = ? WHERE id = ?", [
      pad(missionId),
      missionId,
    ]);

    const [[mission]] = await db.execute(
      `${JOIN} WHERE m.id = ?`,
      [missionId],
    );
    const serialized = serialize(mission);

    // Notify admins and the employee's own manager
    const payload = {
      mission: serialized,
      createdBy: {
        id: userId,
        name: nom ? `${nom} ${prenom ?? ""}`.trim() : req.user.first_name + " " + req.user.last_name,
        role,
      },
      message: `New mission submitted: "${title.trim()}"`,
      timestamp: new Date().toISOString(),
    };
    sseManager.sendToRole("admin", "mission:created", payload);
    if (req.user.manager_id) {
      sseManager.sendToUser(req.user.manager_id, "mission:created", payload);
    }

    return res.status(201).json({ message: "Mission created.", mission: serialized });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/missions/:id ────────────────────────────────────────────────────

export async function getMission(req, res, next) {
  try {
    const db = getDb();
    const { id: userId, role } = req.user;
    const { id } = req.params;

    const [[mission]] = await db.execute(`${JOIN} WHERE m.id = ?`, [id]);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found." });
    }

    if (role === "employee" && mission.employee_id !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }
    if (role === "manager" && Number(mission.manager_id) !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    return res.json({ mission: serialize(mission) });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/missions/:id/status ──────────────────────────────────────────

export async function updateStatus(req, res, next) {
  try {
    const db = getDb();
    const { id: actorId, role: actorRole } = req.user;
    const { id } = req.params;
    const { status, managerComment } = req.body;

    const valid = ["pending", "approved", "rejected", "in-progress"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const [[mission]] = await db.execute(
      "SELECT * FROM missions WHERE id = ? LIMIT 1",
      [id],
    );
    if (!mission) {
      return res.status(404).json({ message: "Mission not found." });
    }

    await db.execute(
      "UPDATE missions SET status = ?, manager_comment = COALESCE(?, manager_comment), updated_at = NOW() WHERE id = ?",
      [status, managerComment ?? null, id],
    );

    const [[updated]] = await db.execute(`${JOIN} WHERE m.id = ?`, [id]);
    const serialized = serialize(updated);

    // Notify the employee who submitted
    sseManager.sendToUser(mission.employee_id, "mission:status_changed", {
      mission: serialized,
      status,
      managerComment: managerComment || "",
      message: `Your mission "${mission.title}" has been ${status}.`,
      timestamp: new Date().toISOString(),
    });

    // If admin acted, also notify all managers
    if (actorRole === "admin") {
      sseManager.sendToRole("manager", "mission:status_changed", {
        mission: serialized,
        status,
        message: `Mission "${mission.title}" was ${status} by admin.`,
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      message: `Mission ${status}.`,
      mission: serialized,
    });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/missions/:id ────────────────────────────────────────────────────

export async function updateMission(req, res, next) {
  try {
    const db = getDb();
    const { id: userId, role } = req.user;
    const { id } = req.params;

    const [[mission]] = await db.execute(
      "SELECT * FROM missions WHERE id = ? LIMIT 1",
      [id],
    );
    if (!mission) return res.status(404).json({ message: "Mission not found." });

    if (role === "employee" && mission.employee_id !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    const fields = [
      "title", "matricule", "department", "purpose",
      "departure_location", "departure_date", "departure_time",
      "return_location", "return_date", "return_time",
      "extensions", "transportation",
      "meal_breakfast", "meal_lunch", "meal_dinner",
      "comments", "hierarchical_manager", "department_director", "hr_approval", "form_date",
    ];

    const map = {
      title: req.body.title,
      matricule: req.body.matricule,
      department: req.body.department,
      purpose: req.body.purpose,
      departure_location: req.body.departureLocation,
      departure_date: req.body.departureDate || null,
      departure_time: req.body.departureTime || null,
      return_location: req.body.returnLocation,
      return_date: req.body.returnDate || null,
      return_time: req.body.returnTime || null,
      extensions: req.body.extensions,
      transportation: req.body.transportation,
      meal_breakfast: req.body.mealBreakfast !== undefined ? (req.body.mealBreakfast ? 1 : 0) : undefined,
      meal_lunch:    req.body.mealLunch    !== undefined ? (req.body.mealLunch    ? 1 : 0) : undefined,
      meal_dinner:   req.body.mealDinner   !== undefined ? (req.body.mealDinner   ? 1 : 0) : undefined,
      comments: req.body.comments,
      hierarchical_manager: req.body.hierarchicalManager,
      department_director:  req.body.departmentDirector,
      hr_approval: req.body.hrApproval,
      form_date: req.body.formDate || null,
    };

    const setClauses = [];
    const params = [];
    for (const field of fields) {
      if (map[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(map[field]);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    params.push(id);
    await db.execute(
      `UPDATE missions SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = ?`,
      params,
    );

    const [[updated]] = await db.execute(`${JOIN} WHERE m.id = ?`, [id]);
    return res.json({ message: "Mission updated.", mission: serialize(updated) });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/missions/:id (admin only) ────────────────────────────────────

export async function deleteMission(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const [[mission]] = await db.execute(
      "SELECT id FROM missions WHERE id = ? LIMIT 1",
      [id],
    );
    if (!mission) return res.status(404).json({ message: "Mission not found." });

    await db.execute("DELETE FROM missions WHERE id = ?", [id]);
    return res.json({ message: "Mission deleted." });
  } catch (err) {
    next(err);
  }
}
