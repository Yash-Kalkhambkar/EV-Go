import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: Page4,
  head: () => ({
    meta: [
      { title: "Create Account \u2014 EV GO" },
      { name: "description", content: "Join EV GO to reserve EV charging slots across the network." },
      { property: "og:title", content: "Create Account \u2014 EV GO" },
      { property: "og:description", content: "Join EV GO to reserve EV charging slots across the network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page4() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex items-center justify-center">
<main className="w-full bg-surface"><div className="flex flex-col w-full items-center justify-center p-gutter md:p-margin-desktop my-auto">
<div className="w-full max-w-md bg-surface-container-lowest shadow-md rounded-lg p-space-lg md:p-space-xl flex flex-col relative">

<div className="flex flex-col items-center mb-space-lg text-center">
<div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary mb-space-sm shadow-sm">
<span className="material-symbols-outlined text-headline-md" style={{fontVariationSettings: "'FILL' 1"}}>ev_station</span>
</div>
<span className="font-headline-md text-headline-md tracking-tight text-on-surface">EV GO</span>
<h1 className="font-headline-lg text-headline-lg text-on-surface mt-space-sm">Create Account</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">Join EV GO to reserve charging slots across stations</p>
</div>

<div className="hidden flex items-start gap-space-sm bg-error-container text-on-error-container p-space-sm rounded mb-space-md" id="error-alert" role="alert">
<span className="material-symbols-outlined text-label-md shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
<div className="flex-1 font-body-sm text-body-sm" id="error-message-text">Please review the highlighted fields to proceed.</div>
<button className="text-on-error-container hover:opacity-75" type="button">
<span className="material-symbols-outlined text-label-md">close</span>
</button>
</div>

<form className="flex flex-col gap-space-md" id="register-form" noValidate={true}>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="name">Full Name</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="name" name="name" placeholder="Alex Morgan" required={true} type="text" />
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="email" name="email" placeholder="alex.morgan@example.com" required={true} type="email" />
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="phone">Phone Number</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="phone" name="phone" placeholder="+91 98765 43210" required={true} type="tel" />
</div>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="password" minLength={8} name="password" placeholder="••••••••" required={true} type="password" />
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Must be at least 8 characters with a mix of letters and numbers</span>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="confirm-password">Confirm Password</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="confirm-password" name="confirm_password" placeholder="••••••••" required={true} type="password" />
</div>
</div>

<div className="flex items-start gap-space-sm pt-space-xs">
<div className="flex items-center h-5">
<input className="w-5 h-5 rounded bg-surface-container text-primary-container focus:ring-0 cursor-pointer accent-primary-container" id="terms" name="terms" required={true} type="checkbox" />
</div>
<label className="font-body-sm text-body-sm text-on-surface select-none cursor-pointer" htmlFor="terms">
          I agree to Terms &amp; Conditions
        </label>
</div>

<button className="w-full h-12 mt-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg hover:opacity-95 active:opacity-90 shadow-sm flex items-center justify-center transition-all cursor-pointer" type="submit">
        Register
      </button>
</form>

<div className="mt-space-lg text-center">
<span className="font-body-md text-body-md text-on-surface-variant">Already have an account?</span>
<a className="font-label-md text-label-md text-primary font-semibold ml-1 hover:underline" href="/login">Login</a>
</div>
</div>
</div>
</main>
    </div>
  );
}
