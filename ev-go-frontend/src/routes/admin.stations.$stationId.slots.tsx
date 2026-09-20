import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAdmin } from "../components/RequireAuth";

interface GenerateSlotsResponse {
  stationId: number;
  slotsCreated: number;
  slotsSkipped: number;
  message: string;
}

export const Route = createFileRoute("/admin/stations/$stationId/slots")({
  component: () => <RequireAdmin><GenerateSlotsPage /></RequireAdmin>,
  head: () => ({ meta: [{ title: "Manage Slots \u2014 EV GO Admin" }] }),
});

function GenerateSlotsPage() {
  const { stationId } = Route.useParams();
  const [result, setResult] = useState<GenerateSlotsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysOut = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const generateMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post<GenerateSlotsResponse>("/slots/generate", body);
      return data;
    },
    onSuccess: (data) => { setResult(data); setError(null); },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to generate slots.");
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (name: string) => (f.elements.namedItem(name) as HTMLInputElement).value;
    generateMutation.mutate({
      stationId: parseInt(stationId, 10),
      startDate: val("startDate"),
      endDate: val("endDate"),
      slotDurationMinutes: parseInt(val("slotDurationMinutes"), 10),
      operatingHoursStart: parseInt(val("operatingHoursStart"), 10),
      operatingHoursEnd: parseInt(val("operatingHoursEnd"), 10),
    });
  }

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
        <div className="max-w-xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/admin/stations" className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h1 className="font-headline-xl text-primary tracking-tight">Generate Slots — Station #{stationId}</h1>
          </div>

          {error && <p className="mb-4 text-sm text-error bg-error-container/30 p-3 rounded">{error}</p>}

          {result && (
            <div className="mb-6 p-4 rounded-lg bg-primary-container/30 border border-primary/20">
              <p className="font-label-md text-on-primary font-semibold">✅ {result.message}</p>
              <p className="font-body-sm text-on-surface-variant mt-1">{result.slotsCreated} created, {result.slotsSkipped} skipped</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-lg shadow-sm p-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface" htmlFor="startDate">Start Date</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id="startDate" name="startDate" type="date" defaultValue={today} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface" htmlFor="endDate">End Date</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id="endDate" name="endDate" type="date" defaultValue={thirtyDaysOut} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface" htmlFor="slotDurationMinutes">Slot Duration (min)</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id="slotDurationMinutes" name="slotDurationMinutes" type="number" defaultValue={60} min={30} max={240} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface" htmlFor="operatingHoursStart">Opening Hour</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id="operatingHoursStart" name="operatingHoursStart" type="number" defaultValue={8} min={0} max={23} required />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="font-label-md text-on-surface" htmlFor="operatingHoursEnd">Closing Hour</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id="operatingHoursEnd" name="operatingHoursEnd" type="number" defaultValue={22} min={1} max={24} required />
              </div>
            </div>
            <p className="font-body-sm text-on-surface-variant">Generation is idempotent — existing slots are skipped.</p>
            <button className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-md shadow-sm hover:opacity-90 disabled:opacity-60" type="submit" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? "Generating…" : "Generate Slots"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
