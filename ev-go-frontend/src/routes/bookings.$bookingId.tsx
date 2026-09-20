import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAuth } from "../components/RequireAuth";

interface BookingDto {
  id: number;
  userId: number;
  slotId: number;
  stationId: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  razorpayOrderId: string | null;
  bookedAt: string;
}

export const Route = createFileRoute("/bookings/$bookingId")({
  component: () => <RequireAuth><BookingDetailPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "Booking Details \u2014 EV GO" },
      { name: "description", content: "View your EV GO charging reservation details." },
      { property: "og:title", content: "Booking Details \u2014 EV GO" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function BookingDetailPage() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Change of plans");

  const { data: booking, isLoading, isError } = useQuery<BookingDto>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const { data } = await api.get<BookingDto>(`/bookings/${bookingId}`);
      return data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      await api.post(`/bookings/${bookingId}/cancel`, { reason });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      void queryClient.invalidateQueries({ queryKey: ["bookings/my"] });
      setShowCancelModal(false);
    },
  });

  const canCancel = booking?.status === "PENDING" || booking?.status === "CONFIRMED";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">refresh</span>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant">Booking not found or you don't have access.</p>
        <Link to="/bookings" className="text-primary hover:underline font-medium">← My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">ev_station</span>
            <span className="font-headline-md tracking-tight text-primary font-bold">EV GO</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/stations" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">Find Stations</Link>
            <Link to="/bookings" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">My Bookings</Link>
          </nav>
        </div>
      </header>

      <main className="w-full pt-16 flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link to="/bookings" className="inline-flex items-center gap-1 font-label-md text-on-surface hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to My Bookings
            </Link>
            <span className="font-code-sm text-on-surface-variant uppercase tracking-wider">Booking #{booking.id}</span>
          </div>

          {/* Status header */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-headline-xl text-on-surface">Booking Details</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm uppercase tracking-wide ${booking.status === "CONFIRMED" ? "bg-primary-container text-on-primary" : booking.status === "PENDING" ? "bg-tertiary-fixed/50 text-tertiary" : booking.status === "COMPLETED" ? "bg-surface-container-high text-on-surface-variant" : "bg-error-container text-error"}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {booking.status}
                </span>
              </div>
            </div>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-error-container text-error font-label-md transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Cancel Booking
              </button>
            )}
          </div>

          {/* Booking info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm">
              <span className="font-label-sm text-on-surface-variant uppercase">Booking ID</span>
              <p className="font-headline-md text-on-surface font-semibold mt-1">#{booking.id}</p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm">
              <span className="font-label-sm text-on-surface-variant uppercase">Amount</span>
              <p className="font-metric-display text-primary font-bold text-2xl mt-1">₹{booking.totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm">
              <span className="font-label-sm text-on-surface-variant uppercase">Status</span>
              <p className="font-body-lg font-semibold text-on-surface mt-1">{booking.status}</p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm">
              <span className="font-label-sm text-on-surface-variant uppercase">Booked At</span>
              <p className="font-body-md text-on-surface mt-1">{new Date(booking.bookedAt).toLocaleString()}</p>
            </div>
            {booking.razorpayOrderId && (
              <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm sm:col-span-2">
                <span className="font-label-sm text-on-surface-variant uppercase">Razorpay Order ID</span>
                <p className="font-code-sm text-on-surface mt-1">{booking.razorpayOrderId}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void navigate({ to: "/stations/$stationId", params: { stationId: String(booking.stationId) } })}
              className="px-4 py-2 rounded-lg border border-border-ui text-on-surface font-label-md hover:bg-surface-container transition-colors"
              type="button"
            >
              View Station
            </button>
          </div>
        </div>
      </main>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-lg shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[24px]">warning</span>
              <h2 className="font-headline-md text-on-surface">Cancel Booking #{booking.id}</h2>
            </div>
            <p className="font-body-md text-on-surface-variant">Are you sure you want to cancel?</p>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface uppercase" htmlFor="cancelReason">Reason</label>
              <select className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none" id="cancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}>
                <option>Change of plans</option>
                <option>Found another station</option>
                <option>Vehicle unavailable</option>
                <option>Other</option>
              </select>
            </div>
            {cancelMutation.isError && <p className="text-sm text-error">Failed to cancel. Please try again.</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCancelModal(false)} className="px-5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors" type="button">Keep Booking</button>
              <button
                onClick={() => cancelMutation.mutate(cancelReason)}
                disabled={cancelMutation.isPending}
                className="px-5 py-2 rounded-lg bg-error text-on-error font-label-md transition-colors disabled:opacity-60"
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
