import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAuth } from "../components/RequireAuth";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface BookingDetailDto {
  id: number;
  slotId: number;
  stationId: number;
  stationName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  bookedAt: string;
}

interface UserBookingsResponse {
  upcoming: BookingDetailDto[];
  pending: BookingDetailDto[];
  past: BookingDetailDto[];
  cancelled: BookingDetailDto[];
}

export const Route = createFileRoute("/bookings/")({
  component: () => <RequireAuth><BookingsPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "My Bookings \u2014 EV GO" },
      { name: "description", content: "View and manage your EV charging reservations." },
      { property: "og:title", content: "My Bookings \u2014 EV GO" },
      { property: "og:type", content: "website" },
    ],
  }),
});

type Tab = "upcoming" | "pending" | "past" | "cancelled";

function formatDate(date: string, start: string, end: string) {
  const d = new Date(date + "T00:00:00");
  const label = d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  const fmt = (t: string) => {
    const parts = t.split(":");
    const hour = parseInt(parts[0] ?? "0", 10);
    const min = parts[1] ?? "00";
    return `${hour % 12 || 12}:${min} ${hour >= 12 ? "PM" : "AM"}`;
  };
  return `${label} • ${fmt(start)} – ${fmt(end)}`;
}

function BookingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("Change of plans");

  const { data, isLoading } = useQuery<UserBookingsResponse>({
    queryKey: ["bookings/my"],
    queryFn: async () => {
      const { data } = await api.get<UserBookingsResponse>("/bookings/my");
      return data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      await api.post(`/bookings/${id}/cancel`, { reason });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings/my"] });
      setCancelTarget(null);
    },
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "pending", label: "Pending Payment" },
    { key: "past", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const currentList = data?.[activeTab] ?? [];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">ev_station</span>
              <span className="font-headline-md tracking-tight text-primary font-bold">EV GO</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/stations" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors">Find Stations</Link>
              <Link to="/bookings" className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-semibold">My Bookings</Link>
              <Link to="/assistant" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors">AI Assistant</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 flex-1">
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
          <h1 className="font-headline-xl text-primary tracking-tight mb-6">My Bookings</h1>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {tabs.map((t) => {
              const count = data?.[t.key]?.length ?? 0;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-md transition-colors shrink-0 ${activeTab === t.key ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
                  type="button"
                >
                  <span>{t.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-code-sm text-xs ${activeTab === t.key ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-highest text-on-surface-variant"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <span className="material-symbols-outlined text-primary text-[40px] animate-spin">refresh</span>
            </div>
          )}

          {!isLoading && currentList.length === 0 && (
            <div className="bg-surface-container-lowest rounded-lg p-10 text-center shadow-sm">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">event_busy</span>
              <h2 className="font-headline-md text-on-surface font-semibold mt-3">No bookings here</h2>
              <p className="font-body-sm text-on-surface-variant max-w-sm mt-1 mb-6">Nothing in this category yet.</p>
              <Link to="/stations" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md transition-colors shadow-sm">
                Find Charging Stations
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {currentList.map((booking) => (
              <div key={booking.id} className="bg-surface-container-lowest rounded-lg p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[28px]">ev_station</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-headline-md text-on-surface font-semibold">{booking.stationName}</span>
                      <span className="font-code-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">#{booking.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs ${booking.status === "CONFIRMED" ? "bg-primary-fixed/50 text-primary" : booking.status === "PENDING" ? "bg-tertiary-fixed/50 text-tertiary" : booking.status === "COMPLETED" ? "bg-surface-container-high text-on-surface-variant" : "bg-error-container/50 text-error"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {booking.status}
                      </span>
                    </div>
                    <span className="font-body-sm text-on-surface-variant">
                      {formatDate(booking.slotDate, booking.startTime, booking.endTime)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-4 lg:pt-0">
                  <span className="font-metric-display text-primary font-bold text-xl">₹{booking.totalAmount.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                      <button
                        onClick={() => setCancelTarget(booking.id)}
                        className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-error-container text-error hover:text-on-error-container font-label-md transition-colors"
                        type="button"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => void navigate({ to: "/bookings/$bookingId", params: { bookingId: String(booking.id) } })}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md transition-colors shadow-sm"
                      type="button"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-lg shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[24px]">warning</span>
              <h2 className="font-headline-md text-on-surface">Cancel Booking #{cancelTarget}</h2>
            </div>
            <p className="font-body-md text-on-surface-variant">Are you sure you want to cancel this booking?</p>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface uppercase" htmlFor="cancelReason">Reason</label>
              <select
                className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none"
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option>Change of plans</option>
                <option>Found another station</option>
                <option>Vehicle unavailable</option>
                <option>Other</option>
              </select>
            </div>

            {cancelMutation.isError && (
              <p className="text-sm text-error">Failed to cancel. Please try again.</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setCancelTarget(null)} className="px-5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors" type="button">Keep Booking</button>
              <button
                onClick={() => cancelMutation.mutate({ id: cancelTarget, reason: cancelReason })}
                disabled={cancelMutation.isPending}
                className="px-5 py-2 rounded-lg bg-error hover:opacity-90 text-on-error font-label-md transition-colors disabled:opacity-60"
                type="button"
              >
                {cancelMutation.isPending ? "Cancelling…" : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
