import type { AuthUser } from "@/types/app";

const TOKEN_COOKIE = "mission_flow_token";
const USER_COOKIE = "mission_flow_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function saveSession(token: string, user: AuthUser) {
  setCookie(TOKEN_COOKIE, token);
  setCookie(USER_COOKIE, JSON.stringify(user));
}

export function getSessionToken() {
  return getCookie(TOKEN_COOKIE);
}

export function getSessionUser() {
  const rawUser = getCookie(USER_COOKIE);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  clearCookie(TOKEN_COOKIE);
  clearCookie(USER_COOKIE);
}
