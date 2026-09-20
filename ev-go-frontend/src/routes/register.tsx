import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { setTokens } from "../lib/auth";

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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<{ accessToken: string; expiresAt: string }>(
        "/auth/register",
        { fullName, email, password, phone }  // backend requires fullName, not name
      );
      setTokens(data.accessToken, data.expiresAt);
      await navigate({ to: "/stations" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }
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

{error && (
<div className="flex items-start gap-space-sm bg-error-container text-on-error-container p-space-sm rounded mb-space-md" role="alert">
<span className="material-symbols-outlined text-label-md shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
<div className="flex-1 font-body-sm text-body-sm">{error}</div>
</div>
)}

<form className="flex flex-col gap-space-md" onSubmit={handleSubmit} noValidate>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="fullName">Full Name</label>
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="fullName" name="fullName" placeholder="Alex Morgan" required type="text" />
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="email" name="email" placeholder="alex.morgan@example.com" required type="email" />
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="phone">Phone Number</label>
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="phone" name="phone" placeholder="+91 98765 43210" required type="tel" />
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="password" minLength={8} name="password" placeholder="••••••••" required type="password" />
<span className="font-body-sm text-body-sm text-on-surface-variant">Must be at least 8 characters</span>
</div>

<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface" htmlFor="confirm-password">Confirm Password</label>
<input className="w-full h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-low transition-colors" id="confirm-password" name="confirm_password" placeholder="••••••••" required type="password" />
</div>

<button className="w-full h-12 mt-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg hover:opacity-95 active:opacity-90 shadow-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-60" type="submit" disabled={loading}>
  {loading ? "Creating account…" : "Register"}
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
