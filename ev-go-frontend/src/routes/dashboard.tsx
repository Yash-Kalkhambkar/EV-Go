import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Page10,
  head: () => ({
    meta: [
      { title: "Dashboard \u2014 EV GO" },
      { name: "description", content: "Your EV GO account portal with upcoming charging reservations and quick actions." },
      { property: "og:title", content: "Dashboard \u2014 EV GO" },
      { property: "og:description", content: "Your EV GO account portal with upcoming charging reservations and quick actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page10() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
<header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm" data-path="dashboard" href="#"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></a><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold"><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="my-bookings" href="/bookings">My Bookings</a><a aria-current="page" className="px-space-md py-space-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="dashboard" href="/dashboard">Dashboard</a></nav></div><div className="flex items-center gap-space-md"><div className="hidden sm:flex flex-col text-right"><span className="font-label-md text-label-md text-on-surface font-medium leading-none">Alex Vance</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-space-xs uppercase tracking-wider">Fleet Pilot</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface flex-1"><div className="flex flex-col w-full">

<div className="w-full bg-surface-container-low py-space-sm px-margin md:px-margin-desktop">
<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm tracking-wider uppercase">
<span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span>Account Portal</span>
<span>/</span>
<span className="text-on-surface font-semibold">Alex Morgan</span>
</div>
<div className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-space-md">
<span>Bengaluru Zone Node</span>
<span className="text-outline-variant">•</span>
<span>Standard Tariff Applied</span>
</div>
</div>
</div>
<div className="max-w-7xl w-full mx-auto px-margin md:px-margin-desktop py-space-lg space-y-space-xl">

<div className="relative overflow-hidden rounded-xl bg-surface-container p-space-lg md:p-space-xl shadow-sm">
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-lg relative z-10">
<div className="space-y-space-xs">
<div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary/10 text-primary font-code-sm text-code-sm uppercase tracking-wide">
<span className="material-symbols-outlined text-[14px]">verified_user</span>
<span>Active Member</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Welcome back, Alex Morgan
          </h1>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[18px] text-outline">mail</span>
<span>alex.morgan@example.com</span>
</p>
</div>
<div className="flex items-center gap-space-sm">
<a className="inline-flex items-center justify-center gap-space-xs h-12 px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" data-path="find-stations" href="/stations">
<span className="material-symbols-outlined text-[20px]">ev_station</span>
<span>Find Charging Stations</span>
</a>
</div>
</div>
</div>

<div>
<div className="flex items-baseline justify-between mb-space-md">
<h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Quick Actions</h2>
<span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Direct Access</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">

<a className="group block p-space-lg rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 shadow-sm hover:shadow-md" data-path="find-stations" href="#">
<div className="flex items-center justify-between mb-space-md">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[26px]">search</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-xs">Find Charging Stations</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Locate nearby fast bays, browse connector types, and reserve available slots.</p>
</a>

<a className="group block p-space-lg rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 shadow-sm hover:shadow-md" data-path="my-bookings" href="#">
<div className="flex items-center justify-between mb-space-md">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[26px]">calendar_today</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-xs">My Bookings</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">View your active reservations, confirmed slots, and past charging orders.</p>
</a>

<a className="group block p-space-lg rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 shadow-sm hover:shadow-md" data-path="ai-assistant" href="#">
<div className="flex items-center justify-between mb-space-md">
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
<span className="material-symbols-outlined text-[26px]">smart_toy</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-xs">AI Assistant</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Automated trip recommendations and fast slot discovery for your EV model.</p>
</a>
</div>
</div>

<div className="space-y-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Upcoming Bookings</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Active reservations held in the central network reserve.</p>
</div>

<div className="flex items-center gap-space-sm">
<button className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-space-xs" id="toggle-view-btn">
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
<span id="toggle-btn-label">Preview Empty State</span>
</button>
<a className="px-space-md py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm transition-colors" data-path="my-bookings" href="/bookings">
            View All Bookings
          </a>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg" id="populated-bookings-state">

<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
<div className="space-y-space-md">

<div className="flex items-start justify-between gap-space-sm">
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider block mb-1">Reservation ID: #5001</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">Indiranagar Station</h3>
</div>
<span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-md bg-[#1B4D3E]/10 text-[#1B4D3E] font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E]"></span>
<span>Confirmed</span>
</span>
</div>

<div className="flex items-start gap-space-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">location_on</span>
<p className="font-body-sm text-body-sm leading-relaxed">Metro Pillar 84, CMH Road, Indiranagar, Bengaluru</p>
</div>

<div className="rounded-lg bg-surface-container-low p-space-md grid grid-cols-2 gap-space-sm">
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant block uppercase">Date &amp; Time</span>
<span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 block">Sep 20 • 02:00 PM - 03:00 PM</span>
</div>
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant block uppercase">Total Amount</span>
<span className="font-metric-display text-metric-display text-primary font-bold mt-0.5 block leading-none">₹60.00</span>
</div>
</div>
</div>

<div className="flex items-center justify-end gap-space-sm pt-space-md mt-space-md bg-surface-container-lowest">
<button className="h-10 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-error font-label-md text-label-md transition-colors" type="button">
              Cancel
            </button>
<button className="h-10 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
              View Details
            </button>
</div>
</div>

<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between">
<div className="space-y-space-md">

<div className="flex items-start justify-between gap-space-sm">
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider block mb-1">Reservation ID: #5002</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">Koramangala Station</h3>
</div>
<span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-md bg-[#1B4D3E]/10 text-[#1B4D3E] font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E]"></span>
<span>Confirmed</span>
</span>
</div>

<div className="flex items-start gap-space-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">location_on</span>
<p className="font-body-sm text-body-sm leading-relaxed">80 Feet Road, 4th Block, Koramangala, Bengaluru</p>
</div>

<div className="rounded-lg bg-surface-container-low p-space-md grid grid-cols-2 gap-space-sm">
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant block uppercase">Date &amp; Time</span>
<span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 block">Sep 23 • 10:00 AM - 11:00 AM</span>
</div>
<div>
<span className="font-code-sm text-code-sm text-on-surface-variant block uppercase">Total Amount</span>
<span className="font-metric-display text-metric-display text-primary font-bold mt-0.5 block leading-none">₹55.00</span>
</div>
</div>
</div>

<div className="flex items-center justify-end gap-space-sm pt-space-md mt-space-md bg-surface-container-lowest">
<button className="h-10 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-error font-label-md text-label-md transition-colors" type="button">
              Cancel
            </button>
<button className="h-10 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
              View Details
            </button>
</div>
</div>
</div>

<div className="hidden rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm" id="empty-bookings-state">
<div className="max-w-md mx-auto space-y-space-md py-space-lg">
<div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto text-on-surface-variant">
<span className="material-symbols-outlined text-[32px]">event_busy</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">No upcoming bookings</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              You do not have any active or confirmed bay slots scheduled right now.
            </p>
</div>
<div className="pt-space-sm">
<a className="inline-flex items-center justify-center gap-space-xs h-11 px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" data-path="find-stations" href="#">
<span className="material-symbols-outlined text-[18px]">near_me</span>
<span>Find Stations</span>
</a>
</div>
</div>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">account_circle</span>
</div>
<div>
<span className="font-label-md text-label-md text-on-surface font-semibold block">Alex Morgan</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">alex.morgan@example.com</span>
</div>
</div>
<div className="flex items-center gap-space-lg text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
<span>Verified EV Driver Profile</span>
</div>
<a className="font-label-md text-label-md text-primary hover:underline" data-path="my-bookings" href="#">View All Bookings →</a>
</div>
</div>
</div>


</div></main><footer className="w-full bg-surface-container-low mt-space-xl"><div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">EV GO</span><span className="font-body-sm text-body-sm text-on-surface-variant">— Industrial Transit Power Network</span></div><nav className="flex flex-wrap items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="about" href="#">About</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy</a></nav><div className="font-code-sm text-code-sm text-on-surface-variant">© 2025 EV GO Technical Reserve Ltd.</div></div></footer>
    </div>
  );
}
