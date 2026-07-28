import mysql from "mysql2/promise";

let pool;

function getBaseConfig() {
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

export async function connectDatabase() {
  const dbName = process.env.DB_NAME || "mission_flow";
  const bootstrap = await mysql.createConnection(getBaseConfig());

  await bootstrap.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await bootstrap.end();

  pool = mysql.createPool({
    ...getBaseConfig(),
    database: dbName,
    timezone: "+00:00",
  });

  // ── Users ────────────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
      first_name  VARCHAR(100)   NOT NULL,
      last_name   VARCHAR(100)   NOT NULL,
      email       VARCHAR(190)   NOT NULL UNIQUE,
      password    VARCHAR(255)   NOT NULL,
      role        ENUM('employee','manager','admin') NOT NULL DEFAULT 'employee',
      company     VARCHAR(190)   DEFAULT '',
      active      TINYINT(1)     NOT NULL DEFAULT 1,
      manager_id  INT UNSIGNED   NULL,
      created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Migration: add columns to existing installations that predate them
  try {
    await pool.query("ALTER TABLE users ADD COLUMN manager_id INT UNSIGNED NULL");
    await pool.query(
      "ALTER TABLE users ADD CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL"
    );
  } catch { /* column / constraint already exists */ }
  try {
    await pool.query("ALTER TABLE users ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1");
  } catch { /* column already exists */ }

  // ── Missions (Annexe 01) ─────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS missions (
      id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
      reference            VARCHAR(20)  DEFAULT NULL,
      title                VARCHAR(255) NOT NULL,
      employee_id          INT UNSIGNED NOT NULL,
      matricule            VARCHAR(100) DEFAULT '',
      department           VARCHAR(100) DEFAULT '',
      purpose              TEXT,
      departure_location   VARCHAR(255) DEFAULT '',
      departure_date       DATE         DEFAULT NULL,
      departure_time       TIME         DEFAULT NULL,
      return_location      VARCHAR(255) DEFAULT '',
      return_date          DATE         DEFAULT NULL,
      return_time          TIME         DEFAULT NULL,
      extensions           TEXT,
      transportation       ENUM('public_transport','personal_vehicle','service_vehicle')
                           NOT NULL DEFAULT 'public_transport',
      meal_breakfast       TINYINT(1)   NOT NULL DEFAULT 0,
      meal_lunch           TINYINT(1)   NOT NULL DEFAULT 0,
      meal_dinner          TINYINT(1)   NOT NULL DEFAULT 0,
      comments             TEXT,
      manager_comment      TEXT,
      hierarchical_manager VARCHAR(200) DEFAULT '',
      department_director  VARCHAR(200) DEFAULT '',
      hr_approval          VARCHAR(200) DEFAULT '',
      form_date            DATE         DEFAULT NULL,
      status               ENUM('pending','approved','rejected','in-progress')
                           NOT NULL DEFAULT 'pending',
      created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── Expense Reports (Annexe 03) ──────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expense_reports (
      id             INT UNSIGNED   NOT NULL AUTO_INCREMENT,
      mission_id     INT UNSIGNED   DEFAULT NULL,
      created_by     INT UNSIGNED   NOT NULL,
      employee_name  VARCHAR(200)   DEFAULT '',
      department     VARCHAR(100)   DEFAULT '',
      matricule      VARCHAR(100)   DEFAULT '',
      periode        VARCHAR(100)   DEFAULT '',
      period_from    DATE           DEFAULT NULL,
      period_to      DATE           DEFAULT NULL,
      hr_comments    TEXT,
      total_cost     DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
      prepared_by    VARCHAR(200)   DEFAULT '',
      initials       VARCHAR(20)    DEFAULT '',
      phr_manager    VARCHAR(200)   DEFAULT '',
      phr_initials   VARCHAR(20)    DEFAULT '',
      phr_signature  ENUM('Pending','Validated','Returned for update') DEFAULT 'Pending',
      manager_comment TEXT,
      status         ENUM('draft','submitted','approved','rejected') NOT NULL DEFAULT 'submitted',
      created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by)  REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Migration: review fields on installations that predate them
  try {
    await pool.query("ALTER TABLE expense_reports ADD COLUMN manager_comment TEXT");
  } catch { /* column already exists */ }
  try {
    await pool.query(
      "ALTER TABLE expense_reports MODIFY COLUMN status ENUM('draft','submitted','approved','rejected') NOT NULL DEFAULT 'submitted'",
    );
  } catch { /* enum already widened */ }

  // ── Refresh Tokens ───────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id     INT UNSIGNED NOT NULL,
      token_hash  VARCHAR(64)  NOT NULL,
      expires_at  TIMESTAMP    NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_token_hash (token_hash),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── Expense Rows ─────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expense_rows (
      id             INT UNSIGNED   NOT NULL AUTO_INCREMENT,
      report_id      INT UNSIGNED   NOT NULL,
      row_order      INT            NOT NULL DEFAULT 0,
      ref_number     VARCHAR(100)   DEFAULT '',
      mission_date   DATE           DEFAULT NULL,
      description    TEXT,
      departure_time TIME           DEFAULT NULL,
      return_time    TIME           DEFAULT NULL,
      time_range     VARCHAR(50)    DEFAULT '',
      cost_center    VARCHAR(100)   DEFAULT '',
      cost           DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
      PRIMARY KEY (id),
      FOREIGN KEY (report_id) REFERENCES expense_reports(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log(
    `MySQL connected: ${getBaseConfig().host}:${getBaseConfig().port}/${dbName}`,
  );
}

export function getDb() {
  if (!pool) throw new Error("Database pool has not been initialized yet.");
  return pool;
}
