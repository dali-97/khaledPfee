import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../config/db.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "change-me", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function serializeUser(user) {
  return {
    id: String(user.id),
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
  };
}

export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, role, company } = req.body;
    const db = getDb();

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const [existingUsers] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [
      normalizedEmail,
    ]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = ["employee", "manager", "admin"].includes(role) ? role : "employee";
    const [result] = await db.execute(
      `
        INSERT INTO users (first_name, last_name, email, password, role, company)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [firstName, lastName, normalizedEmail, hashedPassword, safeRole, company || ""],
    );
    const [users] = await db.execute("SELECT id, first_name, last_name, email, role FROM users WHERE id = ?", [
      result.insertId,
    ]);
    const user = users[0];

    return res.status(201).json({
      message: "User registered successfully.",
      token: signToken(user.id),
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const db = getDb();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const [users] = await db.execute(
      "SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      token: signToken(user.id),
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res) {
  res.status(200).json({ user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName, email } = req.body;
    const db = getDb();
    const userId = req.user.id;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1",
      [normalizedEmail, userId],
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use by another account." });
    }

    await db.execute(
      "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
      [firstName, lastName, normalizedEmail, userId],
    );
    const [users] = await db.execute(
      "SELECT id, first_name, last_name, email, role FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    return res.status(200).json({ user: serializeUser(users[0]) });
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDb();
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required." });
    }

    const [rows] = await db.execute(
      "SELECT password FROM users WHERE id = ? LIMIT 1",
      [userId],
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return next(error);
  }
}
