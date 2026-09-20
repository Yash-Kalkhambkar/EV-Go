import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAdmin } from "../components/RequireAuth";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface BookingDto {
  id: number;
  userId: number;
  slotId: number;
  stationId: number;
  status: BookingStatus;
  totalAmount: number;
  razorpayOrderId: string | null;
  bookedAt: string;
}

interface PageResult<T> {
  content: T[];
  totalElements: number;
}

export const Route = createFileRoute("/admin/bookings/")({
  component: () => <RequireAdmin><AdminBookingsPage /></RequireAdmin>,
  head: () => ({ meta: [{ title: "All Bookings \u2014 EV GO Admin" }] }),
});

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");

  const { data, isLoading } = useQuery<PageResult<BookingDto> | BookingDto[]>({
    queryKey: ["admin/bookings", statusFilter],
    queryFn: async () => {
      const params: Record<string, unknown> = { page: 0, size: 100, sort: "bookedAt,desc" };
      if (statusFilter !== "ALL") params["status"] = statusFilter;
      // Try admin endpoint; fall back to standard bookings list
      return api
        .get<PageResult<BookingDto> | BookingDto[]>("/admin/bookings", { params })
        .then((r) => r.data)
        .catch(() => api.get<BookingDto[]>("/bookings", { params }).then((r) => r.data));
    },
  });

  const bookings: BookingDto[] = Array.isArray(data) ? data : ((data as PageResult<BookingDto>)?.content ?? []);

  const statusStyle = (s: BookingStatus) => {
    if (s === "CONFIRMED") return "bg-primary-fixed/50 text-primary";
    if (s === "PENDING") return "bg-tertiary-fixed/50 text-tertiary";
    if (s === "COMPLETED") return "bg-surface-container-high text-on-surface-variant";
    return "bg-error-container/50 text-error";
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <span className="font-headline-md tracking-tight text-primary font-bold">EV GO Admin</span>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/admin/stations" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">Stations</Link>
            <Link to="/admin/bookings" className="px-3 py-1.5 bg-primary-container text-on-primary font-semibold rounded-lg">Bookings</Link>
          </nav>
        </div>
      </header>

      <main className="w-full pt-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h1 className="font-headline-xl text-primary tracking-tight">All Bookings</h1>
            <div className="flex items-center gap-2 overflow-x-auto">
              <button onClick={() => setStatusFilter("ALL")} className={`px-3 py-1.5 rounded-lg font-label-md text-sm transition-colors shrink-0 ${statusFilter === "ALL" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`} type="button">All</button>
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg font-label-md text-sm transition-colors shrink-0 ${statusFilter === s ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`} type="button">{s}</button>
              ))}
            </div>
          </div>

          {isLoading && <div className="flex justify-center py-16"><span className="material-symbols-outlined text-primary text-[40px] animate-spin">refresh</span></div>}

          <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-surface-container-low">
                <tr>
                  {["ID", "User ID", "Station ID", "Status", "Amount", "Booked At"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-ui">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium">#{b.id}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{b.userId}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{b.stationId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">₹{b.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">{new Date(b.bookedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && !isLoading && (
              <p className="text-center text-on-surface-variant py-10">No bookings found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
