import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/stations/")({
  component: Page9,
  head: () => ({
    meta: [
      { title: "Manage Stations \u2014 EV GO Admin" },
      { name: "description", content: "View, update and manage charging stations across the EV GO network." },
      { property: "og:title", content: "Manage Stations \u2014 EV GO Admin" },
      { property: "og:description", content: "View, update and manage charging stations across the EV GO network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page9() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ai-assistant" href="/assistant">AI Assistant</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">
<div className="max-w-[1280px] w-full mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col gap-space-lg">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-xs">
<span className="font-code-sm text-code-sm text-surface-tint uppercase tracking-wider">Network Control Unit</span>
<span className="text-outline-variant">•</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Bengaluru Metropolitan Node</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">Manage Stations</h1>
<p className="font-body-md text-body-md text-on-surface-variant">View, update, and manage charging stations across the network</p>
</div>
<div className="flex items-center gap-space-sm self-start md:self-auto">
<button className="flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary transition-colors shadow-sm" id="addStationBtn">
<span className="material-symbols-outlined text-[20px]">add</span>
<span>Add New Station</span>
</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Registered Stations</span>
<div className="flex items-baseline gap-space-xs mt-space-xs">
<span className="font-metric-display text-metric-display text-primary font-bold">5</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">locations</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Chargers</span>
<div className="flex items-baseline gap-space-xs mt-space-xs">
<span className="font-metric-display text-metric-display text-primary font-bold">32</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">active bays</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Operational Status</span>
<div className="flex items-baseline gap-space-xs mt-space-xs">
<span className="font-metric-display text-metric-display text-primary font-bold">4</span>
<span className="font-body-sm text-body-sm text-surface-tint">Active</span>
<span className="text-outline-variant mx-space-xs">/</span>
<span className="font-label-md text-label-md text-on-surface-variant">1 Inactive</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Network Standard Tariffs</span>
<div className="flex items-baseline gap-space-xs mt-space-xs">
<span className="font-metric-display text-metric-display text-primary font-bold">₹50–₹70</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">/hour range</span>
</div>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
<div className="relative flex-1">
<span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
<input className="w-full h-11 pl-10 pr-space-md bg-surface-container-low text-on-surface rounded-lg font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-colors" id="searchInput" placeholder="Search by name or location" type="text" />
</div>
<div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm">
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-md h-11 rounded-lg w-full sm:w-auto">
<span className="material-symbols-outlined text-outline text-[18px]">ev_charger</span>
<select className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer w-full pr-space-xs" id="connectorFilter">
<option value="all">All Connectors</option>
<option value="CCS2">CCS2</option>
<option value="CHAdeMO">CHAdeMO</option>
<option value="Type 2">Type 2</option>
<option value="GB/T">GB/T</option>
</select>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-low px-space-md h-11 rounded-lg w-full sm:w-auto">
<span className="material-symbols-outlined text-outline text-[18px]">tune</span>
<select className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer w-full pr-space-xs" id="statusFilter">
<option value="all">All Stations</option>
<option value="active">Active</option>
<option value="inactive">Inactive</option>
</select>
</div>
<button className="h-11 px-space-md rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors" id="resetFiltersBtn">
          Reset
        </button>
</div>
</div>
<div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left font-body-md text-body-md text-on-surface whitespace-nowrap">
<thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<tr>
<th className="py-space-md px-space-lg font-semibold" scope="col">ID</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Station Name</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Address</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Connectors</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Total Chargers</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Price/Hour</th>
<th className="py-space-md px-space-md font-semibold" scope="col">Status</th>
<th className="py-space-md px-space-lg font-semibold text-right" scope="col">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high" id="stationsTableBody">
<tr className="station-row hover:bg-surface-container-low/60 transition-colors" data-connectors="CCS2 Type 2" data-id="ST-101" data-location="Metro Pillar 84, CMH Road, Indiranagar, Bengaluru" data-name="Indiranagar Station" data-status="active">
<td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-primary">#ST-101</td>
<td className="py-space-md px-space-md font-label-md text-label-md font-semibold text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  Indiranagar Station
                </div>
</td>
<td className="py-space-md px-space-md text-on-surface-variant font-body-sm text-body-sm max-w-[240px] truncate" title="Metro Pillar 84, CMH Road, Indiranagar, Bengaluru">
                Metro Pillar 84, CMH Road, Indiranagar, Bengaluru
              </td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">Type 2</span>
</div>
</td>
<td className="py-space-md px-space-md font-body-sm text-body-sm text-on-surface">
<span className="font-semibold text-primary">6</span> Total Chargers
              </td>
<td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                ₹60.00/hour
              </td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  Active
                </span>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="action-edit px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">Edit</button>
<button className="action-slots px-space-sm py-1 rounded font-label-sm text-label-sm bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold transition-colors">Manage Slots</button>
<button className="action-delete px-space-sm py-1 rounded font-label-sm text-label-sm bg-error-container/40 hover:bg-error-container text-error transition-colors">Delete</button>
</div>
</td>
</tr>
<tr className="station-row hover:bg-surface-container-low/60 transition-colors" data-connectors="CCS2 Type 2 CHAdeMO" data-id="ST-102" data-location="80 Feet Road, 4th Block, Koramangala, Bengaluru" data-name="Koramangala Station" data-status="active">
<td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-primary">#ST-102</td>
<td className="py-space-md px-space-md font-label-md text-label-md font-semibold text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  Koramangala Station
                </div>
</td>
<td className="py-space-md px-space-md text-on-surface-variant font-body-sm text-body-sm max-w-[240px] truncate" title="80 Feet Road, 4th Block, Koramangala, Bengaluru">
                80 Feet Road, 4th Block, Koramangala, Bengaluru
              </td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">Type 2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CHAdeMO</span>
</div>
</td>
<td className="py-space-md px-space-md font-body-sm text-body-sm text-on-surface">
<span className="font-semibold text-primary">8</span> Total Chargers
              </td>
<td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                ₹55.00/hour
              </td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  Active
                </span>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="action-edit px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">Edit</button>
<button className="action-slots px-space-sm py-1 rounded font-label-sm text-label-sm bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold transition-colors">Manage Slots</button>
<button className="action-delete px-space-sm py-1 rounded font-label-sm text-label-sm bg-error-container/40 hover:bg-error-container text-error transition-colors">Delete</button>
</div>
</td>
</tr>
<tr className="station-row hover:bg-surface-container-low/60 transition-colors" data-connectors="CCS2 CHAdeMO" data-id="ST-103" data-location="MG Road Junction, Trinity Circle, Bengaluru" data-name="Trinity Circle Station" data-status="active">
<td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-primary">#ST-103</td>
<td className="py-space-md px-space-md font-label-md text-label-md font-semibold text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  Trinity Circle Station
                </div>
</td>
<td className="py-space-md px-space-md text-on-surface-variant font-body-sm text-body-sm max-w-[240px] truncate" title="MG Road Junction, Trinity Circle, Bengaluru">
                MG Road Junction, Trinity Circle, Bengaluru
              </td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CHAdeMO</span>
</div>
</td>
<td className="py-space-md px-space-md font-body-sm text-body-sm text-on-surface">
<span className="font-semibold text-primary">6</span> Total Chargers
              </td>
<td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                ₹70.00/hour
              </td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  Active
                </span>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="action-edit px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">Edit</button>
<button className="action-slots px-space-sm py-1 rounded font-label-sm text-label-sm bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold transition-colors">Manage Slots</button>
<button className="action-delete px-space-sm py-1 rounded font-label-sm text-label-sm bg-error-container/40 hover:bg-error-container text-error transition-colors">Delete</button>
</div>
</td>
</tr>
<tr className="station-row hover:bg-surface-container-low/60 transition-colors" data-connectors="CCS2 GB/T" data-id="ST-104" data-location="Old Airport Road, Domlur Junction, Bengaluru" data-name="Domlur Station" data-status="inactive">
<td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-outline">#ST-104</td>
<td className="py-space-md px-space-md font-label-md text-label-md font-semibold text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-outline"></span>
                  Domlur Station
                </div>
</td>
<td className="py-space-md px-space-md text-on-surface-variant font-body-sm text-body-sm max-w-[240px] truncate" title="Old Airport Road, Domlur Junction, Bengaluru">
                Old Airport Road, Domlur Junction, Bengaluru
              </td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">GB/T</span>
</div>
</td>
<td className="py-space-md px-space-md font-body-sm text-body-sm text-on-surface">
<span className="font-semibold text-primary">4</span> Total Chargers
              </td>
<td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                ₹50.00/hour
              </td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  Inactive
                </span>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="action-edit px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">Edit</button>
<button className="action-slots px-space-sm py-1 rounded font-label-sm text-label-sm bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold transition-colors">Manage Slots</button>
<button className="action-delete px-space-sm py-1 rounded font-label-sm text-label-sm bg-error-container/40 hover:bg-error-container text-error transition-colors">Delete</button>
</div>
</td>
</tr>
<tr className="station-row hover:bg-surface-container-low/60 transition-colors" data-connectors="CCS2 Type 2 GB/T" data-id="ST-105" data-location="ITPL Main Road, Whitefield, Bengaluru" data-name="Whitefield Station" data-status="active">
<td className="py-space-md px-space-lg font-code-sm text-code-sm font-semibold text-primary">#ST-105</td>
<td className="py-space-md px-space-md font-label-md text-label-md font-semibold text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  Whitefield Station
                </div>
</td>
<td className="py-space-md px-space-md text-on-surface-variant font-body-sm text-body-sm max-w-[240px] truncate" title="ITPL Main Road, Whitefield, Bengaluru">
                ITPL Main Road, Whitefield, Bengaluru
              </td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 flex-wrap">
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">Type 2</span>
<span className="px-2 py-0.5 rounded bg-surface-container-high font-code-sm text-[11px] text-on-surface font-medium">GB/T</span>
</div>
</td>
<td className="py-space-md px-space-md font-body-sm text-body-sm text-on-surface">
<span className="font-semibold text-primary">8</span> Total Chargers
              </td>
<td className="py-space-md px-space-md font-code-sm text-code-sm font-semibold text-on-surface">
                ₹70.00/hour
              </td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  Active
                </span>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="action-edit px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">Edit</button>
<button className="action-slots px-space-sm py-1 rounded font-label-sm text-label-sm bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold transition-colors">Manage Slots</button>
<button className="action-delete px-space-sm py-1 rounded font-label-sm text-label-sm bg-error-container/40 hover:bg-error-container text-error transition-colors">Delete</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="hidden p-space-xl text-center flex-col items-center justify-center gap-space-sm" id="noResultsMsg">
<span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
<p className="font-headline-md text-headline-md text-on-surface">No stations match criteria</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Try refining your search keyword or clearing the status and connector filters.</p>
</div>
<div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant" id="paginationSummary">Showing 1-5 of 5 stations</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-md h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled={true}>
            Previous
          </button>
<button className="w-9 h-9 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
            1
          </button>
<button className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">
            2
          </button>
<button className="px-space-md h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">
            Next
          </button>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<span className="font-headline-md text-headline-md text-on-surface">Regional Hub Map</span>
<span className="font-code-sm text-code-sm text-surface-tint">Bengaluru Central</span>
</div>
<div className="w-full h-48 bg-cover bg-center rounded-lg shadow-inner relative flex items-end p-space-md" data-location="Indiranagar, Bengaluru, India" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdTfGzIQoLPHSYsQJIM7DPPkwULGJMTjWwG9YKOu0r8qVl-cKeHR1RM1oERcsne8cQ0Ee6dEzA-7ciOo2i8CRGDI6920Mw3QCdrIX1Xh30MXXehPr_MerqLBLy7yJPfZ-Kh1YaYS3xh6W6P-7gNux-jMbGvh-dg9D0g3XUqOTaUoWnb65qjgIdJkdTUjpjwCkX50PqYY66LDFOI5rcHB41wVhAIQTQFQRJXjHKfRWDwe90y2S3kUye4A')"}}>
<div className="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-xs rounded font-code-sm text-code-sm text-primary shadow">
            5 Registered Nodes • Zone South-4
          </div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Locations mapped across primary transit corridors: CMH Road, MG Road Junction, 80 Feet Road, Old Airport Road, and ITPL Main Road.
        </p>
</div>
<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<span className="font-headline-md text-headline-md text-on-surface">Connector Distribution</span>
<span className="font-code-sm text-code-sm text-outline">Network Wide</span>
</div>
<div className="flex flex-col gap-space-sm">
<div className="flex flex-col gap-space-xs">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface font-semibold">CCS2 Standard</span>
<span className="text-on-surface-variant font-code-sm">5 Stations (100%)</span>
</div>
<div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-primary w-full"></div>
</div>
</div>
<div className="flex flex-col gap-space-xs">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface font-semibold">Type 2 AC</span>
<span className="text-on-surface-variant font-code-sm">3 Stations (60%)</span>
</div>
<div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-surface-tint w-3/5"></div>
</div>
</div>
<div className="flex flex-col gap-space-xs">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface font-semibold">CHAdeMO DC</span>
<span className="text-on-surface-variant font-code-sm">2 Stations (40%)</span>
</div>
<div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-tertiary-container w-2/5"></div>
</div>
</div>
<div className="flex flex-col gap-space-xs">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface font-semibold">GB/T Standard</span>
<span className="text-on-surface-variant font-code-sm">2 Stations (40%)</span>
</div>
<div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-secondary w-2/5"></div>
</div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<span className="font-headline-md text-headline-md text-on-surface">Administrative Actions</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Routine operations protocol for hub station management and slot allocation.</p>
</div>
<div className="flex flex-col gap-space-sm">
<button className="flex items-center justify-between p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors" id="quickSlotBtn">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary">schedule</span>
<div className="flex flex-col text-left">
<span className="font-label-md text-label-md font-semibold">Global Slot Config</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Update slot timing &amp; standard tariffs</span>
</div>
</div>
<span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
</button>
<button className="flex items-center justify-between p-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors" id="exportCsvBtn">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-surface-tint">download</span>
<div className="flex flex-col text-left">
<span className="font-label-md text-label-md font-semibold">Export Station Registry</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Download 5-node roster in CSV format</span>
</div>
</div>
<span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
<div className="fixed bottom-6 right-6 hidden bg-primary text-on-primary px-space-md py-space-sm rounded-lg shadow-xl font-label-md text-label-md items-center gap-space-xs z-50 transition-all" id="feedbackToast">
<span className="material-symbols-outlined text-[18px]" id="toastIcon">check_circle</span>
<span id="toastMsg">Station updated successfully</span>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
