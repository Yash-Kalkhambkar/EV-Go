import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page1,
  head: () => ({
    meta: [
      { title: "EV GO \u2014 Reserve EV Charging Slots" },
      { name: "description", content: "Find nearby EV charging stations, check live slot availability, and book charging time in advance." },
      { property: "og:title", content: "EV GO \u2014 Reserve EV Charging Slots" },
      { property: "og:description", content: "Find nearby EV charging stations, check live slot availability, and book charging time in advance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page1() {
  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col">


<header className="w-full bg-surface border-b border-surface-border sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
<div className="flex items-center gap-8">
<a className="flex items-center gap-2" href="#">
<span className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[20px]">ev_station</span>
</span>
<span className="font-headline font-bold text-xl tracking-tight text-primary uppercase">EV GO</span>
</a>
<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
<a className="text-primary font-semibold" href="/stations">Find Stations</a>
<a className="hover:text-on-surface" href="#">About</a>
<a className="hover:text-on-surface" href="#">Pricing</a>
<a className="hover:text-on-surface" href="#">Contact</a>
</nav>
</div>
<div className="flex items-center gap-3">
<a className="px-4 py-2 text-sm font-medium text-on-surface hover:text-primary transition-colors" href="/login">Login</a>
<a className="px-4 py-2 text-sm font-semibold rounded bg-primary hover:bg-primary-hover text-on-primary transition-colors" href="/register">Sign Up Free</a>
</div>
</div>
</header>
<main className="w-full flex-1 flex flex-col">

<section className="w-full py-16 px-6 border-b border-surface-border bg-surface">
<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

<div className="lg:col-span-7 flex flex-col items-start">
<h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight mb-4">
            Reserve Electric Vehicle Charging Slots
          </h1>
<p className="font-body text-base sm:text-lg text-on-surface-variant mb-8 max-w-xl">
            Find nearby charging stations, check available slots, and book your charging time in advance with clear pricing per hour.
          </p>
<div className="flex flex-wrap items-center gap-4">
<a className="inline-flex items-center justify-center px-6 py-3 rounded bg-primary hover:bg-primary-hover text-on-primary font-medium text-base transition-colors" href="/stations">
              Find Charging Stations
            </a>
<a className="inline-flex items-center justify-center px-6 py-3 rounded border border-surface-border bg-surface hover:bg-surface-muted text-on-surface font-medium text-base transition-colors" href="/register">
              Sign Up Free
            </a>
</div>
</div>

<div className="lg:col-span-5 w-full">
<div className="bg-background p-6 rounded border border-surface-border">
<h2 className="font-headline font-bold text-lg text-on-surface mb-4">Search Charging Stations</h2>
<form action="/find-stations" className="flex flex-col gap-4" method="GET">
<div className="flex flex-col gap-1.5">
<label className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider" htmlFor="location">Location or Address</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">location_on</span>
<input className="w-full bg-surface border border-surface-border rounded pl-10 pr-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary" id="location" name="location" placeholder="Enter location or address" type="text" />
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div className="flex flex-col gap-1.5">
<label className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider" htmlFor="radius">Search Radius</label>
<select className="w-full bg-surface border border-surface-border rounded px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" id="radius" name="radius">
<option value="5">5 km</option>
<option value="10">10 km</option>
<option value="20">20 km</option>
<option value="50">50 km</option>
</select>
</div>
<div className="flex flex-col justify-end">
<button className="w-full py-2.5 px-3 rounded border border-surface-border bg-surface hover:bg-surface-muted text-on-surface text-sm font-medium flex items-center justify-center gap-1.5 transition-colors" id="use-location-btn" type="button">
<span className="material-symbols-outlined text-[18px] text-primary">my_location</span>
<span>Use My Location</span>
</button>
</div>
</div>
<button className="w-full mt-2 py-3 rounded bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold transition-colors flex items-center justify-center gap-2" type="submit">
<span>Search Stations</span>
<span className="material-symbols-outlined text-[18px]">search</span>
</button>
</form>
</div>
</div>
</div>
</section>

<section className="w-full py-16 px-6 bg-background">
<div className="max-w-7xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="bg-surface p-6 rounded border border-surface-border flex flex-col">
<div className="w-10 h-10 rounded bg-surface-muted text-primary flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-[24px]">event_available</span>
</div>
<h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Real-time Availability</h3>
<p className="font-body text-sm text-on-surface-variant leading-relaxed">
              View available, reserved, and booked slots across stations.
            </p>
</div>

<div className="bg-surface p-6 rounded border border-surface-border flex flex-col">
<div className="w-10 h-10 rounded bg-surface-muted text-primary flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-[24px]">schedule</span>
</div>
<h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Instant Booking</h3>
<p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Select an open time slot and confirm your charging reservation.
            </p>
</div>

<div className="bg-surface p-6 rounded border border-surface-border flex flex-col">
<div className="w-10 h-10 rounded bg-surface-muted text-primary flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-[24px]">credit_card</span>
</div>
<h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Secure Payment</h3>
<p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Clear price per hour with straightforward checkout.
            </p>
</div>

<div className="bg-surface p-6 rounded border border-surface-border flex flex-col">
<div className="w-10 h-10 rounded bg-surface-muted text-primary flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-[24px]">support_agent</span>
</div>
<h3 className="font-headline font-semibold text-lg text-on-surface mb-2">24/7 Support</h3>
<p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Customer support assistance for all bookings.
            </p>
</div>
</div>
</div>
</section>

<section className="w-full py-16 px-6 bg-surface border-t border-surface-border">
<div className="max-w-7xl mx-auto flex flex-col gap-8">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline text-2xl font-bold text-on-surface">Charging Stations</h2>
<p className="font-body text-sm text-on-surface-variant mt-1">Browse stations with real-time slot statuses and pricing.</p>
</div>
<a className="text-sm font-semibold text-primary hover:underline flex items-center gap-1" href="/stations">
<span>View all stations</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-background rounded border border-surface-border p-6 flex flex-col justify-between">
<div>
<div className="flex items-start justify-between gap-2 mb-2">
<h3 className="font-headline font-bold text-base text-on-surface">Indiranagar Station</h3>
<span className="text-xs font-semibold text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-surface-border">1.8 km</span>
</div>
<p className="text-xs text-on-surface-variant mb-4">100 Feet Road, Indiranagar, Bengaluru</p>
<div className="flex flex-col gap-2 pt-2 border-t border-surface-border mb-4 text-xs">
<div className="flex justify-between">
<span className="text-on-surface-variant">Total Chargers</span>
<span className="font-semibold text-on-surface">6</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Connector Types</span>
<span className="font-semibold text-on-surface">CCS2, Type 2</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Price per hour</span>
<span className="font-semibold text-on-surface">₹60/hr</span>
</div>
</div>

<div className="bg-surface rounded border border-surface-border p-2.5 mb-4 flex items-center justify-between text-xs">
<span className="text-on-surface font-medium">10:00 AM - 11:00 AM</span>
<span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Available</span>
</div>
</div>
<a className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold text-center transition-colors" href="#">
              View Available Slots
            </a>
</div>

<div className="bg-background rounded border border-surface-border p-6 flex flex-col justify-between">
<div>
<div className="flex items-start justify-between gap-2 mb-2">
<h3 className="font-headline font-bold text-base text-on-surface">Koramangala Station</h3>
<span className="text-xs font-semibold text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-surface-border">4.2 km</span>
</div>
<p className="text-xs text-on-surface-variant mb-4">80 Feet Road, 4th Block, Koramangala, Bengaluru</p>
<div className="flex flex-col gap-2 pt-2 border-t border-surface-border mb-4 text-xs">
<div className="flex justify-between">
<span className="text-on-surface-variant">Total Chargers</span>
<span className="font-semibold text-on-surface">4</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Connector Types</span>
<span className="font-semibold text-on-surface">CCS2, CHAdeMO</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Price per hour</span>
<span className="font-semibold text-on-surface">₹65/hr</span>
</div>
</div>
<div className="bg-surface rounded border border-surface-border p-2.5 mb-4 flex items-center justify-between text-xs">
<span className="text-on-surface font-medium">11:00 AM - 12:00 PM</span>
<span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Available</span>
</div>
</div>
<a className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold text-center transition-colors" href="#">
              View Available Slots
            </a>
</div>

<div className="bg-background rounded border border-surface-border p-6 flex flex-col justify-between">
<div>
<div className="flex items-start justify-between gap-2 mb-2">
<h3 className="font-headline font-bold text-base text-on-surface">Whitefield Station</h3>
<span className="text-xs font-semibold text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-surface-border">8.6 km</span>
</div>
<p className="text-xs text-on-surface-variant mb-4">ITPL Main Road, Whitefield, Bengaluru</p>
<div className="flex flex-col gap-2 pt-2 border-t border-surface-border mb-4 text-xs">
<div className="flex justify-between">
<span className="text-on-surface-variant">Total Chargers</span>
<span className="font-semibold text-on-surface">8</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Connector Types</span>
<span className="font-semibold text-on-surface">CCS2, Type 2, GB/T</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Price per hour</span>
<span className="font-semibold text-on-surface">₹70/hr</span>
</div>
</div>
<div className="bg-surface rounded border border-surface-border p-2.5 mb-4 flex items-center justify-between text-xs">
<span className="text-on-surface font-medium">02:00 PM - 03:00 PM</span>
<span className="px-2 py-0.5 rounded bg-[#EFECE6] text-on-surface-variant font-semibold">Reserved</span>
</div>
</div>
<a className="w-full py-2.5 rounded bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold text-center transition-colors" href="#">
              View Available Slots
            </a>
</div>
</div>
</div>
</section>
</main>

<footer className="w-full bg-surface border-t border-surface-border py-8">
<div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
<div className="flex items-center gap-2">
<span className="font-headline font-bold text-primary text-lg tracking-tight">EV GO</span>
<span className="text-xs text-on-surface-variant">© 2025 EV GO. All rights reserved.</span>
</div>
<nav className="flex items-center gap-6 text-xs text-on-surface-variant">
<a className="hover:text-on-surface" href="#">About</a>
<a className="hover:text-on-surface" href="#">Contact</a>
<a className="hover:text-on-surface" href="#">Terms</a>
<a className="hover:text-on-surface" href="#">Privacy</a>
</nav>
</div>
</footer>


    </div>
  );
}
