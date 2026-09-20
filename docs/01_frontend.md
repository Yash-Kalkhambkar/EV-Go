# EV GO — Frontend Architecture

## Stack

- React 18 + TypeScript
- Vite (build tool — faster than CRA, better DX)
- React Router v6 (routing)
- Zustand (global state — lightweight, no boilerplate)
- TanStack Query (server state, caching, background refetch)
- Axios (HTTP client with interceptors)
- Tailwind CSS (utility-first styling)
- Google Maps JS API + @react-google-maps/api
- SockJS + STOMP (WebSocket client)
- Razorpay JS SDK (payment modal)

---

## Project Structure

```
ev-go-frontend/
├── public/
├── src/
│   ├── api/                    # All API call functions
│   │   ├── auth.ts
│   │   ├── stations.ts
│   │   ├── bookings.ts
│   │   ├── payments.ts
│   │   └── ai.ts
│   │
│   ├── components/             # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Badge.tsx
│   │   ├── map/
│   │   │   ├── StationMap.tsx       # Google Map wrapper
│   │   │   ├── StationMarker.tsx    # Custom map pin
│   │   │   └── MapFilters.tsx       # Connector type, availability
│   │   ├── station/
│   │   │   ├── StationCard.tsx
│   │   │   ├── StationDetail.tsx
│   │   │   └── SlotGrid.tsx         # Visual slot picker
│   │   ├── booking/
│   │   │   ├── BookingCard.tsx
│   │   │   └── BookingSummary.tsx
│   │   └── ai/
│   │       └── ChatWidget.tsx       # Floating AI chatbot
│   │
│   ├── pages/                  # Route-level components
│   │   ├── Home.tsx                 # Map + search entry point
│   │   ├── StationDetail.tsx        # Station info + slot booking
│   │   ├── BookingConfirm.tsx       # Payment + confirmation
│   │   ├── MyBookings.tsx           # User booking history
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageStations.tsx
│   │       └── ManageBookings.tsx
│   │
│   ├── store/                  # Zustand global state
│   │   ├── authStore.ts             # user, token, isLoggedIn
│   │   ├── mapStore.ts              # center, zoom, filters
│   │   └── chatStore.ts             # chat history, isOpen
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useStations.ts           # TanStack Query wrapper
│   │   ├── useBooking.ts
│   │   ├── useSlotSocket.ts         # WebSocket slot updates
│   │   └── useGeolocation.ts        # Browser location API
│   │
│   ├── lib/
│   │   ├── axios.ts                 # Axios instance + interceptors
│   │   ├── socket.ts                # STOMP client setup
│   │   └── razorpay.ts              # Payment modal helper
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── station.ts
│   │   ├── booking.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── distance.ts
│   │   └── connectorLabel.ts
│   │
│   ├── App.tsx                 # Route definitions
│   └── main.tsx
│
├── .env.local
├── vite.config.ts
└── tailwind.config.ts
```

---

## Routing

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/station/:id" element={<StationDetail />} />
  <Route path="/booking/confirm" element={<ProtectedRoute><BookingConfirm /></ProtectedRoute>} />
  <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
  <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/admin/stations" element={<AdminRoute><ManageStations /></AdminRoute>} />
  <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
</Routes>
```

`ProtectedRoute` — redirects to `/login` if no JWT in store.
`AdminRoute` — additionally checks `user.role === 'ADMIN'`.
`AuthRoute` — redirects to `/` if already logged in.

---

## State Management

Two layers, separated by purpose:

### Zustand — global client state
Things that need to persist across navigation or be accessed from many places:

```ts
// authStore.ts
interface AuthStore {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

// mapStore.ts
interface MapStore {
  center: { lat: number; lng: number }
  zoom: number
  filters: { connectorType: string; availability: boolean }
  setCenter: (center) => void
  setFilters: (filters) => void
}

// chatStore.ts
interface ChatStore {
  isOpen: boolean
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  toggle: () => void
}
```

### TanStack Query — server state
Anything that comes from the API lives here. Handles loading/error states, background refetch, and caching automatically:

```ts
// hooks/useStations.ts
export const useStations = (filters) => {
  return useQuery({
    queryKey: ['stations', filters],
    queryFn: () => stationsApi.search(filters),
    staleTime: 30_000,     // treat as fresh for 30s
    refetchOnWindowFocus: true,
  })
}

// hooks/useBooking.ts
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    }
  })
}
```

---

## HTTP Client

```ts
// lib/axios.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(err)
  }
)
```

---

## WebSocket — Real-Time Slot Updates

When a user opens a station detail page, the frontend subscribes to that station's slot topic. Any booking by any user triggers a server broadcast and updates the UI without a page reload.

```ts
// lib/socket.ts
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const stompClient = new Client({
  webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
  reconnectDelay: 5000,
})

// hooks/useSlotSocket.ts
export const useSlotSocket = (stationId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    stompClient.activate()

    const sub = stompClient.subscribe(
      `/topic/stations/${stationId}/slots`,
      (message) => {
        const updated = JSON.parse(message.body)
        queryClient.setQueryData(['slots', stationId], updated)
      }
    )

    return () => {
      sub.unsubscribe()
      stompClient.deactivate()
    }
  }, [stationId])
}
```

---

## Key Pages

### Home — Map View

The entry point. User lands here, map centers on their location, nearby stations appear as markers. Filters sidebar on the left. AI chat widget floats bottom-right.

```
┌─────────────────────────────────────────────────┐
│  Filters sidebar  │   Google Map                 │
│  • Connector type │   [Station pins]             │
│  • Available now  │                              │
│  • Max distance   │                              │
│                   │         [AI Chat ↗]          │
└─────────────────────────────────────────────────┘
```

On marker click → side panel slides in with `StationCard` (name, distance, available slots, connector types). Click through → `/station/:id`.

### Station Detail

Full station info + live slot picker. Slots rendered as a grid, color-coded by status. WebSocket keeps this in sync.

```
Station Name — Loni Kalbhor Charging Hub
2.3 km away | CCS2, Type 2

[ Time slot grid ]
  09:00  10:00  11:00  12:00
  [  ✓  ] [  ✓  ] [ TAKEN ] [  ✓  ]
  13:00  14:00  15:00  16:00
  [  ✓  ] [  ✓  ] [  ✓  ] [ TAKEN ]

[ Book Selected Slot ]
```

### Booking Confirm

Shows booking summary (station, date, time, price). Triggers Razorpay modal. On payment success, calls backend to confirm booking and navigates to success screen.

---

## AI Chat Widget

Floating button (bottom-right) that expands to a chat panel. Sends messages to `/api/ai/chat`. Supports natural language queries like:

- "Find me a CCS2 station near Hadapsar open after 6pm"
- "What's the cheapest station within 5km right now?"
- "Cancel my booking for tomorrow"

The widget maintains conversation history in `chatStore` (per session). Each message sent to the backend includes the full history for context.

```tsx
// Simple message loop
const sendMessage = async (text: string) => {
  addMessage({ role: 'user', content: text })
  const res = await aiApi.chat({ message: text, history: messages })
  addMessage({ role: 'assistant', content: res.reply })
}
```

---

## Environment Variables

```env
VITE_API_URL=https://api.evgo.app
VITE_GOOGLE_MAPS_API_KEY=...
VITE_RAZORPAY_KEY_ID=...
```

---

## Build + Dev

```bash
npm run dev        # Vite dev server on :5173
npm run build      # Production build → dist/
npm run preview    # Preview prod build locally
```

The `dist/` folder is uploaded to GCP Cloud Storage and served via a CDN (Cloud CDN). No Node.js server needed for the frontend.
