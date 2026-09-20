/**
 * Axios API client.
 *
 * - Base URL: VITE_API_BASE_URL env var (default http://localhost:8081/api)
 * - Attaches JWT Authorization header from auth store on every request
 * - On 401: attempts one silent token refresh using the HttpOnly refresh cookie,
 *   then retries the original request once. If refresh also fails, clears auth
 *   and redirects to /login.
 */
import axios, { type AxiosRequestConfig } from "axios";
import { getAccessToken, clearAuth, setTokens } from "./auth";

export const BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:8081/api";

export const api = axios.create({
  baseURL: BASE_URL as string,
  withCredentials: true,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401, attempt refresh ────────────────────────
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Don't retry the refresh endpoint itself
    if (original.url?.includes("/auth/refresh")) {
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue other requests while refresh is in flight
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((token) => {
          original.headers = {
            ...original.headers,
            Authorization: `Bearer ${token}`,
          };
          return api(original);
        })
        .catch(Promise.reject);
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken: string = data.accessToken;
      setTokens(newToken, data.expiresAt);
      processQueue(null, newToken);
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuth();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
