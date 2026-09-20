import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAdmin } from "../components/RequireAuth";

interface StationDto { id: number; name: string; }

export const Route = createFileRoute("/admin/stations/new")({
  component: () => <RequireAdmin><NewStationPage /></RequireAdmin>,
  head: () => ({ meta: [{ title: "Add Station \u2014 EV GO Admin" }] }),
});

const CONNECTOR_OPTIONS = ["CCS2", "CHAdeMO", "Type 2", "GB/T"];

function NewStationPage() {
  const navigate = useNavigate();
  const [connectors, setConnectors] = useState<string[]>(["CCS2"]);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post<StationDto>("/stations", body);
      return data;
    },
    onSuccess: (station) => { void navigate({ to: "/admin/stations/$stationId/slots", params: { stationId: String(station.id) } }); },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create station.");
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = e.currentTarget;
    const val = (name: string) => (f.elements.namedItem(name) as HTMLInputElement).value;
    createMutation.mutate({
      name: val("name"),
      address: val("address"),
      latitude: parseFloat(val("latitude")),
      longitude: parseFloat(val("longitude")),
      description: val("description"),
      totalSlots: parseInt(val("totalSlots"), 10),
      pricePerHour: parseFloat(val("pricePerHour")),
      connectorTypes: connectors,
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
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/admin/stations" className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h1 className="font-headline-xl text-primary tracking-tight">Add Station</h1>
          </div>

          {error && <p className="mb-4 text-sm text-error bg-error-container/30 p-3 rounded">{error}</p>}

          <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-lg shadow-sm p-6 flex flex-col gap-5">
            {[
              { name: "name", label: "Station Name", placeholder: "Delhi Central Mall", required: true },
              { name: "address", label: "Address", placeholder: "Connaught Place, New Delhi", required: true },
              { name: "description", label: "Description", placeholder: "Optional", required: false },
            ].map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface" htmlFor={f.name}>{f.label}</label>
                <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id={f.name} name={f.name} placeholder={f.placeholder} required={f.required} type="text" />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "latitude", label: "Latitude", placeholder: "28.6139" },
                { name: "longitude", label: "Longitude", placeholder: "77.2090" },
                { name: "totalSlots", label: "Total Slots", placeholder: "4" },
                { name: "pricePerHour", label: "Price/Hour (₹)", placeholder: "50.00" },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className="font-label-md text-on-surface" htmlFor={f.name}>{f.label}</label>
                  <input className="w-full h-11 px-4 rounded-lg bg-surface-container-low text-on-surface focus:outline-none" id={f.name} name={f.name} placeholder={f.placeholder} required type="text" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-md text-on-surface">Connector Types</span>
              <div className="flex flex-wrap gap-3">
                {CONNECTOR_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={connectors.includes(c)} onChange={(e) => setConnectors(e.target.checked ? [...connectors, c] : connectors.filter((x) => x !== c))} className="w-4 h-4 rounded accent-primary" />
                    <span className="font-body-sm text-on-surface">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-md shadow-sm hover:opacity-90 disabled:opacity-60 mt-2" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating…" : "Create Station"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
