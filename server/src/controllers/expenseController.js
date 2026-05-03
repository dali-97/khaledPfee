import { getDb } from "../config/db.js";
import { sseManager } from "../services/sseService.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function serializeRow(r) {
  return {
    id: String(r.id),
    rowOrder: r.row_order,
    ref: r.ref_number || "",
    date: r.mission_date
      ? new Date(r.mission_date).toISOString().split("T")[0]
      : "",
    description: r.description || "",
    departureTime: r.departure_time || "",
    returnTime: r.return_time || "",
    timeRange: r.time_range || "",
    costCenter: r.cost_center || "",
    cost: Number(r.cost),
  };
}

function serializeReport(report, rows = []) {
  return {
    id: String(report.id),
    missionId: report.mission_id ? String(report.mission_id) : null,
    createdBy: String(report.created_by),
    employeeName: report.employee_name || "",
    department: report.department || "",
    matricule: report.matricule || "",
    periode: report.periode || "",
    periodFrom: report.period_from
      ? new Date(report.period_from).toISOString().split("T")[0]
      : "",
    periodTo: report.period_to
      ? new Date(report.period_to).toISOString().split("T")[0]
      : "",
    hrComments: report.hr_comments || "",
    totalCost: Number(report.total_cost),
    preparedBy: report.prepared_by || "",
    initials: report.initials || "",
    phrManager: report.phr_manager || "",
    phrInitials: report.phr_initials || "",
    phrSignature: report.phr_signature || "Pending",
    status: report.status,
    rows: rows.map(serializeRow),
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  };
}

// ─── GET /api/expense-reports ─────────────────────────────────────────────────

export async function listReports(req, res, next) {
  try {
    const db = getDb();
    const { role, id: userId } = req.user;

    let rows;
    if (role === "admin") {
      [rows] = await db.execute(
        "SELECT * FROM expense_reports ORDER BY created_at DESC",
      );
    } else if (role === "manager") {
      [rows] = await db.execute(
        "SELECT * FROM expense_reports WHERE created_by = ? ORDER BY created_at DESC",
        [userId],
      );
    } else {
      [rows] = await db.execute(
        `SELECT er.* FROM expense_reports er
         JOIN missions m ON er.mission_id = m.id
         WHERE m.employee_id = ?
         ORDER BY er.created_at DESC`,
        [userId],
      );
    }

    const reports = await Promise.all(
      rows.map(async (r) => {
        const [expRows] = await db.execute(
          "SELECT * FROM expense_rows WHERE report_id = ? ORDER BY row_order",
          [r.id],
        );
        return serializeReport(r, expRows);
      }),
    );

    return res.json({ reports });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/expense-reports ────────────────────────────────────────────────

export async function createReport(req, res, next) {
  try {
    const db = getDb();
    const { id: userId } = req.user;

    const {
      missionRef,
      employeeName,
      department,
      matricule,
      periode,
      dateFrom,
      dateTo,
      hrComments,
      totalCost,
      preparedBy,
      initials,
      phrManager,
      phrInitials,
      phrSignature,
      rows = [],
    } = req.body;

    // Resolve optional mission reference
    let missionId = null;
    if (missionRef?.trim()) {
      const [[m]] = await db.execute(
        "SELECT id FROM missions WHERE reference = ? OR id = ? LIMIT 1",
        [missionRef.trim(), parseInt(missionRef, 10) || 0],
      );
      if (!m) {
        return res
          .status(404)
          .json({ message: `Mission "${missionRef}" not found.` });
      }
      missionId = m.id;
    }

    const [result] = await db.execute(
      `INSERT INTO expense_reports
         (mission_id, created_by, employee_name, department, matricule, periode,
          period_from, period_to, hr_comments, total_cost,
          prepared_by, initials, phr_manager, phr_initials, phr_signature)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        missionId,
        userId,
        employeeName || "",
        department || "",
        matricule || "",
        periode || "",
        dateFrom || null,
        dateTo || null,
        hrComments || "",
        totalCost || 0,
        preparedBy || "",
        initials || "",
        phrManager || "",
        phrInitials || "",
        phrSignature || "Pending",
      ],
    );

    const reportId = result.insertId;

    // Insert expense rows
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      await db.execute(
        `INSERT INTO expense_rows
           (report_id, row_order, ref_number, mission_date, description,
            departure_time, return_time, time_range, cost_center, cost)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          reportId,
          i + 1,
          r.ref || "",
          r.date || null,
          r.description || "",
          r.departureTime || null,
          r.returnTime || null,
          r.timeRange || "",
          r.costCenter || "",
          r.cost || 0,
        ],
      );
    }

    const [[report]] = await db.execute(
      "SELECT * FROM expense_reports WHERE id = ?",
      [reportId],
    );
    const [expRows] = await db.execute(
      "SELECT * FROM expense_rows WHERE report_id = ? ORDER BY row_order",
      [reportId],
    );
    const serialized = serializeReport(report, expRows);

    // SSE: notify all admins
    sseManager.sendToRole("admin", "expense_report:created", {
      report: serialized,
      message: `New expense report submitted${missionId ? ` for mission ${missionRef}` : ""}.`,
      timestamp: new Date().toISOString(),
    });

    return res
      .status(201)
      .json({ message: "Expense report created.", report: serialized });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/expense-reports/:id ────────────────────────────────────────────

export async function getReport(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    const [[report]] = await db.execute(
      "SELECT * FROM expense_reports WHERE id = ? LIMIT 1",
      [id],
    );
    if (!report) return res.status(404).json({ message: "Report not found." });

    const [rows] = await db.execute(
      "SELECT * FROM expense_rows WHERE report_id = ? ORDER BY row_order",
      [id],
    );

    return res.json({ report: serializeReport(report, rows) });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/expense-reports/:id ────────────────────────────────────────────

export async function updateReport(req, res, next) {
  try {
    const db = getDb();
    const { id: userId, role } = req.user;
    const { id } = req.params;

    const [[report]] = await db.execute(
      "SELECT * FROM expense_reports WHERE id = ? LIMIT 1",
      [id],
    );
    if (!report) return res.status(404).json({ message: "Report not found." });

    if (role !== "admin" && report.created_by !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    const {
      employeeName, department, matricule, periode,
      dateFrom, dateTo, hrComments, totalCost,
      preparedBy, initials, phrManager, phrInitials, phrSignature,
      rows,
    } = req.body;

    await db.execute(
      `UPDATE expense_reports SET
         employee_name  = COALESCE(?, employee_name),
         department     = COALESCE(?, department),
         matricule      = COALESCE(?, matricule),
         periode        = COALESCE(?, periode),
         period_from    = COALESCE(?, period_from),
         period_to      = COALESCE(?, period_to),
         hr_comments    = COALESCE(?, hr_comments),
         total_cost     = COALESCE(?, total_cost),
         prepared_by    = COALESCE(?, prepared_by),
         initials       = COALESCE(?, initials),
         phr_manager    = COALESCE(?, phr_manager),
         phr_initials   = COALESCE(?, phr_initials),
         phr_signature  = COALESCE(?, phr_signature),
         updated_at     = NOW()
       WHERE id = ?`,
      [
        employeeName, department, matricule, periode,
        dateFrom || null, dateTo || null, hrComments, totalCost,
        preparedBy, initials, phrManager, phrInitials, phrSignature,
        id,
      ],
    );

    // Replace rows if supplied
    if (Array.isArray(rows)) {
      await db.execute("DELETE FROM expense_rows WHERE report_id = ?", [id]);
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        await db.execute(
          `INSERT INTO expense_rows
             (report_id, row_order, ref_number, mission_date, description,
              departure_time, return_time, time_range, cost_center, cost)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [id, i + 1, r.ref || "", r.date || null, r.description || "",
           r.departureTime || null, r.returnTime || null, r.timeRange || "",
           r.costCenter || "", r.cost || 0],
        );
      }
    }

    const [[updated]] = await db.execute(
      "SELECT * FROM expense_reports WHERE id = ?",
      [id],
    );
    const [expRows] = await db.execute(
      "SELECT * FROM expense_rows WHERE report_id = ? ORDER BY row_order",
      [id],
    );

    return res.json({ message: "Report updated.", report: serializeReport(updated, expRows) });
  } catch (err) {
    next(err);
  }
}
