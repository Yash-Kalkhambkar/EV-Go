/**
 * React hook that returns the current auth state and re-renders on changes.
 * Components should use this hook instead of importing from auth.ts directly.
 */
import { useSyncExternalStore } from "react";
import { subscribeAuth, getAuthState, isAuthenticated, isAdmin } from "./auth";

export function useAuth() {
  const state = useSyncExternalStore(subscribeAuth, getAuthState);
  return {
    ...state,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  };
}
