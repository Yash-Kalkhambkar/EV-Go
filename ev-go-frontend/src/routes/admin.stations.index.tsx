import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAdmin } from "../components/RequireAuth";

interface StationDto {
  id: number;
  name: string;
  address: string;
  pricePerHour: number;
  totalSlots: number;
  connectorTypes: string[];
  isActive: boolean;
}

interface PageResult<T> {
  content: T[];
  totalElements: number;
}

export const Route = createFileRoute("/admin/stations/")({
  component: () => <RequireAdmin><AdminStationsPage /></RequireAdmin>,
  head: () => ({ meta: [{ title: "Manage Stations \u2014 EV GO Admin" }] }),
});

function AdminStationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data, isLoading } = useQuery<PageResult<StationDto>>({
    queryKey: ["admin/stations"],
    queryFn: async () => {
      const { data } = await api.get<PageResult<StationDto>>("/admin/stations", {
        params: { page: 0, size: 50, sort: "createdAt,desc" },
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { await api.delete(`/stations/${id}`); },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin/stations"] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <span className="font-headline-md tracking-tight text-primary font-bold">EV GO Admin</span>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/admin/stations" className="px-3 py-1.5 bg-primary-container text-on-primary font-semibold rounded-lg">Stations</Link>
            <Link to="/admin/bookings" className="px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors">Bookings</Link>
          </nav>
        </div>
      </header>

      <main className="w-full pt-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-headline-xl text-primary tracking-tight">Manage Stations</h1>
            <Link to="/admin/stations/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md shadow-sm hover:opacity-90">
              <span className="material-symbols-outlined text-[18px]">add</span>Add Station
            </Link>
          </div>

          {isLoading && <div className="flex justify-center py-16"><span className="material-symbols-outlined text-primary text-[40px] animate-spin">refresh</span></div>}

          <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {["Station", "Address", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-ui">
                {(data?.content ?? []).map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface">{s.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{s.address}</td>
                    <td className="px-4 py-3">₹{s.pricePerHour}/hr</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? "bg-primary-fixed/50 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => void navigate({ to: "/admin/stations/$stationId/slots", params: { stationId: String(s.id) } })} className="text-xs px-2 py-1 rounded border border-border-ui hover:bg-surface-container transition-colors" type="button">Slots</button>
                        <button onClick={() => setDeleteTarget(s.id)} className="text-xs px-2 py-1 rounded border border-error/30 text-error hover:bg-error-container/30 transition-colors" type="button">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(data?.content ?? []).length === 0 && !isLoading && (
              <p className="text-center text-on-surface-variant py-10">No stations yet. <Link to="/admin/stations/new" className="text-primary hover:underline">Add one.</Link></p>
            )}
          </div>
        </div>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-lg shadow-xl p-6 flex flex-col gap-4">
            <h2 className="font-headline-md text-on-surface">Delete Station #{deleteTarget}?</h2>
            <p className="font-body-sm text-on-surface-variant">Sets the station inactive. Can be reactivated later.</p>
            {deleteMutation.isError && <p className="text-sm text-error">Failed to delete.</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md" type="button">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteTarget)} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md disabled:opacity-60" type="button">
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
