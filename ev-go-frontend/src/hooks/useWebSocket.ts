/**
 * WebSocket hook for real-time booking updates.
 *
 * Protocol (per BookingWebSocketHandler.java):
 * - Connect: ws://<host>/ws/bookings?token=<jwt>
 * - Server sends JSON messages: { type, message, data }
 * - Client messages: NOT supported (server ignores them)
 * - Keep-alive: browser/TCP level only — no ping/pong
 * - Reconnect: exponential backoff, max 5 attempts
 */
import { useEffect, useRef, useCallback } from "react";
import { getAccessToken } from "../lib/auth";

export type WSMessageType =
  | "CONNECTED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_EXPIRED"
  | "SLOT_RELEASED";

export interface WSMessage {
  type: WSMessageType;
  message: string;
  data: unknown;
}

const WS_BASE = (import.meta.env["VITE_WS_BASE_URL"] as string | undefined) ?? "ws://localhost:8081";

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_DELAY_MS = 2000;

export function useWebSocket(
  onMessage: (msg: WSMessage) => void,
  enabled = true
) {
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token || !enabled) return;

    const url = `${WS_BASE}/ws/bookings?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      attemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data as string);
        onMessageRef.current(msg);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!enabled) return;
      if (attemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(
          BASE_DELAY_MS * Math.pow(2, attemptsRef.current),
          30000
        );
        attemptsRef.current++;
        timeoutRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled) connect();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect, enabled]);
}
