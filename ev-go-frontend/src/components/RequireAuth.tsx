/**
 * Route guard components.
 *
 * RequireAuth: redirects to /login if not authenticated
 * RequireAdmin: redirects to /stations if authenticated but not ADMIN
 *
 * Usage in a route:
 *   component: () => <RequireAuth><MyPage /></RequireAuth>
 */
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { isAuthenticated, isAdmin } from "../lib/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      void navigate({ to: "/login" });
    }
  }, [navigate]);

  if (!isAuthenticated()) return null;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      void navigate({ to: "/login" });
    } else if (!isAdmin()) {
      void navigate({ to: "/stations" });
    }
  }, [navigate]);

  if (!isAuthenticated() || !isAdmin()) return null;
  return <>{children}</>;
}
