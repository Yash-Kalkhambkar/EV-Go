import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Page2,
  head: () => ({
    meta: [
      { title: "Login \u2014 EV GO" },
      { name: "description", content: "Sign in to manage your EV GO charging reservations." },
      { property: "og:title", content: "Login \u2014 EV GO" },
      { property: "og:description", content: "Sign in to manage your EV GO charging reservations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page2() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex items-center justify-center">
<main className="w-full bg-surface"><div className="flex flex-col w-full items-center justify-center py-12 px-4 sm:px-6">
<div className="w-full max-w-[440px] bg-surface-container-lowest rounded-lg shadow-sm p-8 sm:p-10 flex flex-col">

<div className="flex items-center gap-2.5 mb-8">
<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
</div>
<div className="flex items-baseline gap-1">
<span className="font-headline-md text-headline-md tracking-tight text-on-surface uppercase">EV GO</span>
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
</div>
</div>

<div className="flex flex-col gap-1.5 mb-6">
<h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Welcome Back</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your charging reservations</p>
</div>

<div className="mb-6 p-3.5 rounded-lg bg-error-container/40 flex items-start gap-3" id="error-alert">
<span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
<div className="flex-1">
<p className="font-label-md text-label-md text-on-error-container font-medium">Authentication Failed</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Invalid email or password. Please check your credentials.</p>
</div>
<button className="text-on-surface-variant hover:text-on-surface transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>

<form className="flex flex-col gap-5">

<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="email">Email Address</label>
<div className="relative flex items-center">
<input className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md outline-none focus:bg-surface-container-lowest transition-colors shadow-inner" id="email" name="email" placeholder="name@example.com" required={true} type="email" defaultValue="alex.turner@fleetlogix.io" />
</div>
</div>

<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="password">Password</label>
<a className="font-label-sm text-label-sm text-primary hover:underline font-semibold" href="#">Forgot Password?</a>
</div>
<div className="relative flex items-center">
<input className="w-full h-11 pl-3.5 pr-11 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md outline-none focus:bg-surface-container-lowest transition-colors shadow-inner" id="password" name="password" placeholder="••••••••" required={true} type="password" />
<button aria-label="Toggle password visibility" className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-outline hover:text-on-surface transition-colors" id="toggle-password" type="button">
<span className="material-symbols-outlined text-[20px]" id="password-icon">visibility</span>
</button>
</div>
</div>

<div className="flex items-center justify-between mt-1">
<label className="flex items-center gap-2.5 cursor-pointer select-none">
<input defaultChecked={true} className="w-4 h-4 rounded bg-surface-container-low text-primary accent-primary focus:ring-0 cursor-pointer" id="remember-me" name="remember-me" type="checkbox" />
<span className="font-body-sm text-body-sm text-on-surface">Remember me</span>
</label>
</div>

<button className="mt-2 w-full h-12 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md tracking-wide transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2" type="submit">
<span>Login</span>
</button>
</form>

<div className="mt-8 pt-6 flex items-center justify-center gap-1.5">
<span className="font-body-sm text-body-sm text-on-surface-variant">Don't have an account?</span>
<a className="font-label-md text-label-md text-primary font-semibold hover:underline" href="/register">Sign up</a>
</div>
</div>

</div></main>
    </div>
  );
}
