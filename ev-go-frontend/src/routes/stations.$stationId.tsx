/**
 * Station Details Page
 *
 * Wired to:
 *   GET /api/stations/:id          → station info
 *   GET /api/slots?stationId=&date= → slot grid (public endpoint returns AVAILABLE slots only)
 *   POST /api/bookings              → create booking (returns bookingId + razorpayOrderId)
 *   POST /api/payments/orders       → create Razorpay order (returns orderId + amount in paise)
 *   POST /api/payments/verify?bookingId= → verify after Razorpay modal closes
 *
 * Slot status enum (SlotStatus.java): AVAILABLE | RESERVED | BOOKED | UNAVAILABLE
 */
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAuth } from "../components/RequireAuth";
import { useWebSocket, type WSMessage } from "../hooks/useWebSocket";
import { isAuthenticated } from "../lib/auth";

interface StationDto {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  pricePerHour: number;
  totalSlots: number;
  connectorTypes: string[];
}

interface SlotDto {
  id: number;
  stationId: number;
  stationName: string;
  slotDate: string;       // "yyyy-MM-dd"
  startTime: string;      // "HH:mm:ss"
  endTime: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED" | "UNAVAILABLE";
}

interface BookingDto {
  id: number;
  slotId: number;
  stationId: number;
  status: string;
  totalAmount: number;
  razorpayOrderId: string;
}

interface CreateOrderResponse {
  orderId: string;
  amount: number;   // paise — use directly
  currency: string;
  keyId: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export const Route = createFileRoute("/stations/$stationId")({
  component: () => <RequireAuth><StationDetailsPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "Station Details \u2014 EV GO" },
      { name: "description", content: "Station details, connector types and hourly slot availability for booking." },
      { property: "og:title", content: "Station Details \u2014 EV GO" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function formatTime(t: string) {
  const parts = t.split(":");
  const hour = parseInt(parts[0] ?? "0", 10);
  const min = parts[1] ?? "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${min} ${ampm}`;
}

function getNextSevenDays(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function StationDetailsPage() {
  const { stationId } = Route.useParams();
  const navigate = useNavigate();
  const days = getNextSevenDays();
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: station } = useQuery<StationDto>({
    queryKey: ["station", stationId],
    queryFn: async () => {
      const { data } = await api.get<StationDto>(`/stations/${stationId}`);
      return data;
    },
  });

  const { data: slots = [], refetch: refetchSlots } = useQuery<SlotDto[]>({
    queryKey: ["slots", stationId, selectedDate],
    queryFn: async () => {
      const { data } = await api.get<SlotDto[]>("/slots", {
        params: { stationId: Number(stationId), date: selectedDate },
      });
      return data;
    },
  });

  // Refetch slots when WebSocket fires a slot update
  const handleWsMessage = useCallback((msg: WSMessage) => {
    if (["BOOKING_CONFIRMED", "BOOKING_CANCELLED", "SLOT_RELEASED"].includes(msg.type)) {
      void refetchSlots();
    }
  }, [refetchSlots]);

  useWebSocket(handleWsMessage, isAuthenticated());

  async function handleBook() {
    if (!selectedSlot) return;
    setBookingError(null);
    setBookingLoading(true);

    try {
      // 1. Create booking
      const { data: booking } = await api.post<BookingDto>("/bookings", {
        slotId: selectedSlot.id,
      });

      // 2. Create Razorpay order
      const { data: order } = await api.post<CreateOrderResponse>("/payments/orders", {
        bookingId: booking.id,
        amount: station?.pricePerHour ?? 0,
        currency: "INR",
      });

      // 3. Load Razorpay checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed to load");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,      // paise — from server, don't multiply
        currency: order.currency,
        order_id: order.orderId,
        name: "EV GO",
        description: `${station?.name ?? ""} — ${formatTime(selectedSlot.startTime)} to ${formatTime(selectedSlot.endTime)}`,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment
          await api.post(
            `/payments/verify?bookingId=${booking.id}`,
            {
              bookingId: booking.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }
          );
          await navigate({ to: "/bookings/$bookingId", params: { bookingId: String(booking.id) } });
        },
        modal: {
          ondismiss: () => {
            setBookingLoading(false);
            setBookingError("Payment cancelled. Your slot is reserved for a few minutes.");
          },
        },
        prefill: {},
        theme: { color: "#1B4D3E" },
      });

      rzp.open();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Booking failed. The slot may have just been taken.";
      setBookingError(msg);
      setBookingLoading(false);
    }
  }

  const slotStatusStyle = (status: SlotDto["status"], selected: boolean) => {
    if (selected) return "border-2 border-primary bg-primary text-white cursor-pointer";
    switch (status) {
      case "AVAILABLE":
        return "border border-border-ui bg-surface-card hover:border-primary cursor-pointer text-text-main";
      case "RESERVED":
        return "border border-[#C4A747]/40 bg-[#FFFDF5] text-text-main cursor-not-allowed opacity-80";
      case "BOOKED":
        return "border border-border-ui bg-surface-ground text-text-muted cursor-not-allowed opacity-80";
      case "UNAVAILABLE":
        return "border border-border-ui bg-surface-ground text-text-muted cursor-not-allowed opacity-70";
    }
  };

  const slotStatusLabel = (status: SlotDto["status"]) => {
    switch (status) {
      case "AVAILABLE": return <span className="font-semibold text-[#1B4D3E]">Available</span>;
      case "RESERVED": return <span className="font-semibold text-[#C4A747]">Reserved</span>;
      case "BOOKED": return <span className="font-semibold text-text-muted">Booked</span>;
      case "UNAVAILABLE": return <span className="font-semibold">Unavailable</span>;
    }
  };

  const dotColor = (status: SlotDto["status"]) => {
    switch (status) {
      case "AVAILABLE": return "bg-[#1B4D3E]";
      case "RESERVED": return "bg-[#C4A747]";
      case "BOOKED": return "bg-[#9CA3AF]";
      case "UNAVAILABLE": return "bg-[#6B7280]";
    }
  };

  return (
    <div className="bg-surface-ground font-sans text-text-main antialiased min-h-screen flex flex-col">
      <header className="w-full bg-surface-card border-b border-border-ui sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary tracking-tight">
            <span className="material-symbols-outlined text-[26px]">ev_station</span>
            <span>EV GO</span>
          </Link>
          <Link to="/stations" className="text-sm font-medium text-text-muted hover:text-text-main px-3 py-2">
            ← Back to Search Results
          </Link>
        </div>
      </header>

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {/* Station header */}
        {station && (
          <section className="bg-surface-card border border-border-ui rounded p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-text-main tracking-tight">{station.name}</h1>
                <p className="text-sm text-text-muted mt-1">{station.address}</p>
                {station.description && (
                  <p className="text-sm text-text-muted mt-2">{station.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {station.connectorTypes.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 bg-surface-ground rounded border border-border-ui font-medium">{c}</span>
                  ))}
                </div>
              </div>
              <div className="bg-surface-muted px-4 py-3 rounded border border-border-ui text-left md:text-right shrink-0">
                <span className="block text-xs uppercase tracking-wider text-text-muted font-semibold">Price</span>
                <span className="font-heading text-2xl font-bold text-primary">
                  ₹{station.pricePerHour}<span className="text-sm font-normal text-text-muted">/hour</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Slot grid */}
        <section className="bg-surface-card border border-border-ui rounded p-5 shadow-sm mb-6">
          {/* Date picker */}
          <h2 className="font-heading text-base font-bold text-text-main mb-3">Select Date</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
            {days.map((day, i) => {
              const d = new Date(day + "T00:00:00");
              const dayName = i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" });
              const dayNum = d.getDate();
              const mon = d.toLocaleDateString("en", { month: "short" });
              const active = day === selectedDate;
              return (
                <button
                  key={day}
                  onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded border transition-all text-center ${active ? "border-primary bg-primary text-white" : "border-border-ui bg-surface-card hover:bg-surface-muted text-text-main"}`}
                  type="button"
                >
                  <span className="text-xs font-semibold uppercase opacity-90">{dayName}</span>
                  <span className="font-heading text-lg font-bold mt-0.5">{dayNum}</span>
                  <span className="text-xs">{mon}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-ui gap-2 flex-wrap">
            <h2 className="font-heading text-base font-bold text-text-main">Time Slots</h2>
            <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]"></span>Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C4A747]"></span>Reserved</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span>Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></span>Unavailable</span>
            </div>
          </div>

          {/* Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.length === 0 && (
              <p className="col-span-4 text-sm text-text-muted text-center py-8">No slots available for this date.</p>
            )}
            {slots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isClickable = slot.status === "AVAILABLE";
              return (
                <div
                  key={slot.id}
                  className={`p-3 rounded flex flex-col justify-between h-20 ${slotStatusStyle(slot.status, isSelected)}`}
                  onClick={() => isClickable && setSelectedSlot(isSelected ? null : slot)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => e.key === "Enter" && isClickable && setSelectedSlot(isSelected ? null : slot)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                    {isSelected
                      ? <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      : <span className={`w-2 h-2 rounded-full ${dotColor(slot.status)}`}></span>
                    }
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    {slotStatusLabel(slot.status)}
                    <span className={isSelected ? "text-white" : "font-medium text-text-main"}>
                      ₹{station?.pricePerHour ?? "–"}/hr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {bookingError && (
          <div className="mb-4 p-3 rounded bg-error-container/40 text-sm text-on-error-container">{bookingError}</div>
        )}
      </main>

      {/* Sticky booking bar */}
      {selectedSlot && (
        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-border-ui py-3 px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="material-symbols-outlined text-primary text-[28px]">schedule</span>
              <div>
                <div className="text-xs text-text-muted uppercase font-semibold">Selected Slot</div>
                <div className="text-sm font-semibold text-text-main">
                  {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)} • ₹{station?.pricePerHour}/hour
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted uppercase block font-medium">Price</span>
                <span className="font-heading text-xl font-bold text-text-main">₹{station?.pricePerHour ?? "–"}.00</span>
              </div>
              <button
                className="px-6 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow transition-colors flex items-center gap-2 disabled:opacity-60"
                onClick={handleBook}
                disabled={bookingLoading}
                type="button"
              >
                <span>{bookingLoading ? "Processing…" : "Book This Slot"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
