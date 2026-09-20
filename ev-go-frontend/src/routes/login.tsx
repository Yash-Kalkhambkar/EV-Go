import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { setTokens } from "../lib/auth";
import { isAdmin } from "../lib/auth";

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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const { data } = await api.post<{ accessToken: string; expiresAt: string }>(
        "/auth/login",
        { email, password }
      );
      setTokens(data.accessToken, data.expiresAt);
      if (isAdmin()) {
        await navigate({ to: "/admin/stations" });
      } else {
        await navigate({ to: "/stations" });
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid email or password. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }
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

{error && (
<div className="mb-6 p-3.5 rounded-lg bg-error-container/40 flex items-start gap-3">
<span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
<div className="flex-1">
<p className="font-label-md text-label-md text-on-error-container font-medium">Authentication Failed</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{error}</p>
</div>
</div>
)}

<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="email">Email Address</label>
<input className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md outline-none focus:bg-surface-container-lowest transition-colors shadow-inner" id="email" name="email" placeholder="name@example.com" required type="email" />
</div>

<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="password">Password</label>
</div>
<input className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md outline-none focus:bg-surface-container-lowest transition-colors shadow-inner" id="password" name="password" placeholder="••••••••" required type="password" />
</div>

<button className="mt-2 w-full h-12 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md tracking-wide transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60" type="submit" disabled={loading}>
<span>{loading ? "Signing in…" : "Login"}</span>
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
