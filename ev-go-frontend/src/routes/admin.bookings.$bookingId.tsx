import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookings/$bookingId")({
  component: Page15,
  head: () => ({
    meta: [
      { title: "Booking Record \u2014 EV GO Admin" },
      { name: "description", content: "Full administrative record for a customer charging reservation." },
      { property: "og:title", content: "Booking Record \u2014 EV GO Admin" },
      { property: "og:description", content: "Full administrative record for a customer charging reservation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page15() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
<header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></div><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold rounded-lg"><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="my-bookings" href="/bookings">My Bookings</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="ai-assistant" href="/assistant">AI Assistant</a><a aria-current="page" className="px-space-md py-space-xs transition-colors bg-primary-container text-on-primary font-semibold rounded-lg" data-path="admin-stations" href="/admin/stations">Admin Stations</a><a className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="admin-bookings" href="/admin/bookings">Admin Bookings</a></nav><div className="flex items-center gap-space-md shrink-0"><div className="hidden sm:flex flex-col text-right leading-tight"><span className="font-label-md text-label-md text-on-surface font-semibold">Alex Morgan</span><span className="font-code-sm text-code-sm text-on-surface-variant">alex.morgan@example.com</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-label-sm text-label-sm text-on-primary font-bold shadow-sm ring-2 ring-primary-fixed">AM</div></div></div></header><main className="w-full flex-1 pt-16 bg-surface"><div className="flex flex-col w-full">

<div className="max-w-[1280px] w-full mx-auto px-margin md:px-margin-desktop py-space-lg flex flex-col gap-space-lg">

<div className="flex items-center justify-between gap-space-md">
<a className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:text-primary-container transition-colors font-medium" data-path="admin-bookings" href="/admin/bookings">
<span className="material-symbols-outlined text-label-md">arrow_back</span>
        Back to All Bookings
      </a>
<div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
<span>Admin Console</span>
<span>/</span>
<span>Bookings</span>
<span>/</span>
<span className="text-on-surface font-semibold">#5001</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
<div className="flex flex-wrap items-center gap-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-[28px]">confirmation_number</span>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Booking #5001</h1>
</div>
<div className="flex flex-wrap items-center gap-space-xs">

<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-primary"></span>
            Confirmed
          </span>

<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
<span className="w-2 h-2 rounded-full bg-primary"></span>
            Paid
          </span>
</div>
</div>

<div className="flex items-center gap-space-sm">
<button className="inline-flex items-center justify-center gap-space-xs px-space-md py-2.5 rounded-lg bg-error/10 hover:bg-error/15 text-error font-label-md text-label-md font-semibold transition-colors" id="triggerCancelModal" type="button">
<span className="material-symbols-outlined text-[18px]">cancel</span>
          Cancel Booking
        </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg items-start">

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined">person</span>
<h2 className="font-headline-md text-headline-md text-on-surface">User Information</h2>
</div>
<span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Customer</span>
</div>
<div className="flex flex-col gap-space-sm">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Full Name</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Alex Morgan</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Email Address</span>
<a className="font-body-md text-body-md text-primary hover:underline" href="#">alex.morgan@example.com</a>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Phone Number</span>
<span className="font-body-md text-body-md text-on-surface font-medium">+91 98765 43210</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Role Profile</span>
<span className="font-body-md text-body-md text-on-surface">Driver / Customer</span>
</div>
<div className="pt-space-xs flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<span className="font-label-sm text-label-sm text-on-surface-variant">Active Reservations</span>
<span className="font-label-md text-label-md font-bold text-primary">1 active reservation</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined">ev_station</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Station Information</h2>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">1.8 km away</span>
</div>
<div className="flex flex-col gap-space-sm">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Station Name</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Indiranagar Station</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Physical Address</span>
<span className="font-body-sm text-body-sm text-on-surface leading-snug">Metro Pillar 84, CMH Road, Indiranagar, Bengaluru, KA 560038</span>
</div>
<div className="grid grid-cols-2 gap-space-sm pt-space-xs">
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Total Chargers</span>
<span className="font-headline-md text-headline-md font-bold text-on-surface">6</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Price per Hour</span>
<span className="font-headline-md text-headline-md font-bold text-primary">₹60.00</span>
</div>
</div>
<div className="flex flex-col gap-1.5 pt-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant">Supported Connectors</span>
<div className="flex flex-wrap gap-1.5">
<span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-code-sm text-code-sm font-semibold">CCS2</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code-sm text-code-sm font-semibold">Type 2</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined">schedule</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Slot Details</h2>
</div>
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Booked
          </span>
</div>
<div className="flex flex-col gap-space-sm">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Scheduled Date</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">September 20, 2026</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant">Slot Time</span>
<span className="font-headline-md text-headline-md font-bold text-primary">02:00 PM - 03:00 PM</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Duration: 1 hour</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Connector Type Allocated</span>
<div className="flex items-center gap-space-xs mt-0.5">
<span className="material-symbols-outlined text-primary text-[20px]">electric_bolt</span>
<span className="font-body-md text-body-md font-bold text-on-surface">CCS2</span>
</div>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Current Slot State</span>
<span className="font-body-sm text-body-sm text-on-surface font-medium">Status verified as Booked in station schedule</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md lg:col-span-2">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined">receipt_long</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Payment Details</h2>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant">Gateway: Razorpay</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant">Total Amount</span>
<span className="font-headline-lg text-headline-lg font-bold text-primary">₹60.00</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-1">Rate: ₹60.00/hour</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Payment Method</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Razorpay Checkout</span>
<span className="font-code-sm text-code-sm text-primary font-medium mt-1">Payment Status: Paid</span>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-center">
<span className="font-label-sm text-label-sm text-on-surface-variant">Payment Timestamp</span>
<span className="font-body-md text-body-md font-semibold text-on-surface">Sep 15, 2026</span>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-1">10:30 AM IST</span>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs font-code-sm text-code-sm">
<div className="p-space-sm rounded bg-surface flex flex-col">
<span className="text-on-surface-variant text-[11px] uppercase tracking-wider">Transaction ID</span>
<span className="font-medium text-on-surface select-all mt-0.5">TXN-89231481</span>
</div>
<div className="p-space-sm rounded bg-surface flex flex-col">
<span className="text-on-surface-variant text-[11px] uppercase tracking-wider">Razorpay Order ID</span>
<span className="font-medium text-on-surface select-all mt-0.5">order_N9xL2pQ81kLm</span>
</div>
<div className="p-space-sm rounded bg-surface flex flex-col">
<span className="text-on-surface-variant text-[11px] uppercase tracking-wider">Razorpay Payment ID</span>
<span className="font-medium text-on-surface select-all mt-0.5">pay_P2wK901vB8xZ</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
<div className="flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs text-primary">
<span className="material-symbols-outlined">verified</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Verification &amp; Pass</h2>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
              Active &amp; Verified
            </span>
</div>

<div className="flex flex-col items-center justify-center p-space-md rounded-xl bg-surface-container-low">
<div className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-center">
<svg className="w-32 h-32 text-on-surface" fill="currentColor" viewBox="0 0 100 100">

<path d="M5 5h30v30H5zM10 10v20h20V10zm5 5h10v10H15z"></path>
<path d="M65 5h30v30H65zM70 10v20h20V10zm5 5h10v10H75z"></path>
<path d="M5 65h30v30H5zM10 70v20h20V70zm5 5h10v10H15z"></path>

<rect height="6" width="16" x="42" y="10"></rect>
<rect height="8" width="8" x="42" y="22"></rect>
<rect height="12" width="6" x="54" y="24"></rect>
<rect height="8" width="8" x="10" y="42"></rect>
<rect height="6" width="12" x="24" y="44"></rect>
<rect height="16" width="16" x="42" y="42"></rect>
<rect height="6" width="12" x="64" y="42"></rect>
<rect height="12" width="8" x="82" y="44"></rect>
<rect height="14" width="6" x="44" y="66"></rect>
<rect height="6" width="14" x="56" y="64"></rect>
<rect height="14" width="12" x="65" y="76"></rect>
<rect height="8" width="8" x="82" y="66"></rect>
<rect height="8" width="8" x="82" y="82"></rect>
</svg>
</div>
<span className="font-code-sm text-code-sm text-on-surface-variant mt-2 font-semibold">PASS-AUTH-5001-CCS2</span>
</div>
<div className="text-on-surface-variant font-body-sm text-body-sm text-center">
            Booking pass status: <span className="font-semibold text-primary">Active &amp; Verified</span>. Validated for entry at Indiranagar Station.
          </div>
</div>
<div className="flex flex-col gap-2 pt-space-xs">
<button className="w-full py-2.5 px-space-md rounded-lg bg-error/10 hover:bg-error/15 text-error font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-space-xs" id="triggerCancelModalSecondary" type="button">
<span className="material-symbols-outlined text-[18px]">cancel</span>
            Cancel Booking
          </button>
<span className="font-code-sm text-[11px] text-center text-on-surface-variant">Requires administrative rationale recording</span>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden items-center justify-center p-margin" id="cancelModal">
<div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-xl overflow-hidden flex flex-col">

<div className="p-space-lg bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-space-xs text-error">
<span className="material-symbols-outlined">warning</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Cancel Reservation #5001</h3>
</div>
<button className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" id="closeCancelModal" type="button">
<span className="material-symbols-outlined">close</span>
</button>
</div>

<div className="p-space-lg flex flex-col gap-space-md">
<p className="font-body-md text-body-md text-on-surface">
            Are you sure you want to cancel the booking for <strong className="text-on-surface">Alex Morgan</strong> at <strong className="text-on-surface">Indiranagar Station</strong>?
          </p>

<div className="flex flex-col gap-1.5">
<label className="font-label-sm text-label-sm font-semibold text-on-surface-variant" htmlFor="cancelReasonSelect">Cancellation Reason</label>
<div className="relative">
<select className="w-full h-11 px-3 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="cancelReasonSelect">
<option disabled={true} value="">Select Reason</option>
<option value="Customer request">Customer request</option>
<option value="Station maintenance">Station maintenance</option>
<option value="Slot conflict">Slot conflict</option>
<option value="Other">Other</option>
</select>
<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center">
<span className="material-symbols-outlined text-[20px]">expand_more</span>
</div>
</div>
</div>

<div className="p-space-md rounded-lg bg-surface-container-high flex items-start gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">info</span>
<p className="font-body-sm text-body-sm text-on-surface">
              Refunds are processed manually out-of-band per support guidelines.
            </p>
</div>
</div>

<div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
<button className="px-space-md py-2.5 rounded-lg font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container transition-colors" id="closeModalBtn" type="button">
            Close
          </button>
<button className="px-space-md py-2.5 rounded-lg bg-error hover:bg-on-error-container text-on-error font-label-md text-label-md font-semibold transition-colors shadow-sm" id="confirmCancelBtn" type="button">
            Confirm Cancellation
          </button>
</div>
</div>
</div>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-auto"><div className="max-w-[1280px] mx-auto px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg"><div className="flex flex-col gap-space-xs text-center md:text-left"><span className="font-headline-md text-headline-md text-primary">EV GO</span><p className="font-body-sm text-body-sm text-on-surface-variant">EV GO — Electric Vehicle Charging Platform</p></div><div className="flex flex-wrap items-center justify-center gap-space-lg"><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="about" href="#">About</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="contact" href="#">Contact</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="terms" href="#">Terms</a><a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" data-path="privacy" href="#">Privacy</a></div><div className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">© 2024 EV GO Infrastructure Network. All rights reserved.</div></div></footer>
    </div>
  );
}
