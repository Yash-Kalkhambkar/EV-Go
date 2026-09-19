import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: Page5,
  head: () => ({
    meta: [
      { title: "Booking Details \u2014 EV GO" },
      { name: "description", content: "View your EV GO charging reservation, pass QR code and payment details." },
      { property: "og:title", content: "Booking Details \u2014 EV GO" },
      { property: "og:description", content: "View your EV GO charging reservation, pass QR code and payment details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page5() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
<header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm" data-path="dashboard" href="#"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></a><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold"><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="my-bookings" href="/bookings">My Bookings</a><a aria-current="page" className="px-space-md py-space-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="dashboard" href="/dashboard">Dashboard</a></nav></div><div className="flex items-center gap-space-md"><div className="hidden sm:flex flex-col text-right"><span className="font-label-md text-label-md text-on-surface font-medium leading-none">Alex Vance</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-space-xs uppercase tracking-wider">Fleet Pilot</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface flex-1"><div className="flex flex-col w-full">
<div className="max-w-7xl mx-auto w-full px-margin md:px-margin-desktop py-space-lg space-y-space-lg">

<div className="flex flex-wrap items-center justify-between gap-space-md">
<a className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface hover:text-primary transition-colors" data-path="my-bookings" href="/bookings">
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
<span>Back to My Bookings</span>
</a>
<div className="flex items-center gap-space-sm">
<span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Booking ID</span>
<span className="font-label-md text-label-md font-semibold text-on-surface">#5001</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="space-y-space-xs">
<div className="flex items-center gap-space-md flex-wrap">
<h1 className="font-headline-xl text-headline-xl text-on-surface">Booking Details</h1>
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wide">
<span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
            Confirmed
          </span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Booking ID: #5001 • Indiranagar Station</p>
</div>
<div className="flex items-center gap-space-sm">
<button className="inline-flex items-center justify-center px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-error-container text-error hover:text-on-error-container font-label-md text-label-md transition-colors" id="triggerModalBtn" type="button">
<span className="material-symbols-outlined text-[18px] mr-1">cancel</span>
          Cancel Booking
        </button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

<div className="lg:col-span-5 space-y-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col items-center text-center">
<div className="w-full flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low px-space-md py-space-xs rounded">
<span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Pass Verification</span>
<span className="font-code-sm text-code-sm text-primary font-semibold">ID #5001</span>
</div>

<div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm my-space-xs">
<svg className="w-48 h-48 sm:w-56 sm:h-56 text-primary" fill="currentColor" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

<path d="M 10 10 H 38 V 38 H 10 Z M 14 14 V 34 H 34 V 14 Z"></path>
<rect height="12" width="12" x="18" y="18"></rect>

<path d="M 62 10 H 90 V 38 H 62 Z M 66 14 V 34 H 86 V 14 Z"></path>
<rect height="12" width="12" x="70" y="18"></rect>

<path d="M 10 62 H 38 V 90 H 10 Z M 14 66 V 86 H 34 V 66 Z"></path>
<rect height="12" width="12" x="18" y="70"></rect>

<rect height="6" width="6" x="42" y="10"></rect>
<rect height="12" width="6" x="52" y="10"></rect>
<rect height="6" width="6" x="42" y="20"></rect>
<rect height="6" width="8" x="46" y="28"></rect>
<rect height="6" width="6" x="10" y="44"></rect>
<rect height="6" width="10" x="20" y="44"></rect>
<rect height="10" width="6" x="34" y="44"></rect>
<rect height="12" width="12" x="44" y="40"></rect>
<rect height="6" width="6" x="60" y="44"></rect>
<rect height="6" width="10" x="70" y="44"></rect>
<rect height="12" width="6" x="84" y="44"></rect>
<rect height="4" width="8" x="10" y="54"></rect>
<rect height="6" width="6" x="22" y="52"></rect>
<rect height="10" width="6" x="42" y="56"></rect>
<rect height="6" width="10" x="52" y="54"></rect>
<rect height="8" width="6" x="66" y="54"></rect>
<rect height="6" width="8" x="76" y="54"></rect>
<rect height="6" width="6" x="42" y="70"></rect>
<rect height="10" width="6" x="52" y="66"></rect>
<rect height="6" width="10" x="62" y="66"></rect>
<rect height="12" width="6" x="76" y="64"></rect>
<rect height="6" width="4" x="86" y="70"></rect>
<rect height="6" width="12" x="42" y="80"></rect>
<rect height="10" width="6" x="58" y="76"></rect>
<rect height="6" width="10" x="68" y="76"></rect>
<rect height="6" width="8" x="82" y="80"></rect>
<rect height="4" width="6" x="46" y="88"></rect>
<rect height="4" width="10" x="56" y="88"></rect>
<rect height="6" width="6" x="70" y="86"></rect>
<rect height="4" width="10" x="80" y="88"></rect>
</svg>
</div>
<p className="font-body-md text-body-md text-on-surface font-medium mt-space-md">Show this QR code at the station</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Present scanner to bay terminal camera upon arrival</p>
<div className="grid grid-cols-2 gap-space-sm w-full mt-space-lg">
<button className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">download</span>
<span>Download QR</span>
</button>
<button className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">share</span>
<span>Share Booking</span>
</button>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-space-md">
<div className="flex items-center gap-space-sm pb-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">badge</span>
<h2 className="font-headline-md text-headline-md text-on-surface">User Details</h2>
</div>
<div className="space-y-space-md">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">User Name</span>
<span className="font-body-lg text-body-lg text-on-surface font-semibold">Alex Morgan</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Email</span>
<span className="font-body-md text-body-md text-on-surface">alex.morgan@example.com</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Phone</span>
<span className="font-body-md text-body-md text-on-surface">+91 98765 43210</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-7 space-y-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-space-md">
<div className="flex items-center justify-between flex-wrap gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">ev_station</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Station Information</h2>
</div>
<span className="px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">1.8 km away</span>
</div>
<div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Indiranagar Station</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Metro Pillar 84, CMH Road, Indiranagar, Bengaluru, KA 560038</p>
</div>

<div className="w-full h-44 rounded-lg bg-surface-container-high relative overflow-hidden flex items-center justify-center" data-location="Metro Pillar 84, CMH Road, Indiranagar, Bengaluru, KA 560038" style={{}}>
<div className="text-center p-space-md bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[24px]">location_on</span>
<div className="text-left">
<span className="block font-label-md text-label-md font-semibold text-on-surface">Indiranagar Station</span>
<span className="block font-body-sm text-body-sm text-on-surface-variant">Metro Pillar 84, CMH Road</span>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-space-md pt-space-xs">
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Total Chargers</span>
<span className="block font-headline-md text-headline-md font-bold text-on-surface mt-0.5">6 Total Chargers</span>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Connector Type</span>
<span className="block font-headline-md text-headline-md font-bold text-primary mt-0.5">CCS2</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-space-md">
<div className="flex items-center justify-between flex-wrap gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">calendar_clock</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Slot Details</h2>
</div>
<span className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">Status: Booked</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Date</span>
<span className="block font-body-lg text-body-lg font-semibold text-on-surface mt-0.5">September 20, 2026</span>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Slot Time</span>
<span className="block font-body-lg text-body-lg font-semibold text-on-surface mt-0.5">02:00 PM - 03:00 PM</span>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Duration</span>
<span className="block font-body-lg text-body-lg font-semibold text-on-surface mt-0.5">1 hour</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm space-y-space-md">
<div className="flex items-center justify-between flex-wrap gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[20px]">payments</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Payment Information</h2>
</div>
<span className="px-space-sm py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">Paid</span>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div>
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Price per hour</span>
<span className="block font-headline-md text-headline-md text-on-surface font-semibold mt-0.5">₹60.00/hour</span>
</div>
<div className="sm:text-right">
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Payment Amount</span>
<span className="block font-metric-display text-metric-display font-bold text-primary">₹60.00</span>
</div>
</div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm px-space-xs">
<span>Transaction ID: <span className="font-code-sm text-code-sm font-semibold text-on-surface">TXN-89231481</span></span>
<span>Status: Confirmed</span>
</div>
</div>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm hidden flex items-center justify-center p-space-md" id="cancellationModal">
<div className="bg-surface-container-lowest max-w-lg w-full rounded-lg shadow-xl p-space-lg space-y-space-md relative">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[24px]">warning</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Cancel Booking</h2>
</div>
<button className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container" id="closeModalCross" type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
        Are you sure you want to cancel reservation #5001? For refunds, contact support.
      </p>
<div className="space-y-space-xs">
<label className="block font-label-sm text-label-sm text-on-surface uppercase" htmlFor="cancelReason">Reason for Cancellation</label>
<select className="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" id="cancelReason">
<option value="Change of plans">Change of plans</option>
<option value="Found another station">Found another station</option>
<option value="Vehicle unavailable">Vehicle unavailable</option>
<option value="Other">Other</option>
</select>
</div>
<div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-space-sm pt-space-sm">
<button className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" id="keepBookingBtn" type="button">
          Keep Booking
        </button>
<button className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-error hover:bg-on-error-container text-on-error font-label-md text-label-md transition-colors" id="confirmCancelBtn" type="button">
          Confirm Cancellation
        </button>
</div>
</div>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-space-xl"><div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">EV GO</span><span className="font-body-sm text-body-sm text-on-surface-variant">— Industrial Transit Power Network</span></div><nav className="flex flex-wrap items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="about" href="#">About</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy</a></nav><div className="font-code-sm text-code-sm text-on-surface-variant">© 2025 EV GO Technical Reserve Ltd.</div></div></footer>
    </div>
  );
}
