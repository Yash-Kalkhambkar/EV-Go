import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stations/$stationId")({
  component: Page12,
  head: () => ({
    meta: [
      { title: "Station Details \u2014 EV GO" },
      { name: "description", content: "Station details, connector types and hourly slot availability for booking." },
      { property: "og:title", content: "Station Details \u2014 EV GO" },
      { property: "og:description", content: "Station details, connector types and hourly slot availability for booking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page12() {
  return (
    <div className="bg-surface-ground font-sans text-text-main antialiased min-h-screen flex flex-col">


<header className="w-full bg-surface-card border-b border-border-ui sticky top-0 z-40">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<div className="flex items-center gap-6">
<a className="flex items-center gap-2 font-heading font-bold text-xl text-primary tracking-tight" href="#">
<span className="material-symbols-outlined text-[26px]">ev_station</span>
<span>EV GO</span>
</a>
</div>
<div className="flex items-center gap-3">
<a className="text-sm font-medium text-text-muted hover:text-text-main px-3 py-2" href="/stations">Back to Search Results</a>
</div>
</div>
</header>
<main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">

<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
<a className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors" href="/stations">
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
<span>Back to Search Results</span>
</a>
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-card border border-border-ui text-text-main hover:bg-surface-muted text-sm font-medium transition-colors shadow-sm" id="openShareModalBtn" type="button">
<span className="material-symbols-outlined text-[18px]">share</span>
<span>Share</span>
</button>
</div>

<section className="bg-surface-card border border-border-ui rounded p-6 mb-6 shadow-sm">
<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
<div>
<h1 className="font-heading text-2xl font-bold text-text-main tracking-tight" id="stationName">Indiranagar Metro Hub</h1>
<p className="text-sm text-text-muted mt-1" id="stationAddress">Metro Pillar 84, CMH Road, Indiranagar, Bengaluru, KA 560038</p>
<div className="flex items-center gap-3 mt-3 text-sm text-text-muted">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-text-muted">near_me</span>
<span>1.8 km</span>
</span>
<span className="text-border-ui">•</span>
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-text-muted">ev_charger</span>
<span>6 Total Chargers</span>
</span>
</div>
</div>
<div className="bg-surface-muted px-4 py-3 rounded text-left md:text-right border border-border-ui">
<span className="block text-xs uppercase tracking-wider text-text-muted font-semibold">Price</span>
<span className="font-heading text-2xl font-bold text-primary">₹60.00<span className="text-sm font-normal text-text-muted">/hour</span></span>
</div>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<div className="lg:col-span-4 flex flex-col gap-6">

<section className="bg-surface-card border border-border-ui rounded p-5 shadow-sm">
<h2 className="font-heading text-base font-bold text-text-main mb-3">Connector Types</h2>
<ul className="space-y-2.5">
<li className="flex items-center justify-between p-3 rounded bg-surface-ground border border-border-ui">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
<span className="text-sm font-semibold text-text-main">CCS2</span>
</div>
</li>
<li className="flex items-center justify-between p-3 rounded bg-surface-ground border border-border-ui">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">electrical_services</span>
<span className="text-sm font-semibold text-text-main">Type 2</span>
</div>
</li>
<li className="flex items-center justify-between p-3 rounded bg-surface-ground border border-border-ui">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">power</span>
<span className="text-sm font-semibold text-text-main">CHAdeMO</span>
</div>
</li>
<li className="flex items-center justify-between p-3 rounded bg-surface-ground border border-border-ui">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-[20px]">electric_bolt</span>
<span className="text-sm font-semibold text-text-main">GB/T</span>
</div>
</li>
</ul>
</section>

<section className="bg-surface-card border border-border-ui rounded p-5 shadow-sm">
<h2 className="font-heading text-base font-bold text-text-main mb-3">Location</h2>
<div className="w-full h-48 rounded bg-surface-ground border border-border-ui relative overflow-hidden flex items-center justify-center">

<div className="absolute inset-0 bg-[#E8EDE9] opacity-70"></div>

<svg className="absolute inset-0 w-full h-full text-border-ui stroke-current" height="100%" width="100%">
<defs>
<pattern height="32" id="grid" patternUnits="userSpaceOnUse" width="32">
<path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
</pattern>
</defs>
<rect fill="url(#grid)" height="100%" width="100%"></rect>
</svg>

<div className="relative z-10 flex flex-col items-center">
<span className="material-symbols-outlined text-primary text-[36px] drop-shadow-sm">location_on</span>
<span className="text-[11px] font-semibold bg-primary text-white px-2 py-0.5 rounded shadow">Station Location</span>
</div>
</div>
<p className="text-xs text-text-muted mt-3">Metro Pillar 84, CMH Road, Indiranagar, Bengaluru, KA 560038</p>
</section>
</div>

<div className="lg:col-span-8 flex flex-col gap-6">

<section className="bg-surface-card border border-border-ui rounded p-5 shadow-sm">
<h2 className="font-heading text-base font-bold text-text-main mb-3">Select Date</h2>
<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2" id="datePicker">

<button className="date-tab active flex flex-col items-center justify-center py-3 px-2 rounded border border-primary bg-primary text-white transition-all text-center" type="button">
<span className="text-xs font-semibold opacity-90 uppercase">Today</span>
<span className="font-heading text-lg font-bold mt-0.5">20</span>
<span className="text-xs">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Sat</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">21</span>
<span className="text-xs text-text-muted">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Sun</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">22</span>
<span className="text-xs text-text-muted">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Mon</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">23</span>
<span className="text-xs text-text-muted">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Tue</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">24</span>
<span className="text-xs text-text-muted">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Wed</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">25</span>
<span className="text-xs text-text-muted">Sep</span>
</button>

<button className="date-tab flex flex-col items-center justify-center py-3 px-2 rounded border border-border-ui bg-surface-card hover:bg-surface-muted transition-all text-center" type="button">
<span className="text-xs font-medium text-text-muted uppercase">Thu</span>
<span className="font-heading text-lg font-bold mt-0.5 text-text-main">26</span>
<span className="text-xs text-text-muted">Sep</span>
</button>
</div>
</section>

<section className="bg-surface-card border border-border-ui rounded p-5 shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-border-ui gap-2">
<h2 className="font-heading text-base font-bold text-text-main">Time Slots</h2>

<div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]"></span> Available</span>
<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C4A747]"></span> Reserved</span>
<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span> Booked</span>
<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]"></span> Unavailable</span>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" id="slotContainer">

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-70 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">06:00 - 07:00</span>
<span className="w-2 h-2 rounded-full bg-[#6B7280]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold">Unavailable</span>
<span>₹60/hour</span>
</div>
</div>

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-80 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">07:00 - 08:00</span>
<span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-text-muted">Booked</span>
<span>₹60/hour</span>
</div>
</div>

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-80 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">08:00 - 09:00</span>
<span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-text-muted">Booked</span>
<span>₹60/hour</span>
</div>
</div>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="09:00 - 10:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">09:00 - 10:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="10:00 - 11:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">10:00 - 11:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<div className="p-3 rounded border border-[#C4A747]/40 bg-[#FFFDF5] text-text-main flex flex-col justify-between h-20">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold">11:00 - 12:00</span>
<span className="w-2 h-2 rounded-full bg-[#C4A747]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#C4A747]">Reserved</span>
<span className="text-text-muted">₹60/hour</span>
</div>
</div>

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-80 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">12:00 - 13:00</span>
<span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-text-muted">Booked</span>
<span>₹60/hour</span>
</div>
</div>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="13:00 - 14:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">13:00 - 14:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<button className="slot-item-slot text-left p-3 rounded border-2 border-primary bg-primary text-white flex flex-col justify-between h-20 shadow-sm" data-price="₹60/hour" data-time="14:00 - 15:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-bold">14:00 - 15:00</span>
<span className="material-symbols-outlined text-[16px] text-white">check_circle</span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-white">Available</span>
<span className="font-medium text-white">₹60/hour</span>
</div>
</button>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="15:00 - 16:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">15:00 - 16:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="16:00 - 17:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">16:00 - 17:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-80 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">17:00 - 18:00</span>
<span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-text-muted">Booked</span>
<span>₹60/hour</span>
</div>
</div>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="18:00 - 19:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">18:00 - 19:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="19:00 - 20:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">19:00 - 20:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<button className="slot-item text-left p-3 rounded border border-border-ui bg-surface-card hover:border-primary transition-all flex flex-col justify-between h-20 shadow-xs" data-price="₹60/hour" data-time="20:00 - 21:00" type="button">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-text-main">20:00 - 21:00</span>
<span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold text-[#1B4D3E]">Available</span>
<span className="font-medium text-text-main">₹60/hour</span>
</div>
</button>

<div className="p-3 rounded border border-border-ui bg-surface-ground text-text-muted flex flex-col justify-between h-20 opacity-70 cursor-not-allowed">
<div className="flex items-center justify-between">
<span className="text-xs font-medium">21:00 - 22:00</span>
<span className="w-2 h-2 rounded-full bg-[#6B7280]"></span>
</div>
<div className="flex items-center justify-between text-xs">
<span className="font-semibold">Unavailable</span>
<span>₹60/hour</span>
</div>
</div>
</div>
</section>
</div>
</div>
</main>

<aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-border-ui py-3 px-4 sm:px-6 lg:px-8 shadow-md">
<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
<div className="flex items-center gap-3 w-full sm:w-auto">
<span className="material-symbols-outlined text-primary text-[28px]">schedule</span>
<div>
<div className="text-xs text-text-muted uppercase font-semibold">Selected Slot</div>
<div className="text-sm font-semibold text-text-main" id="selectedSlotSummary">
            14:00 - 15:00 • ₹60/hour
          </div>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
<div className="text-left sm:text-right">
<span className="text-xs text-text-muted uppercase block font-medium">Price</span>
<span className="font-heading text-xl font-bold text-text-main" id="dockPrice">₹60.00</span>
</div>
<button className="px-6 py-2.5 rounded bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow transition-colors flex items-center gap-2" id="bookSlotBtn" type="button">
<span>Book This Slot</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</aside>

<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 hidden" id="shareModal">
<div className="bg-surface-card border border-border-ui rounded max-w-sm w-full p-5 shadow-xl flex flex-col gap-4">
<div className="flex items-center justify-between">
<h3 className="font-heading text-lg font-bold text-text-main">Share Station</h3>
<button className="w-8 h-8 rounded flex items-center justify-center text-text-muted hover:bg-surface-muted transition-colors" id="closeShareModalBtn" type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>

<div>
<label className="block text-xs font-semibold text-text-muted uppercase mb-1">Station URL</label>
<div className="flex items-center gap-2">
<input className="flex-1 bg-surface-ground border border-border-ui rounded px-3 py-1.5 text-sm font-mono text-text-main select-all focus:outline-none" id="shortUrlInput" readOnly={true} type="text" defaultValue="evgo.in/s/101" />
<button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary-hover transition-colors flex items-center gap-1" id="copyLinkBtn" type="button">
<span className="material-symbols-outlined text-[14px]">content_copy</span>
<span id="copyBtnLabel">Copy Link</span>
</button>
</div>
</div>

<div className="flex flex-col items-center justify-center p-4 bg-surface-ground border border-border-ui rounded">
<div className="w-36 h-36 bg-surface-card border border-border-ui p-2 rounded flex items-center justify-center">
<svg className="w-full h-full text-text-main" fill="currentColor" viewBox="0 0 100 100">
<rect fill="none" height="28" rx="1" stroke="currentColor" strokeWidth="5" width="28" x="5" y="5"></rect>
<rect height="12" width="12" x="13" y="13"></rect>
<rect fill="none" height="28" rx="1" stroke="currentColor" strokeWidth="5" width="28" x="67" y="5"></rect>
<rect height="12" width="12" x="75" y="13"></rect>
<rect fill="none" height="28" rx="1" stroke="currentColor" strokeWidth="5" width="28" x="5" y="67"></rect>
<rect height="12" width="12" x="13" y="75"></rect>
<rect height="6" width="16" x="42" y="8"></rect>
<rect height="18" width="8" x="46" y="20"></rect>
<rect height="6" width="25" x="8" y="42"></rect>
<rect height="16" width="16" x="42" y="42"></rect>
<rect height="6" width="25" x="67" y="42"></rect>
<rect height="25" width="6" x="42" y="67"></rect>
<rect height="8" width="18" x="56" y="67"></rect>
<rect height="25" width="10" x="82" y="67"></rect>
<rect height="10" width="18" x="56" y="82"></rect>
</svg>
</div>
</div>

<div className="flex items-center justify-end gap-2 pt-1">
<button className="w-full py-2 bg-surface-muted hover:bg-border-ui text-text-main text-xs font-semibold rounded border border-border-ui flex items-center justify-center gap-1.5 transition-colors" id="downloadQrBtn" type="button">
<span className="material-symbols-outlined text-[16px]">download</span>
<span>Download QR</span>
</button>
</div>
</div>
</div>


    </div>
  );
}
