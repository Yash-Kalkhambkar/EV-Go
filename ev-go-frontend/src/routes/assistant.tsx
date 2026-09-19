import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/assistant")({
  component: Page8,
  head: () => ({
    meta: [
      { title: "AI Assistant \u2014 EV GO" },
      { name: "description", content: "Ask anything about EV charging reservations, stations and pricing." },
      { property: "og:title", content: "AI Assistant \u2014 EV GO" },
      { property: "og:description", content: "Ask anything about EV charging reservations, stations and pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page8() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="ai-assistant" href="/assistant">AI Assistant</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">
<div className="max-w-[1280px] w-full mx-auto px-margin-desktop py-space-lg flex flex-col gap-space-lg">

<section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs mb-1">
<span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
<span className="font-code-sm text-code-sm text-primary uppercase tracking-wider font-semibold">Autonomous Dispatch Protocol</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">AI Assistant</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Ask me anything about EV charging reservations, stations, and pricing</p>
</div>
<div className="flex items-center gap-space-sm self-start sm:self-auto">
<button className="h-10 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors" id="reset-conversation-btn" type="button">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
<span>New Conversation</span>
</button>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

<section className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden min-h-[640px] flex-1">

<div className="px-space-lg py-space-sm bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">EV GO Central Node</span>
<span className="font-code-sm text-code-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant ml-2">ID: ENG-412</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Online &amp; Synced</span>
</div>
</div>

<div className="flex-1 p-space-lg overflow-y-auto space-y-space-lg max-h-[500px]" id="chat-stream">

<div className="flex flex-col items-end gap-1">
<div className="flex items-end gap-space-xs max-w-[85%] sm:max-w-[70%]">
<div className="bg-primary-container text-on-primary p-space-md rounded-xl rounded-br-none shadow-sm">
<p className="font-body-md text-body-md text-on-primary">Find available charging stations near Indiranagar</p>
</div>
</div>
<div className="flex items-center gap-1 mr-1">
<span className="font-code-sm text-code-sm text-on-surface-variant">10:14 AM</span>
<span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
</div>
</div>

<div className="flex flex-col items-start gap-1">
<div className="flex items-start gap-space-sm max-w-[92%] sm:max-w-[85%]">
<div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
<span className="material-symbols-outlined text-[18px]">bolt</span>
</div>
<div className="flex flex-col gap-space-xs bg-surface-container-low text-on-surface p-space-md rounded-xl rounded-tl-none shadow-sm">
<p className="font-body-md text-body-md text-on-surface">
                  Found <strong className="text-primary font-semibold">Indiranagar Station</strong> 1.8 km away on CMH Road with CCS2 and Type 2 chargers. Price is ₹60/hour. Next available slot is today at 02:00 PM - 03:00 PM.
                </p>

<div className="mt-space-xs p-space-sm bg-surface-container-lowest rounded-lg shadow-sm flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-primary font-bold">Indiranagar Station</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">1.8 km</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">CMH Road</p>
<div className="flex flex-wrap gap-space-xs my-1">
<span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm">CCS2</span>
<span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-code-sm">Type 2</span>
</div>
<div className="flex items-center justify-between pt-1">
<span className="font-label-md text-label-md text-secondary font-bold">₹60/hour</span>
<span className="font-code-sm text-code-sm text-primary font-medium">Slot: 02:00 PM - 03:00 PM</span>
</div>
</div>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant ml-10">10:14 AM</span>
</div>

<div className="flex flex-col items-end gap-1">
<div className="flex items-end gap-space-xs max-w-[85%] sm:max-w-[70%]">
<div className="bg-primary-container text-on-primary p-space-md rounded-xl rounded-br-none shadow-sm">
<p className="font-body-md text-body-md text-on-primary">Can you check my upcoming bookings?</p>
</div>
</div>
<div className="flex items-center gap-1 mr-1">
<span className="font-code-sm text-code-sm text-on-surface-variant">10:16 AM</span>
<span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
</div>
</div>

<div className="flex flex-col items-start gap-1">
<div className="flex items-start gap-space-sm max-w-[92%] sm:max-w-[85%]">
<div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
<span className="material-symbols-outlined text-[18px]">bolt</span>
</div>
<div className="flex flex-col gap-space-xs bg-surface-container-low text-on-surface p-space-md rounded-xl rounded-tl-none shadow-sm">
<p className="font-body-md text-body-md text-on-surface">
                  You have 1 upcoming booking: Indiranagar Station, Booking ID #5001 on Sep 20 from 02:00 PM - 03:00 PM (CCS2, Status: Confirmed, Amount: ₹60.00).
                </p>

<div className="mt-space-xs p-space-sm bg-surface-container-lowest rounded-lg shadow-sm flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Booking ID #5001</span>
<span className="px-space-xs py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm">Confirmed</span>
</div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex flex-col gap-0.5">
<span>Indiranagar Station • Sep 20</span>
<span>Time: 02:00 PM - 03:00 PM</span>
<span>Connector: CCS2</span>
</div>
<div className="pt-1 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant">Total Amount</span>
<span className="font-headline-md text-headline-md text-primary font-bold">₹60.00</span>
</div>
</div>
</div>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant ml-10">10:16 AM</span>
</div>
</div>

<div className="px-space-lg pt-space-xs pb-space-sm bg-surface-container-lowest">
<div className="flex items-center gap-space-xs overflow-x-auto pb-1">
<button className="quick-prompt shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors flex items-center gap-1" data-prompt="Find nearby stations" type="button">
<span className="material-symbols-outlined text-[16px]">near_me</span>
<span>Find nearby stations</span>
</button>
<button className="quick-prompt shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors flex items-center gap-1" data-prompt="Check my bookings" type="button">
<span className="material-symbols-outlined text-[16px]">calendar_month</span>
<span>Check my bookings</span>
</button>
<button className="quick-prompt shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors flex items-center gap-1" data-prompt="Help with payment" type="button">
<span className="material-symbols-outlined text-[16px]">payments</span>
<span>Help with payment</span>
</button>
<button className="quick-prompt shrink-0 px-space-md py-space-xs rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm transition-colors flex items-center gap-1" data-prompt="Report an issue" type="button">
<span className="material-symbols-outlined text-[16px]">report_problem</span>
<span>Report an issue</span>
</button>
</div>
</div>

<div className="p-space-lg bg-surface-container-low">
<form className="flex items-center gap-space-sm" id="chat-form">
<div className="relative flex-1">
<input autoComplete="off" className="w-full h-12 pl-space-md pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest shadow-sm" id="chat-input" placeholder="Ask me anything..." type="text" />
<button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface hidden" id="clear-input-btn" type="button">
<span className="material-symbols-outlined text-[18px]">cancel</span>
</button>
</div>
<button className="h-12 w-12 rounded-lg bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center shrink-0 transition-colors shadow-sm" id="send-button" type="submit">
<span className="material-symbols-outlined text-[20px]">send</span>
</button>
</form>
<div className="mt-2 flex items-center justify-between px-1">
<span className="font-code-sm text-code-sm text-on-surface-variant">Press Enter to dispatch query</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">EV GO Protocol v2.4</span>
</div>
</div>
</section>

<aside className="lg:col-span-4 flex flex-col gap-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[22px]">verified</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Assistant Capabilities</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Authorized telemetry model restricted strictly to the operational verified data dictionary:
          </p>
<ul className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface">
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">location_on</span>
<span>Locate charging stations by name and distance</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">ev_station</span>
<span>View hourly price and connector types (CCS2, CHAdeMO, Type 2, GB/T)</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">schedule</span>
<span>Check slot times and availability status</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">receipt_long</span>
<span>Look up booking ID, status, and payment amount</span>
</li>
</ul>
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Valid Station Status Codes:</span>
<div className="flex flex-wrap gap-space-xs">
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-primary-fixed text-on-primary-fixed">Available</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-tertiary-fixed text-on-tertiary-fixed">Reserved</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-surface-container-high text-on-surface-variant">Booked</span>
<span className="px-space-xs py-0.5 rounded font-code-sm text-code-sm bg-secondary-fixed text-on-secondary-fixed">Unavailable</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[22px]">badge</span>
<h2 className="font-headline-md text-headline-md text-on-surface font-bold">Active User</h2>
</div>
<span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">Active Session</span>
</div>
<div className="flex items-center gap-space-md p-space-sm bg-surface-container-low rounded-lg">
<div className="w-12 h-12 rounded-full bg-primary text-on-primary font-headline-md text-headline-md flex items-center justify-center font-bold shrink-0">
              AM
            </div>
<div className="flex flex-col min-w-0">
<span className="font-label-md text-label-md text-on-surface font-bold truncate">Alex Morgan</span>
<span className="font-code-sm text-code-sm text-on-surface-variant truncate">alex.morgan@example.com</span>
<span className="font-code-sm text-code-sm text-on-surface font-medium mt-0.5">+91 98765 43210</span>
</div>
</div>
<div className="space-y-space-xs pt-1">
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Active Reservations</span>
<span className="font-semibold text-primary">1 Booking</span>
</div>
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Default Connector Preference</span>
<span className="font-semibold text-on-surface">CCS2</span>
</div>
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Primary Hub</span>
<span className="font-semibold text-on-surface">Indiranagar Station</span>
</div>
</div>
</div>

<div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">hub</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface font-semibold">Live Hub Gateway</span>
<span className="font-code-sm text-code-sm text-on-surface-variant">Response latency &lt; 85ms</span>
</div>
</div>
<span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
</div>
</aside>
</div>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
