import bcrypt from "bcryptjs";
import { getDb } from "../config/db.js";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || "User";

  if (!email || !password) {
    console.warn(
      "[seed] Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set in .env"
    );
    return;
  }

  const db = getDb();
  const [[existing]] = await db.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase()]
  );

  if (existing) {
    console.log(`[seed] Admin account already exists (${email}). Skipping.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.execute(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, 'admin')",
    [firstName, lastName, email.toLowerCase(), hashedPassword]
  );

  console.log(`[seed] Admin account created: ${email}`);
}
