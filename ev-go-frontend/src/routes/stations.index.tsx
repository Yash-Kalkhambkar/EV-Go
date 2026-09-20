import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RequireAuth } from "../components/RequireAuth";

interface StationDto {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  totalSlots: number;
  availableSlots: number;
  connectorTypes: string[];
  distance?: number;
}

export const Route = createFileRoute("/stations/")({
  component: () => <RequireAuth><StationsPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "Find Charging Stations \u2014 EV GO" },
      { name: "description", content: "Browse EV charging stations near you with live slot availability, connectors and pricing." },
      { property: "og:title", content: "Find Charging Stations \u2014 EV GO" },
      { property: "og:description", content: "Browse EV charging stations near you with live slot availability, connectors and pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function StationsPage() {
  const [radius, setRadius] = useState(10);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setCoords({ lat: 12.9716, lng: 77.5946 });
        setLocationError("Using default location (Bangalore). Enable location for accurate results.");
      }
    );
  }, []);

  const [locationRequested, setLocationRequested] = useState(false);
  if (!locationRequested) {
    setLocationRequested(true);
    requestLocation();
  }

  const { data: stations = [], isLoading, isError } = useQuery<StationDto[]>({
    queryKey: ["stations", coords?.lat, coords?.lng, radius],
    queryFn: async () => {
      if (!coords) return [];
      const { data } = await api.get<StationDto[]>("/stations/search", {
        params: { latitude: coords.lat, longitude: coords.lng, radius },
      });
      return data;
    },
    enabled: !!coords,
  });

  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col">
      <header className="bg-surface border-b border-border-subtle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-headline font-bold text-xl tracking-tight text-primary">EV GO</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
              <Link to="/stations" className="text-primary font-semibold">Find Stations</Link>
              <Link to="/bookings" className="hover:text-on-surface transition-colors">My Bookings</Link>
              <Link to="/assistant" className="hover:text-on-surface transition-colors">AI Assistant</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            {isLoading ? "Searching…" : `Found ${stations.length} station${stations.length !== 1 ? "s" : ""} within ${radius}km`}
          </h1>
        </div>

        {locationError && (
          <p className="text-sm text-on-surface-variant">{locationError}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-4 xl:col-span-3 bg-surface p-5 rounded-lg border border-border-subtle shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="font-headline font-semibold text-base text-on-surface">Filters</span>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-on-surface" htmlFor="radiusRange">Radius</label>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface">{radius}km</span>
              </div>
              <input className="w-full h-1.5 bg-surface-container rounded cursor-pointer accent-primary" id="radiusRange" max="50" min="5" step="5" type="range" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
              <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                <span>5km</span><span>50km</span>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium py-2.5 rounded-lg transition-colors" onClick={requestLocation} type="button">
              Use My Location
            </button>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
            {isError && <p className="text-sm text-error">Failed to load stations. Please try again.</p>}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">refresh</span>
              </div>
            )}
            {!isLoading && stations.length === 0 && !isError && (
              <div className="bg-surface rounded-lg p-10 border border-border-subtle text-center">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant">search_off</span>
                <h2 className="font-headline text-lg font-bold text-on-surface mt-3">No stations found</h2>
                <p className="text-sm text-on-surface-variant mt-1">Try expanding the search radius.</p>
              </div>
            )}
            {stations.map((station) => (
              <article key={station.id} className="bg-surface rounded-lg p-5 border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-lg font-bold text-on-surface">{station.name}</h2>
                  <p className="text-sm text-on-surface-variant mt-0.5">{station.address}</p>
                  {station.distance != null && <p className="text-xs text-on-surface-variant mt-1">{station.distance.toFixed(1)} km away</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {station.connectorTypes.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">{c}</span>
                    ))}
                  </div>
                  <div className="text-xs text-on-surface font-medium mt-3">
                    <span>{station.availableSlots} slots available</span>
                    <span className="mx-1.5 text-on-surface-variant">•</span>
                    <span className="text-on-surface-variant">Total: {station.totalSlots}</span>
                  </div>
                </div>
                <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
                  <span className="text-xl font-bold font-headline text-on-surface">₹{station.pricePerHour}/hour</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Link to="/stations/$stationId" params={{ stationId: String(station.id) }} className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
