import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Page6,
  head: () => ({
    meta: [
      { title: "My Profile \u2014 EV GO" },
      { name: "description", content: "Manage your EV GO account information and security settings." },
      { property: "og:title", content: "My Profile \u2014 EV GO" },
      { property: "og:description", content: "Manage your EV GO account information and security settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page6() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
<header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-16 max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-lg"><a className="flex items-center gap-space-sm" data-path="dashboard" href="#"><span className="material-symbols-outlined text-primary text-[28px]">ev_station</span><span className="font-headline-md text-headline-md tracking-tight text-primary font-bold">EV GO</span></a><nav className="hidden md:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary font-semibold"><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="find-stations" href="/stations">Find Stations</a><a className="px-space-md py-space-xs rounded-lg text-on-surface-variant font-label-md text-label-md transition-colors hover:bg-surface-container-high hover:text-on-surface" data-path="my-bookings" href="/bookings">My Bookings</a><a aria-current="page" className="px-space-md py-space-xs rounded-lg transition-colors bg-primary-container text-on-primary font-semibold" data-path="dashboard" href="/dashboard">Dashboard</a></nav></div><div className="flex items-center gap-space-md"><div className="hidden sm:flex flex-col text-right"><span className="font-label-md text-label-md text-on-surface font-medium leading-none">Alex Vance</span><span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-space-xs uppercase tracking-wider">Fleet Pilot</span></div><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-16 bg-surface flex-1"><div className="flex flex-col w-full">
<div className="max-w-7xl mx-auto w-full px-margin md:px-margin-desktop py-space-lg md:py-space-xl">

<header className="mb-space-lg md:mb-space-xl flex flex-col gap-space-xs">
<div className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md uppercase tracking-wider">
<span className="material-symbols-outlined text-[18px]">account_circle</span>
<span>Account</span>
</div>
<h1 className="font-headline-xl text-headline-xl tracking-tight text-primary">My Profile</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        Manage your personal account information and security settings
      </p>
</header>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

<div className="lg:col-span-8 flex flex-col gap-space-lg">

<section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Personal Information</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">Member since September 2026</p>
</div>
<span className="inline-flex items-center gap-1.5 px-space-md py-1 bg-surface-container text-primary font-label-md text-label-md rounded-full font-semibold">
<span className="w-2 h-2 rounded-full bg-primary"></span>
              User
            </span>
</div>
<form className="flex flex-col gap-space-md" id="personal-info-form">
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="profile-name">Name</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="profile-name" type="text" defaultValue="Alex Morgan" />
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="profile-phone">Phone</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="profile-phone" type="tel" defaultValue="+91 98765 43210" />
</div>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="profile-email">Email</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="profile-email" type="email" defaultValue="alex.morgan@example.com" />
</div>
<div className="flex flex-wrap items-center gap-space-md pt-space-sm mt-space-xs">
<button className="h-11 px-space-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.98]" id="save-personal-btn" type="button">
<span className="material-symbols-outlined text-[20px]">save</span>
<span>Save Changes</span>
</button>
<button className="h-11 px-space-lg bg-transparent hover:bg-surface-container text-on-surface border border-outline-variant font-label-md text-label-md rounded-lg transition-colors active:scale-[0.98]" id="cancel-personal-btn" type="button">
                Cancel
              </button>
<span className="font-label-sm text-label-sm text-primary font-medium hidden" id="save-status">
                Updated
              </span>
</div>
</form>
</section>

<section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
<div className="pb-space-sm border-b border-outline-variant/20">
<h2 className="font-headline-md text-headline-md text-on-surface">Change Password</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Must be at least 8 characters with a mix of letters and numbers
            </p>
</div>
<form className="flex flex-col gap-space-md" id="password-change-form">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="current-password">Current Password</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="current-password" placeholder="••••••••••••" type="password" defaultValue="••••••••••••" />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="new-password">New Password</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="new-password" placeholder="Enter new password" type="password" />
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="confirm-password">Confirm Password</label>
<input className="h-11 px-space-md bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg border border-outline-variant focus:border-primary-container focus:outline-none transition-colors" id="confirm-password" placeholder="Confirm new password" type="password" />
</div>
</div>
<div className="pt-space-xs">
<button className="h-11 px-space-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.98]" id="update-pwd-btn" type="button">
<span className="material-symbols-outlined text-[20px]">lock_reset</span>
<span>Update Password</span>
</button>
</div>
</form>
</section>
</div>

<div className="lg:col-span-4 flex flex-col gap-space-lg">

<aside className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">

<div className="flex items-center gap-space-md pb-space-md border-b border-outline-variant/20">
<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-on-primary font-headline-md text-headline-md tracking-wider shadow-sm">
              AM
            </div>
<div className="flex flex-col min-w-0">
<span className="font-headline-md text-headline-md text-on-surface truncate">Alex Morgan</span>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">alex.morgan@example.com</span>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">+91 98765 43210</span>
</div>
</div>

<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Active Booking</span>
<span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded text-on-primary-fixed-variant bg-primary-fixed text-[11px] font-semibold">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                Confirmed
              </span>
</div>

<div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-xs">
<div className="flex justify-between items-start">
<h3 className="font-headline-md text-headline-md text-primary truncate pr-space-xs">Indiranagar Station</h3>
<span className="font-code-sm text-code-sm text-on-surface-variant font-semibold">#5001</span>
</div>
<div className="flex items-center gap-space-xs text-on-surface-variant mt-space-xs">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span className="font-body-sm text-body-sm">Sep 20, 2026 • 02:00 PM - 03:00 PM</span>
</div>
<div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-outline-variant/30">
<span className="font-label-sm text-label-sm text-on-surface-variant">Payment Amount</span>
<span className="font-label-md text-label-md font-bold text-on-surface">₹60.00</span>
</div>
</div>

<a className="w-full mt-space-xs h-10 px-space-md bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-space-xs transition-colors" data-path="my-bookings" href="/bookings">
<span>View All Bookings</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</aside>
</div>
</div>
</div>

</div></main><footer className="w-full bg-surface-container-low mt-space-xl"><div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm"><span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">EV GO</span><span className="font-body-sm text-body-sm text-on-surface-variant">— Industrial Transit Power Network</span></div><nav className="flex flex-wrap items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="about" href="#">About</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms</a><a className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy</a></nav><div className="font-code-sm text-code-sm text-on-surface-variant">© 2025 EV GO Technical Reserve Ltd.</div></div></footer>
    </div>
  );
}
