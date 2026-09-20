/**
 * Auth store — pure in-memory, no localStorage.
 *
 * Access token lives only in this module's closure.
 * Refresh token is handled entirely by the browser via the HttpOnly cookie
 * the backend sets at /api/auth/login and /api/auth/register.
 *
 * JWT claims (from backend JwtTokenService):
 *   sub  → userId (string)
 *   role → "USER" | "ADMIN"
 *   type → "access"
 *   exp  → expiry epoch seconds
 */
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  sub: string;   // user ID
  role: string;  // "USER" | "ADMIN"
  type: string;
  iat: number;
  exp: number;
}

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  role: "USER" | "ADMIN" | null;
  expiresAt: string | null; // ISO string from server
}

const state: AuthState = {
  accessToken: null,
  userId: null,
  role: null,
  expiresAt: null,
};

// Listeners for auth state changes (used by route guards / components)
const listeners = new Set<() => void>();

export function subscribeAuth(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function setTokens(accessToken: string, expiresAt: string) {
  const decoded = jwtDecode<JWTPayload>(accessToken);
  state.accessToken = accessToken;
  state.userId = decoded.sub;
  state.role = decoded.role as "USER" | "ADMIN";
  state.expiresAt = expiresAt;
  notify();
}

export function clearAuth() {
  state.accessToken = null;
  state.userId = null;
  state.role = null;
  state.expiresAt = null;
  notify();
}

export function getAccessToken() {
  return state.accessToken;
}

export function getAuthState(): Readonly<AuthState> {
  return state;
}

export function isAuthenticated() {
  return state.accessToken !== null;
}

export function isAdmin() {
  return state.role === "ADMIN";
}

export function getUserId() {
  return state.userId;
}
