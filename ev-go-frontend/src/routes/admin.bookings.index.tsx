import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookings/")({
  component: Page13,
  head: () => ({
    meta: [
      { title: "All Bookings \u2014 EV GO Admin" },
      { name: "description", content: "Monitor and manage customer charging reservations across all stations." },
      { property: "og:title", content: "All Bookings \u2014 EV GO Admin" },
      { property: "og:description", content: "Monitor and manage customer charging reservations across all stations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page13() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ai-assistant" href="/assistant">AI Assistant</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">
<div className="max-w-[1280px] w-full mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col gap-space-lg">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<span className="font-code-sm text-code-sm tracking-wider uppercase text-on-surface-variant font-semibold">System Administration • Network Registry</span>
<h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">All Bookings</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Monitor and manage customer charging reservations across all network stations</p>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-sm rounded-lg shadow-sm">
<span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
<span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Sync: Live Terminal Feed</span>
</div>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wide">Total Bookings</span>
<span className="material-symbols-outlined text-primary text-base">receipt_long</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface font-bold">128</div>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">All network stations</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-primary mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wide font-semibold">Confirmed</span>
<span className="material-symbols-outlined text-primary-container text-base">task_alt</span>
</div>
<div className="font-headline-lg text-headline-lg text-primary font-bold">84</div>
<span className="font-code-sm text-code-sm text-primary-container font-medium mt-space-xs">Active allocation</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-tertiary mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wide font-semibold">Pending</span>
<span className="material-symbols-outlined text-tertiary text-base">schedule</span>
</div>
<div className="font-headline-lg text-headline-lg text-tertiary font-bold">12</div>
<span className="font-code-sm text-code-sm text-on-tertiary-container font-medium mt-space-xs">Awaiting checkout</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wide font-semibold">Completed</span>
<span className="material-symbols-outlined text-on-surface-variant text-base">check_circle</span>
</div>
<div className="font-headline-lg text-headline-lg text-on-surface font-bold">26</div>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Archived slots</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
<div className="flex items-center justify-between text-secondary mb-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wide font-semibold">Cancelled</span>
<span className="material-symbols-outlined text-secondary text-base">cancel</span>
</div>
<div className="font-headline-lg text-headline-lg text-secondary font-bold">6</div>
<span className="font-code-sm text-code-sm text-on-secondary-fixed-variant font-medium mt-space-xs">Slots liberated</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">

<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="filter-search">Search Query</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">search</span>
<input className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none transition-colors" id="filter-search" placeholder="Booking ID, user name, or email" type="text" />
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="filter-status">Reservation Status</label>
<div className="relative flex items-center">
<select className="w-full h-11 px-3 appearance-none rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none transition-colors cursor-pointer" id="filter-status">
<option value="All">Status: All</option>
<option value="Confirmed">Confirmed</option>
<option value="Pending">Pending</option>
<option value="Completed">Completed</option>
<option value="Cancelled">Cancelled</option>
</select>
<span className="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant text-lg">expand_more</span>
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="filter-station">Station Node</label>
<div className="relative flex items-center">
<select className="w-full h-11 px-3 appearance-none rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none transition-colors cursor-pointer" id="filter-station">
<option value="All">Station: All Stations</option>
<option value="Indiranagar">Indiranagar Station</option>
<option value="Koramangala">Koramangala Station</option>
<option value="Whitefield">Whitefield Station</option>
<option value="Domlur">Domlur Station</option>
<option value="Trinity">Trinity Circle Station</option>
</select>
<span className="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant text-lg">expand_more</span>
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="filter-date">Date Window</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">calendar_today</span>
<input className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface cursor-pointer focus:bg-surface-container-lowest focus:outline-none transition-colors" id="filter-date" readOnly={true} type="text" defaultValue="Sep 20, 2026 - Sep 27, 2026" />
</div>
</div>
</div>

<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="h-10 px-space-md rounded-lg font-label-md text-label-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5" id="btn-clear-filters" type="button">
<span className="material-symbols-outlined text-base">restart_alt</span>
<span>Clear Filters</span>
</button>
<button className="h-10 px-space-lg rounded-lg font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary shadow-sm transition-colors flex items-center gap-1.5" id="btn-apply-filters" type="button">
<span className="material-symbols-outlined text-base">filter_list</span>
<span>Apply Filters</span>
</button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col">
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse min-w-[960px]">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant">
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Booking ID</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">User Details</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Station</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Date &amp; Slot Time</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Connector</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Amount</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider" scope="col">Status</th>
<th className="py-3 px-4 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-right" scope="col">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface" id="bookings-table-body">

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5001" data-station="Indiranagar Station" data-status="Confirmed">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5001</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Alex Morgan</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 98765 43210</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Indiranagar Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 20, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">02:00 PM - 03:00 PM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">CCS2</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹60.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  Confirmed
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
<button className="px-2.5 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 font-label-sm text-label-sm text-secondary font-semibold transition-colors" type="button">
                    Cancel Booking
                  </button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5002" data-station="Koramangala Station" data-status="Confirmed">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5002</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Alex Vance</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">alex.vance@transit.io</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 98450 12345</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Koramangala Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 23, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">10:00 AM - 11:00 AM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">Type 2</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹55.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  Confirmed
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
<button className="px-2.5 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 font-label-sm text-label-sm text-secondary font-semibold transition-colors" type="button">
                    Cancel Booking
                  </button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5003" data-station="Indiranagar Station" data-status="Completed">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5003</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Priya Sharma</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">priya.s@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 91234 56789</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Indiranagar Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 20, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">08:00 AM - 09:00 AM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">CCS2</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹60.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                  Completed
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant/40 font-semibold cursor-not-allowed" disabled={true} type="button">
                    Cancel Booking
                  </button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5004" data-station="Trinity Circle Station" data-status="Pending">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5004</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Rajesh Kumar</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">rajesh.k@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 99887 76655</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Trinity Circle Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 21, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">12:00 PM - 01:00 PM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">CHAdeMO</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹70.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed-dim/30 text-on-tertiary-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Pending
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
<button className="px-2.5 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 font-label-sm text-label-sm text-secondary font-semibold transition-colors" type="button">
                    Cancel Booking
                  </button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5005" data-station="Whitefield Station" data-status="Cancelled">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5005</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Ananya Roy</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">ananya.roy@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 97711 22334</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Whitefield Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 22, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">03:00 PM - 04:00 PM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">CCS2</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹70.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Cancelled
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors" data-booking="#5006" data-station="Domlur Station" data-status="Confirmed">
<td className="py-4 px-4 font-code-sm text-code-sm font-bold text-primary">#5006</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-label-md text-label-md font-semibold text-on-surface">Deepak Verma</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">deepak.v@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">+91 96655 44332</span>
</div>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-medium text-on-surface">Domlur Station</td>
<td className="py-4 px-4">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-medium">Sep 22, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">05:00 PM - 06:00 PM</span>
</div>
</td>
<td className="py-4 px-4">
<span className="px-2 py-0.5 rounded bg-surface-container font-code-sm text-code-sm text-on-surface-variant font-semibold">GB-T</span>
</td>
<td className="py-4 px-4 font-label-md text-label-md font-bold text-on-surface">₹50.00</td>
<td className="py-4 px-4">
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  Confirmed
                </div>
</td>
<td className="py-4 px-4 text-right">
<div className="inline-flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface font-semibold transition-colors" type="button">
                    View Details
                  </button>
<button className="px-2.5 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 font-label-sm text-label-sm text-secondary font-semibold transition-colors" type="button">
                    Cancel Booking
                  </button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">1-6</span> of <span className="font-semibold text-on-surface">128</span> bookings
        </span>
<div className="flex items-center gap-space-xs">
<button className="h-8 px-3 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface-variant/50 cursor-not-allowed" disabled={true} type="button">
            Previous
          </button>
<button className="h-8 w-8 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm" type="button">
            1
          </button>
<button className="h-8 w-8 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors" type="button">
            2
          </button>
<button className="h-8 w-8 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors" type="button">
            3
          </button>
<button className="h-8 w-8 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors" type="button">
            4
          </button>
<button className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors" type="button">
            Next
          </button>
</div>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden items-center justify-center p-4" id="booking-modal">
<div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-xl overflow-hidden flex flex-col">
<div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary">receipt</span>
<span className="font-headline-md text-headline-md text-on-surface font-bold" id="modal-title">Booking Details</span>
</div>
<button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button">
<span className="material-symbols-outlined text-lg">close</span>
</button>
</div>
<div className="p-space-lg flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-sm bg-surface-container-low p-space-sm rounded-lg">
<span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Status</span>
<span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold" id="modal-status-badge">Confirmed</span>
</div>
<div className="grid grid-cols-2 gap-space-md">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Booking ID</span>
<span className="font-code-sm text-code-sm font-bold text-primary" id="modal-booking-id">#5001</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Payment Amount</span>
<span className="font-label-md text-label-md font-bold text-on-surface" id="modal-amount">₹60.00</span>
</div>
</div>
<div className="flex flex-col bg-surface-container-low p-space-sm rounded-lg gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">User Information</span>
<span className="font-label-md text-label-md font-bold text-on-surface" id="modal-user-name">Alex Morgan</span>
<span className="font-code-sm text-code-sm text-on-surface-variant" id="modal-user-email">alex.morgan@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface-variant" id="modal-user-phone">+91 98765 43210</span>
</div>
<div className="grid grid-cols-2 gap-space-md">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Station</span>
<span className="font-label-md text-label-md font-semibold text-on-surface" id="modal-station">Indiranagar Station</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Connector Type</span>
<span className="font-code-sm text-code-sm font-semibold text-primary" id="modal-connector">CCS2</span>
</div>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Date &amp; Slot Window</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface" id="modal-time">Sep 20, 2026 • 02:00 PM - 03:00 PM</span>
</div>
</div>
<div className="p-space-md bg-surface-container-low flex justify-end gap-space-xs">
<button className="h-10 px-space-md rounded-lg font-label-md text-label-md text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors" type="button">
          Close
        </button>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden items-center justify-center p-4" id="cancel-modal">
<div className="bg-surface-container-lowest max-w-sm w-full rounded-xl shadow-xl overflow-hidden p-space-lg flex flex-col gap-space-md">
<div className="flex items-center gap-space-sm text-secondary">
<span className="material-symbols-outlined text-2xl">warning</span>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Confirm Cancellation</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
        Are you sure you want to cancel booking <span className="font-bold text-on-surface" id="cancel-target-id">#5001</span>? This will free the charging slot across the network.
      </p>
<div className="flex items-center justify-end gap-space-xs pt-space-xs">
<button className="h-10 px-space-md rounded-lg font-label-md text-label-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors" type="button">
          Abort
        </button>
<button className="h-10 px-space-md rounded-lg font-label-md text-label-md text-on-primary bg-secondary hover:bg-secondary/90 transition-colors" id="confirm-cancel-btn" type="button">
          Yes, Cancel Reservation
        </button>
</div>
</div>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
