import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/stations/new")({
  component: Page7,
  head: () => ({
    meta: [
      { title: "Add Station \u2014 EV GO Admin" },
      { name: "description", content: "Create and configure a new EV charging station location." },
      { property: "og:title", content: "Add Station \u2014 EV GO Admin" },
      { property: "og:description", content: "Create and configure a new EV charging station location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page7() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ai-assistant" href="/assistant">AI Assistant</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">
<div className="max-w-[1280px] w-full mx-auto px-margin-desktop py-space-xl">

<div className="flex flex-col gap-space-sm mb-space-xl">
<div>
<a className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md hover:underline group" data-path="admin-stations" href="/admin/stations">
<span className="material-symbols-outlined text-[1.125rem] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
          Back to Stations
        </a>
</div>
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="flex flex-col">
<span className="font-code-sm text-code-sm uppercase tracking-wider text-on-surface-variant font-semibold">Station Registry / Node Setup</span>
<h1 className="font-headline-lg text-headline-lg text-primary mt-space-xs">Add New Station</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Create and configure a new charging station location</p>
</div>
<div className="flex items-center gap-space-sm bg-surface-container-high px-space-md py-space-xs rounded-lg">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
<span className="font-code-sm text-code-sm text-on-surface font-semibold tracking-tight">STATUS: DRAFT ENTRY</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">

<div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm">
<form className="flex flex-col gap-space-lg" id="stationForm">

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="stationName">
<span>Station Name <span className="text-secondary">*</span></span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Public identifier</span>
</label>
<input className="w-full h-11 px-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg outline-none focus:bg-surface-container-lowest transition-colors" id="stationName" name="stationName" placeholder="e.g. Indiranagar Station" required={true} type="text" />
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="stationAddress">
<span>Address <span className="text-secondary">*</span></span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Navigational target</span>
</label>
<textarea className="w-full p-space-md bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg outline-none focus:bg-surface-container-lowest resize-none transition-colors" id="stationAddress" name="stationAddress" placeholder="Full street address, landmark, city, postal code" required={true} rows={3}></textarea>
</div>

<div className="flex flex-col gap-space-xs">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="latitude">
                  Latitude <span className="text-secondary">*</span>
</label>
<input className="w-full h-11 px-space-md bg-surface-container-low font-code-sm text-body-md text-on-surface rounded-lg outline-none focus:bg-surface-container-lowest transition-colors" id="latitude" name="latitude" placeholder="12.9784" required={true} type="text" defaultValue="12.9784" />
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="longitude">
                  Longitude <span className="text-secondary">*</span>
</label>
<input className="w-full h-11 px-space-md bg-surface-container-low font-code-sm text-body-md text-on-surface rounded-lg outline-none focus:bg-surface-container-lowest transition-colors" id="longitude" name="longitude" placeholder="77.6408" required={true} type="text" defaultValue="77.6408" />
</div>
</div>
<div className="flex items-center justify-between pt-1">
<button className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold hover:underline bg-transparent p-0 cursor-pointer" type="button">
<span className="material-symbols-outlined text-[1.125rem]">my_location</span>
                Pick on Map / Use GPS Coordinates
              </button>
<span className="font-code-sm text-code-sm text-on-surface-variant font-mono" id="coordBadge">12.9784° N, 77.6408° E</span>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="pricePerHour">
                Price per Hour (₹) <span className="text-secondary">*</span>
</label>
<div className="relative flex items-center">
<span className="absolute left-space-md font-headline-md text-headline-md text-on-surface-variant select-none">₹</span>
<input className="w-full h-11 pl-8 pr-space-md bg-surface-container-low font-code-sm text-body-md text-on-surface rounded-lg outline-none focus:bg-surface-container-lowest transition-colors" id="pricePerHour" min="0" name="pricePerHour" placeholder="60.00" required={true} step="0.50" type="number" />
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Billed in standard hourly intervals</span>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="totalChargers">
                Total Chargers <span className="text-secondary">*</span>
</label>
<input className="w-full h-11 px-space-md bg-surface-container-low font-code-sm text-body-md text-on-surface rounded-lg outline-none focus:bg-surface-container-lowest transition-colors" id="totalChargers" max="50" min="1" name="totalChargers" placeholder="6" required={true} type="number" />
<span className="font-code-sm text-code-sm text-on-surface-variant">Allocated physical charging bays</span>
</div>
</div>

<div className="flex flex-col gap-space-sm pt-space-xs">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-semibold">
                Connector Types <span className="text-secondary">*</span>
</label>
<span className="font-code-sm text-code-sm text-on-surface-variant">Select at least one</span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">

<label className="cursor-pointer group flex flex-col justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-all">
<div className="flex items-center justify-between w-full">
<span className="material-symbols-outlined text-primary text-[1.5rem]">ev_charger</span>
<input defaultChecked={true} className="w-4 h-4 rounded accent-primary cursor-pointer" id="connCCS2" name="connectors" type="checkbox" defaultValue="CCS2" />
</div>
<div className="mt-space-md">
<span className="font-label-md text-label-md font-bold text-on-surface block">CCS2</span>
<span className="font-code-sm text-code-sm text-on-surface-variant block mt-0.5">DC Standard</span>
</div>
</label>

<label className="cursor-pointer group flex flex-col justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-all">
<div className="flex items-center justify-between w-full">
<span className="material-symbols-outlined text-primary text-[1.5rem]">electrical_services</span>
<input defaultChecked={true} className="w-4 h-4 rounded accent-primary cursor-pointer" id="connType2" name="connectors" type="checkbox" defaultValue="Type 2" />
</div>
<div className="mt-space-md">
<span className="font-label-md text-label-md font-bold text-on-surface block">Type 2</span>
<span className="font-code-sm text-code-sm text-on-surface-variant block mt-0.5">AC Mennekes</span>
</div>
</label>

<label className="cursor-pointer group flex flex-col justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-all">
<div className="flex items-center justify-between w-full">
<span className="material-symbols-outlined text-on-surface-variant text-[1.5rem]">power</span>
<input className="w-4 h-4 rounded accent-primary cursor-pointer" id="connCHAdeMO" name="connectors" type="checkbox" defaultValue="CHAdeMO" />
</div>
<div className="mt-space-md">
<span className="font-label-md text-label-md font-bold text-on-surface block">CHAdeMO</span>
<span className="font-code-sm text-code-sm text-on-surface-variant block mt-0.5">DC High Load</span>
</div>
</label>

<label className="cursor-pointer group flex flex-col justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-all">
<div className="flex items-center justify-between w-full">
<span className="material-symbols-outlined text-on-surface-variant text-[1.5rem]">outlet</span>
<input className="w-4 h-4 rounded accent-primary cursor-pointer" id="connGBT" name="connectors" type="checkbox" defaultValue="GB/T" />
</div>
<div className="mt-space-md">
<span className="font-label-md text-label-md font-bold text-on-surface block">GB/T</span>
<span className="font-code-sm text-code-sm text-on-surface-variant block mt-0.5">DC Direct</span>
</div>
</label>
</div>
</div>

<div className="bg-surface-container-low p-space-md rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-md">
<div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span className="material-symbols-outlined">power_settings_new</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold text-on-surface">Station Active</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Active and open for public vehicle bookings</span>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked={true} className="sr-only peer" id="stationActiveToggle" type="checkbox" />
<div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>

<div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-space-md pt-space-md">
<a className="w-full sm:w-auto px-space-xl h-11 flex items-center justify-center rounded-lg bg-surface-container font-label-md text-label-md font-semibold text-on-surface hover:bg-surface-container-high transition-colors" data-path="admin-stations" href="#">
              Cancel
            </a>
<button className="w-full sm:w-auto px-space-xl h-11 flex items-center justify-center gap-space-xs rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer" type="submit">
<span className="material-symbols-outlined text-[1.125rem]">save</span>
              Save Station
            </button>
</div>
</form>
</div>

<div className="lg:col-span-5 flex flex-col gap-space-lg">

<div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[1.25rem]">pin_drop</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Location Pin Preview</h2>
</div>
<span className="font-code-sm text-code-sm px-space-xs py-0.5 bg-surface-container-high text-on-surface font-semibold rounded">GEO-TARGET</span>
</div>

<div className="relative w-full h-64 rounded-lg overflow-hidden bg-surface-container">
<div className="w-full h-full bg-cover bg-center" data-location="Indiranagar, Bangalore, Karnataka, India" id="mapLocationContainer" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdTfGzIQoLPHSYsQJIM7DPPkwULGJMTjWwG9YKOu0r8qVl-cKeHR1RM1oERcsne8cQ0Ee6dEzA-7ciOo2i8CRGDI6920Mw3QCdrIX1Xh30MXXehPr_MerqLBLy7yJPfZ-Kh1YaYS3xh6W6P-7gNux-jMbGvh-dg9D0g3XUqOTaUoWnb65qjgIdJkdTUjpjwCkX50PqYY66LDFOI5rcHB41wVhAIQTQFQRJXjHKfRWDwe90y2S3kUye4A')"}}></div>

<div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
<div className="flex items-center gap-1.5 bg-inverse-surface/90 text-inverse-on-surface px-space-md py-1.5 rounded shadow-lg backdrop-blur-sm -translate-y-4">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span className="font-label-md text-label-md font-bold tracking-tight" id="mapPinTitle">Indiranagar Station</span>
</div>
<div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md">
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></div>
</div>
<div className="w-0.5 h-3 bg-primary"></div>
</div>

<div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/95 backdrop-blur px-space-sm py-1 rounded flex items-center justify-between text-on-surface">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-primary text-[0.875rem]">radar</span>
<span className="font-code-sm text-code-sm font-semibold" id="mapCoordinateTelemetry">12.9784, 77.6408</span>
</div>
<span className="font-code-sm text-code-sm text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded" id="activeStatusPill">ACTIVE</span>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[1rem] text-on-surface-variant shrink-0 mt-0.5">info</span>
<span>Drag pin or enter exact latitude &amp; longitude coordinates. Station radius relies on exact point data for distance matching.</span>
</p>
</div>

<div className="bg-surface-container-low rounded-lg p-space-lg">
<span className="font-code-sm text-code-sm uppercase tracking-wider text-on-surface-variant font-bold block mb-space-sm">Configuration Summary</span>
<div className="grid grid-cols-2 gap-space-sm">
<div className="bg-surface-container-lowest p-space-sm rounded">
<span className="font-code-sm text-code-sm text-on-surface-variant block">Price / Hour</span>
<span className="font-headline-md text-headline-md text-primary font-bold" id="summaryPrice">₹60.00</span>
</div>
<div className="bg-surface-container-lowest p-space-sm rounded">
<span className="font-code-sm text-code-sm text-on-surface-variant block">Total Bays</span>
<span className="font-headline-md text-headline-md text-on-surface font-bold" id="summaryBays">6 Chargers</span>
</div>
<div className="col-span-2 bg-surface-container-lowest p-space-sm rounded">
<span className="font-code-sm text-code-sm text-on-surface-variant block">Supported Plugs</span>
<div className="flex flex-wrap gap-1 mt-1" id="summaryConnectors">
<span className="font-code-sm text-code-sm px-2 py-0.5 bg-surface-container-high rounded text-on-surface font-semibold">CCS2</span>
<span className="font-code-sm text-code-sm px-2 py-0.5 bg-surface-container-high rounded text-on-surface font-semibold">Type 2</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[1.25rem]">fact_check</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Required Information</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Ensure the station meets all infrastructure network validation parameters before committing to the live registry.
          </p>
<ul className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface">
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-on-surface-variant text-[1.125rem] shrink-0 mt-0.5" id="chkNameIcon">check_circle</span>
<span className="text-on-surface-variant" id="chkNameText">Valid station name and physical street address</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[1.125rem] shrink-0 mt-0.5" id="chkCoordsIcon">check_circle</span>
<span className="font-semibold text-on-surface" id="chkCoordsText">Geo-coordinates for distance calculation</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-on-surface-variant text-[1.125rem] shrink-0 mt-0.5" id="chkPriceIcon">check_circle</span>
<span className="text-on-surface-variant" id="chkPriceText">Hourly pricing in ₹</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[1.125rem] shrink-0 mt-0.5" id="chkConnIcon">check_circle</span>
<span className="font-semibold text-on-surface" id="chkConnText">At least one supported connector type</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-on-surface-variant text-[1.125rem] shrink-0 mt-0.5" id="chkChargersIcon">check_circle</span>
<span className="text-on-surface-variant" id="chkChargersText">Defined total charger capacity</span>
</li>
</ul>
</div>
</div>
</div>

<div className="fixed bottom-6 right-6 hidden bg-primary text-on-primary px-space-lg py-space-md rounded-lg shadow-xl items-center gap-space-md z-50 transition-transform" id="saveToast">
<span className="material-symbols-outlined text-[1.5rem] text-primary-fixed">check_circle</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md font-bold">Station Published</span>
<span className="font-body-sm text-body-sm text-inverse-primary">New location registered and operational.</span>
</div>
</div>
</div>
</div>
</main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
