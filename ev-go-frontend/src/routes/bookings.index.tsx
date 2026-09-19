import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/")({
  component: Page11,
  head: () => ({
    meta: [
      { title: "My Bookings \u2014 EV GO" },
      { name: "description", content: "View and manage your EV charging reservations." },
      { property: "og:title", content: "My Bookings \u2014 EV GO" },
      { property: "og:description", content: "View and manage your EV charging reservations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page11() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
<header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm" data-path="dashboard" href="#"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></a><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold"><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="my-bookings" href="/bookings">My Bookings</a><a aria-current="page" className="px-space-md py-space-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="dashboard" href="/dashboard">Dashboard</a></nav></div><div className="flex items-center gap-space-md"><div className="hidden sm:flex flex-col text-right"><span className="font-label-md text-label-md text-on-surface font-medium leading-none">Alex Vance</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-space-xs uppercase tracking-wider">Fleet Pilot</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface flex-1"><div className="flex flex-col w-full">
<section className="max-w-7xl mx-auto w-full px-margin md:px-margin-desktop py-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
<div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">My Bookings</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">View and manage your EV charging reservations</p>
</div>
<div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
<span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface leading-none">Alex Vance</span>
<span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-space-xs">alex.vance@transit.io • +91 98450 12345</span>
</div>
</div>
</div>
<div className="flex items-center gap-space-sm overflow-x-auto pb-space-sm mb-space-lg" role="tablist">
<button className="tab-btn flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-colors" id="tab-upcoming" type="button">
<span>Upcoming</span>
<span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm font-semibold">2</span>
</button>
<button className="tab-btn flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="tab-pending" type="button">
<span>Pending Payment</span>
<span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-code-sm text-code-sm">1</span>
</button>
<button className="tab-btn flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="tab-completed" type="button">
<span>Completed</span>
<span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-code-sm text-code-sm">4</span>
</button>
<button className="tab-btn flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="tab-cancelled" type="button">
<span>Cancelled</span>
<span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-code-sm text-code-sm">1</span>
</button>
</div>
<div className="flex flex-col gap-space-lg" id="content-upcoming">
<div className="grid grid-cols-1 gap-space-md">
<div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg transition-all hover:shadow-md">
<div className="flex flex-col md:flex-row gap-space-md md:items-center">
<div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-[28px]">ev_station</span>
</div>
<div className="flex flex-col gap-space-xs">
<div className="flex flex-wrap items-center gap-space-sm">
<span className="font-headline-md text-headline-md text-on-surface font-semibold">Indiranagar Station</span>
<span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant">#5001</span>
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed/50 text-primary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Confirmed
                </span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>Metro Pillar 84, CMH Road, Indiranagar, Bengaluru</span>
</div>
<div className="flex flex-wrap items-center gap-space-md mt-space-xs text-on-surface font-body-sm text-body-sm">
<span className="flex items-center gap-1 font-medium">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                  Sep 20, 2026 • 02:00 PM - 03:00 PM
                </span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]">power</span>
                  Connector: <span className="font-semibold text-on-surface">CCS2</span>
</span>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-space-md pt-space-md lg:pt-0">
<div className="flex flex-col lg:text-right">
<span className="font-code-sm text-code-sm uppercase tracking-wider text-on-surface-variant">Payment Amount</span>
<span className="font-metric-display text-metric-display text-primary leading-tight">₹60.00</span>
</div>
<div className="flex items-center gap-space-sm w-full sm:w-auto">
<button className="flex-1 sm:flex-initial px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors" type="button">
                Cancel Booking
              </button>
<button className="flex-1 sm:flex-initial px-space-md py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
                View Details
              </button>
</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg transition-all hover:shadow-md">
<div className="flex flex-col md:flex-row gap-space-md md:items-center">
<div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-[28px]">ev_station</span>
</div>
<div className="flex flex-col gap-space-xs">
<div className="flex flex-wrap items-center gap-space-sm">
<span className="font-headline-md text-headline-md text-on-surface font-semibold">Koramangala Station</span>
<span className="font-code-sm text-code-sm px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant">#5002</span>
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed/50 text-primary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Confirmed
                </span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span>80 Feet Road, 4th Block, Koramangala, Bengaluru</span>
</div>
<div className="flex flex-wrap items-center gap-space-md mt-space-xs text-on-surface font-body-sm text-body-sm">
<span className="flex items-center gap-1 font-medium">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                  Sep 23, 2026 • 10:00 AM - 11:00 AM
                </span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]">power</span>
                  Connector: <span className="font-semibold text-on-surface">Type 2</span>
</span>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-space-md pt-space-md lg:pt-0">
<div className="flex flex-col lg:text-right">
<span className="font-code-sm text-code-sm uppercase tracking-wider text-on-surface-variant">Payment Amount</span>
<span className="font-metric-display text-metric-display text-primary leading-tight">₹55.00</span>
</div>
<div className="flex items-center gap-space-sm w-full sm:w-auto">
<button className="flex-1 sm:flex-initial px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors" type="button">
                Cancel Booking
              </button>
<button className="flex-1 sm:flex-initial px-space-md py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" type="button">
                View Details
              </button>
</div>
</div>
</div>
</div>
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-2 of 2 upcoming bookings</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors disabled:opacity-50" disabled={true} type="button">
            Previous
          </button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center" type="button">
            1
          </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container flex items-center justify-center" type="button">
            2
          </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container flex items-center justify-center" type="button">
            3
          </button>
<button className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors" type="button">
            Next
          </button>
</div>
</div>
</div>
<div className="hidden flex-col items-center justify-center py-space-xl px-space-md bg-surface-container-lowest rounded-lg text-center shadow-sm my-space-lg" id="empty-state-view">
<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
<span className="material-symbols-outlined text-[32px]">event_busy</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface font-semibold">No bookings found in this view</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-space-xs mb-space-lg">You do not have any reservations currently listed under this category.</p>
<a className="inline-flex items-center gap-space-sm px-space-lg py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-sm" data-path="find-stations" href="/stations">
<span className="material-symbols-outlined text-[18px]">search</span>
        Find Charging Stations
      </a>
</div>
</section>

</div></main><footer className="w-full bg-surface-container-low mt-space-xl"><div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">EV GO</span><span className="font-body-sm text-body-sm text-on-surface-variant">— Industrial Transit Power Network</span></div><nav className="flex flex-wrap items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="about" href="#">About</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy</a></nav><div className="font-code-sm text-code-sm text-on-surface-variant">© 2025 EV GO Technical Reserve Ltd.</div></div></footer>
    </div>
  );
}
