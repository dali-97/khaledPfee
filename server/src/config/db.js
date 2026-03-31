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
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('employee', 'manager', 'admin') NOT NULL DEFAULT 'employee',
      company VARCHAR(190) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `);

  console.log(`MySQL connected: ${getBaseConfig().host}:${getBaseConfig().port}/${dbName}`);
}

export function getDb() {
  if (!pool) {
    throw new Error("Database pool has not been initialized yet.");
  }

  return pool;
}
