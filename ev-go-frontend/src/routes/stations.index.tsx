import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stations/")({
  component: Page3,
  head: () => ({
    meta: [
      { title: "Find Charging Stations \u2014 EV GO" },
      { name: "description", content: "Browse EV charging stations near you with live slot availability, connectors and pricing." },
      { property: "og:title", content: "Find Charging Stations \u2014 EV GO" },
      { property: "og:description", content: "Browse EV charging stations near you with live slot availability, connectors and pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Page3() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col">


<header className="bg-surface border-b border-border-subtle sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<div className="flex items-center gap-8">
<a className="flex items-center gap-2" data-path="home" href="#">
<span className="font-headline font-bold text-xl tracking-tight text-primary">EV GO</span>
</a>
<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
<a className="text-primary font-semibold" data-path="find-stations" href="/stations">Find Stations</a>
<a className="hover:text-on-surface transition-colors" data-path="about" href="#">About</a>
<a className="hover:text-on-surface transition-colors" data-path="pricing" href="#">Pricing</a>
<a className="hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a>
</nav>
</div>
<div className="flex items-center gap-3">
<a className="text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 py-2" data-path="login" href="/login">Login</a>
<a className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors" data-path="register" href="/register">Sign Up Free</a>
</div>
</div>
</header>

<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

<div>
<a className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors" data-path="home" href="/">
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
<span>Back to Home</span>
</a>
</div>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
<div>
<h1 className="font-headline text-2xl font-bold text-on-surface">Found 12 stations within 10km</h1>
</div>
<div className="flex items-center gap-2">
<button className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-outline rounded-lg text-sm font-medium text-on-surface" id="mobileFilterToggle">
<span className="material-symbols-outlined text-[18px]">tune</span>
<span>Filters</span>
</button>
<div className="inline-flex bg-surface border border-border-subtle p-0.5 rounded-lg shadow-sm">
<button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-primary text-on-primary" id="viewListBtn">
<span className="material-symbols-outlined text-[18px]">view_list</span>
<span>List View</span>
</button>
<button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-on-surface-variant hover:text-on-surface" id="viewMapBtn">
<span className="material-symbols-outlined text-[18px]">map</span>
<span>Map View</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

<aside className="lg:col-span-4 xl:col-span-3 bg-surface p-5 rounded-lg border border-border-subtle shadow-sm flex flex-col gap-6" id="filterSidebar">
<div className="flex items-center justify-between border-b border-border-subtle pb-3">
<span className="font-headline font-semibold text-base text-on-surface">Filters</span>
<button className="text-xs font-medium text-on-surface-variant hover:text-on-surface underline" id="resetFiltersBtn">
            Reset Filters
          </button>
</div>

<div>
<div className="flex justify-between items-center mb-2">
<label className="text-sm font-medium text-on-surface" htmlFor="radiusRange">Radius</label>
<span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface" id="radiusValueBadge">10km</span>
</div>
<input className="w-full h-1.5 bg-surface-container rounded cursor-pointer accent-primary" id="radiusRange" max="50" min="5" step="5" type="range" defaultValue="10" />
<div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
<span>5km</span>
<span>50km</span>
</div>
</div>

<div>
<label className="text-sm font-medium text-on-surface block mb-2">Connector Type</label>
<div className="space-y-2">
<label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
<input defaultChecked={true} className="rounded border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" />
<span>CCS2</span>
</label>
<label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
<input defaultChecked={true} className="rounded border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" />
<span>CHAdeMO</span>
</label>
<label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
<input defaultChecked={true} className="rounded border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" />
<span>Type 2</span>
</label>
<label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
<input className="rounded border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" />
<span>GB/T</span>
</label>
</div>
</div>

<div>
<div className="flex justify-between items-center mb-2">
<label className="text-sm font-medium text-on-surface" htmlFor="priceRange">Price Range</label>
<span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface" id="priceValueBadge">₹200/hour</span>
</div>
<input className="w-full h-1.5 bg-surface-container rounded cursor-pointer accent-primary" id="priceRange" max="200" min="0" step="10" type="range" defaultValue="200" />
<div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
<span>₹0/hour</span>
<span>₹200/hour</span>
</div>
</div>

<div className="flex items-center justify-between pt-1">
<label className="text-sm font-medium text-on-surface cursor-pointer" htmlFor="availToggle">Available now</label>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked={true} className="sr-only peer" id="availToggle" type="checkbox" />
<div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>

<button className="w-full bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium py-2.5 rounded-lg transition-colors text-center">
          Apply Filters
        </button>

<div className="text-center pt-2 border-t border-border-subtle">
<button className="text-xs text-on-surface-variant hover:text-on-surface underline" id="toggleEmptyBtn">
            [Toggle Empty State Preview]
          </button>
</div>
</aside>

<section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">

<div className="w-full bg-surface-container-high rounded-lg overflow-hidden border border-border-subtle shadow-sm relative h-72" id="mapSection">

<div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRmaLlMw7cZrCfhZVa8p4PtN6IQ0GZyPFmAWLohgKQCTt7Xmkqhq-tSKs023n132g3V4aBoAyg0lqZlZXhagUJqnmQoCBEqXVNkL3D3LvBcrKgahPWCZpjfUU48Im5RfuxuZXzzPdR__52vMZ_c_HBln2eHNCJJVqdG4Wf5a-SuB-7o6A83WksWhLErM6IeeivURcdS7C23umIb5zN73vp2EPy4xvz5Vq6M78_E4gV1Eu26iebdbwqpg')"}}>

<div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div className="bg-primary text-on-primary text-xs font-semibold px-2.5 py-1 rounded shadow cursor-pointer">
                Indiranagar Station • ₹60/hour
              </div>
<div className="w-2 h-2 bg-primary rotate-45 -mt-1"></div>
</div>

<div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div className="bg-primary text-on-primary text-xs font-semibold px-2.5 py-1 rounded shadow cursor-pointer">
                Koramangala Station • ₹55/hour
              </div>
<div className="w-2 h-2 bg-primary rotate-45 -mt-1"></div>
</div>

<div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div className="bg-primary text-on-primary text-xs font-semibold px-2.5 py-1 rounded shadow cursor-pointer">
                Trinity Circle Station • ₹70/hour
              </div>
<div className="w-2 h-2 bg-primary rotate-45 -mt-1"></div>
</div>

<div className="absolute bottom-6 right-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
<div className="bg-primary text-on-primary text-xs font-semibold px-2.5 py-1 rounded shadow cursor-pointer">
                Domlur Station • ₹50/hour
              </div>
<div className="w-2 h-2 bg-primary rotate-45 -mt-1"></div>
</div>
</div>
</div>

<div className="flex flex-col gap-4" id="stationResultsList">

<article className="bg-surface rounded-lg p-5 border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
<div className="flex-1 min-w-0">
<h2 className="font-headline text-lg font-bold text-on-surface">Indiranagar Station</h2>
<p className="text-sm text-on-surface-variant mt-0.5">CMH Road, Stage 1, Indiranagar, Bengaluru</p>
<p className="text-xs text-on-surface-variant mt-1">1.8 km away</p>
<div className="flex flex-wrap items-center gap-2 mt-3">
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CCS2</span>
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CHAdeMO</span>
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">Type 2</span>
</div>
<div className="text-xs text-on-surface font-medium mt-3">
<span>4 slots available</span>
<span className="mx-1.5 text-on-surface-variant">•</span>
<span className="text-on-surface-variant">Total chargers: 6</span>
</div>
</div>
<div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
<div className="text-left md:text-right">
<span className="text-xl font-bold font-headline text-on-surface">₹60/hour</span>
</div>
<div className="flex items-center gap-2 mt-2">
<button className="p-2 border border-border-subtle rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Show on map">
<span className="material-symbols-outlined text-[18px]">location_on</span>
</button>
<a className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors" data-path="station-indiranagar" href="/bookings/5001">
                  View Details
                </a>
</div>
</div>
</article>

<article className="bg-surface rounded-lg p-5 border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
<div className="flex-1 min-w-0">
<h2 className="font-headline text-lg font-bold text-on-surface">Koramangala Station</h2>
<p className="text-sm text-on-surface-variant mt-0.5">80 Feet Road, 4th Block, Koramangala</p>
<p className="text-xs text-on-surface-variant mt-1">3.2 km away</p>
<div className="flex flex-wrap items-center gap-2 mt-3">
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CCS2</span>
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">Type 2</span>
</div>
<div className="text-xs text-on-surface font-medium mt-3">
<span>6 slots available</span>
<span className="mx-1.5 text-on-surface-variant">•</span>
<span className="text-on-surface-variant">Total chargers: 8</span>
</div>
</div>
<div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
<div className="text-left md:text-right">
<span className="text-xl font-bold font-headline text-on-surface">₹55/hour</span>
</div>
<div className="flex items-center gap-2 mt-2">
<button className="p-2 border border-border-subtle rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Show on map">
<span className="material-symbols-outlined text-[18px]">location_on</span>
</button>
<a className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors" data-path="station-koramangala" href="/bookings/5001">
                  View Details
                </a>
</div>
</div>
</article>

<article className="bg-surface rounded-lg p-5 border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
<div className="flex-1 min-w-0">
<h2 className="font-headline text-lg font-bold text-on-surface">Trinity Circle Station</h2>
<p className="text-sm text-on-surface-variant mt-0.5">MG Road Junction, Trinity Circle</p>
<p className="text-xs text-on-surface-variant mt-1">2.4 km away</p>
<div className="flex flex-wrap items-center gap-2 mt-3">
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CCS2</span>
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CHAdeMO</span>
</div>
<div className="text-xs text-on-surface font-medium mt-3">
<span>1 slots available</span>
<span className="mx-1.5 text-on-surface-variant">•</span>
<span className="text-on-surface-variant">Total chargers: 6</span>
</div>
</div>
<div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
<div className="text-left md:text-right">
<span className="text-xl font-bold font-headline text-on-surface">₹70/hour</span>
</div>
<div className="flex items-center gap-2 mt-2">
<button className="p-2 border border-border-subtle rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Show on map">
<span className="material-symbols-outlined text-[18px]">location_on</span>
</button>
<a className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors" data-path="station-trinity" href="/bookings/5001">
                  View Details
                </a>
</div>
</div>
</article>

<article className="bg-surface rounded-lg p-5 border border-border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
<div className="flex-1 min-w-0">
<h2 className="font-headline text-lg font-bold text-on-surface">Domlur Station</h2>
<p className="text-sm text-on-surface-variant mt-0.5">Old Airport Road, Domlur Junction</p>
<p className="text-xs text-on-surface-variant mt-1">4.1 km away</p>
<div className="flex flex-wrap items-center gap-2 mt-3">
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">CCS2</span>
<span className="text-xs px-2 py-0.5 bg-surface-container-low rounded border border-border-subtle font-medium text-on-surface">GB/T</span>
</div>
<div className="text-xs text-on-surface font-medium mt-3">
<span>0 slots available</span>
<span className="mx-1.5 text-on-surface-variant">•</span>
<span className="text-on-surface-variant">Total chargers: 4</span>
</div>
</div>
<div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
<div className="text-left md:text-right">
<span className="text-xl font-bold font-headline text-on-surface">₹50/hour</span>
</div>
<div className="flex items-center gap-2 mt-2">
<button className="p-2 border border-border-subtle rounded-lg text-on-surface hover:bg-surface-container transition-colors" title="Show on map">
<span className="material-symbols-outlined text-[18px]">location_on</span>
</button>
<a className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors" data-path="station-domlur" href="/bookings/5001">
                  View Details
                </a>
</div>
</div>
</article>
</div>

<div className="hidden bg-surface rounded-lg p-10 border border-border-subtle text-center" id="emptyState">
<div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant mb-4">
<span className="material-symbols-outlined text-[24px]">search_off</span>
</div>
<h2 className="font-headline text-lg font-bold text-on-surface">No stations found</h2>
<p className="text-sm text-on-surface-variant mt-1 mb-6">No charging stations match the criteria within this area.</p>
<button className="bg-primary hover:bg-primary-hover text-on-primary text-sm font-medium px-5 py-2.5 rounded-lg transition-colors" id="expandRadiusBtn">
            Expand Search Radius
          </button>
</div>
</section>
</div>
</main>

<footer className="bg-surface border-t border-border-subtle mt-auto py-6">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
<div>
<span className="font-headline font-bold text-sm text-primary mr-2">EV GO</span>
<span>© 2024 EV GO. All rights reserved.</span>
</div>
<div className="flex items-center gap-6">
<a className="hover:text-on-surface transition-colors" data-path="about" href="#">About</a>
<a className="hover:text-on-surface transition-colors" data-path="contact" href="#">Contact</a>
<a className="hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms</a>
<a className="hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy</a>
</div>
</div>
</footer>


    </div>
  );
}
