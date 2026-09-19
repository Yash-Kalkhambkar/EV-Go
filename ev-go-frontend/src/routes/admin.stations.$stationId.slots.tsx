import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/stations/$stationId/slots")({
  component: Page14,
  head: () => ({
    meta: [
      { title: "Manage Slots \u2014 EV GO Admin" },
      { name: "description", content: "Manage and generate hourly charging slots for a station." },
      { property: "og:title", content: "Manage Slots \u2014 EV GO Admin" },
      { property: "og:description", content: "Manage and generate hourly charging slots for a station." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page14() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ai-assistant" href="/assistant">AI Assistant</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">
<div className="max-w-[1280px] w-full mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-lg">

<div className="flex items-center justify-between">
<a className="inline-flex items-center gap-space-xs text-primary font-label-md hover:underline cursor-pointer" data-path="admin-stations" href="/admin/stations">
<span className="material-symbols-outlined text-label-md">arrow_back</span>
<span>Back to Stations</span>
</a>
<div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm">
<span>Station ID: #IND-084</span>
<span>•</span>
<span>Bengaluru Zone</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex flex-wrap items-center gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Indiranagar Station — Manage Slots</h1>
</div>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs">
<span className="material-symbols-outlined text-body-sm text-outline">location_on</span>
          Metro Pillar 84, CMH Road, Indiranagar, Bengaluru
        </p>
<div className="flex flex-wrap items-center gap-space-xs mt-space-xs">
<span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-space-sm py-0.5 rounded-lg flex items-center gap-1">
<span className="material-symbols-outlined text-label-sm text-primary">ev_station</span>
            6 Total Chargers
          </span>
<span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-space-sm py-0.5 rounded-lg flex items-center gap-1">
<span className="material-symbols-outlined text-label-sm text-primary">payments</span>
            ₹60.00/hour
          </span>
<span className="bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm px-space-sm py-0.5 rounded-lg">
            CCS2 • Type 2
          </span>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0">
<button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-lg flex items-center gap-space-xs shadow-sm transition-colors cursor-pointer" id="open-generate-modal">
<span className="material-symbols-outlined text-label-md">add_circle</span>
<span>Generate Slots</span>
</button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex items-center gap-space-xs overflow-x-auto">
<button className="bg-primary text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg flex items-center gap-space-xs shrink-0 shadow-sm">
<span className="material-symbols-outlined text-label-sm">today</span>
<span>Today, Sep 20</span>
</button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Tomorrow, Sep 21
      </button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Sun, Sep 22
      </button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Mon, Sep 23
      </button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Tue, Sep 24
      </button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Wed, Sep 25
      </button>
<button className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md px-space-md py-2 rounded-lg shrink-0 transition-colors">
        Thu, Sep 26
      </button>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md">
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Slots</span>
<span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-xs">24</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Full Schedule</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Available</span>
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
</div>
<span className="font-headline-lg text-headline-lg text-primary font-bold mt-space-xs">14</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Open for booking</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Reserved</span>
<span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
</div>
<span className="font-headline-lg text-headline-lg text-tertiary font-bold mt-space-xs">2</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Temporary hold</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Booked</span>
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
</div>
<span className="font-headline-lg text-headline-lg text-secondary font-bold mt-space-xs">6</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Confirmed orders</span>
</div>
<div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Unavailable</span>
<span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
</div>
<span className="font-headline-lg text-headline-lg text-outline font-bold mt-space-xs">2</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-space-xs">Service block</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">

<div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface">Time Slots</span>
<span className="bg-surface-container-highest font-code-sm text-code-sm text-on-surface-variant px-space-xs py-0.5 rounded">Sep 20, 2024</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="font-body-sm text-body-sm text-on-surface-variant">Default Unit Rate:</span>
<span className="font-label-md text-label-md text-primary font-bold">₹60.00/hour</span>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th className="px-space-md py-space-sm" scope="col">Date</th>
<th className="px-space-md py-space-sm" scope="col">Time Slot</th>
<th className="px-space-md py-space-sm" scope="col">Status</th>
<th className="px-space-md py-space-sm" scope="col">Booking ID</th>
<th className="px-space-md py-space-sm" scope="col">Price / Hour</th>
<th className="px-space-md py-space-sm text-right" scope="col">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high">

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">06:00 - 07:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  Unavailable
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">—</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-primary hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Available</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">07:00 - 08:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Booked
                </span>
</td>
<td className="px-space-md py-3">
<a className="font-code-sm text-code-sm text-primary font-bold hover:underline" data-path="admin-bookings" href="#">#5001</a>
</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Edit</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">08:00 - 09:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Booked
                </span>
</td>
<td className="px-space-md py-3">
<a className="font-code-sm text-code-sm text-primary font-bold hover:underline" data-path="admin-bookings" href="#">#5003</a>
</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Edit</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">09:00 - 10:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Available
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">—</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">10:00 - 11:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Available
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">—</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">11:00 - 12:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Reserved
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">Temporary Hold</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Edit</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">12:00 - 13:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Booked
                </span>
</td>
<td className="px-space-md py-3">
<a className="font-code-sm text-code-sm text-primary font-bold hover:underline" data-path="admin-bookings" href="#">#5004</a>
</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Edit</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">13:00 - 14:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Available
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">—</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">14:00 - 15:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Booked
                </span>
</td>
<td className="px-space-md py-3">
<a className="font-code-sm text-code-sm text-primary font-bold hover:underline" data-path="admin-bookings" href="#">#5002</a>
</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Edit</button>
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-space-md py-3 text-on-surface font-label-md">Sep 20, 2024</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">15:00 - 16:00</td>
<td className="px-space-md py-3">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Available
                </span>
</td>
<td className="px-space-md py-3 text-on-surface-variant font-code-sm text-code-sm">—</td>
<td className="px-space-md py-3 font-code-sm text-code-sm text-on-surface">₹60.00</td>
<td className="px-space-md py-3 text-right">
<div className="inline-flex items-center gap-space-xs">
<button className="px-2.5 py-1 text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Mark Unavailable</button>
<button className="px-2.5 py-1 text-error hover:bg-error-container font-label-sm text-label-sm rounded cursor-pointer transition-colors">Delete</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-10 of 24 slots</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors disabled:opacity-50 cursor-pointer flex items-center">
<span className="material-symbols-outlined text-label-sm">chevron_left</span>
<span>Previous</span>
</button>
<button className="w-8 h-8 rounded bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">
            1
          </button>
<button className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer">
            2
          </button>
<button className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer">
            3
          </button>
<button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors cursor-pointer flex items-center">
<span>Next</span>
<span className="material-symbols-outlined text-label-sm">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-space-md hidden backdrop-blur-[2px]" id="generate-modal">
<div className="bg-surface-container-lowest rounded-lg max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-headline-md">auto_mode</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">Generate Time Slots</h3>
</div>
<button className="text-on-surface-variant hover:text-on-surface p-1 rounded cursor-pointer" id="close-modal-x">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Batch create hourly availability slots for Indiranagar Station chargers at standard unit rate ₹60.00/hour.
        </p>
<form className="flex flex-col gap-space-md">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Start Date</label>
<input className="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-colors cursor-pointer" type="date" defaultValue="2024-09-20" />
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">End Date</label>
<input className="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-colors cursor-pointer" type="date" defaultValue="2024-09-21" />
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Daily Start Time</label>
<input className="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-colors" type="text" defaultValue="06:00" />
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Daily End Time</label>
<input className="h-11 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-low transition-colors" type="text" defaultValue="22:00" />
</div>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Slot Duration</label>
<div className="h-11 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md flex items-center justify-between">
<span>60 minutes</span>
<span className="material-symbols-outlined text-outline">schedule</span>
</div>
</div>
<div className="flex items-center justify-end gap-space-sm pt-space-sm">
<button className="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer transition-colors" id="close-modal-cancel" type="button">
              Cancel
            </button>
<button className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold cursor-pointer transition-colors shadow-sm" type="submit">
              Generate Slots
            </button>
</div>
</form>
</div>
</div>
</div>
</div>
</main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
