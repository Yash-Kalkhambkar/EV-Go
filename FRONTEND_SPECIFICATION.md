# Frontend Specification - EV Charging Platform

**For:** UI/UX Design (Stitch/v0.dev/Figma)  
**Backend:** Actually implemented and ready (v1 scope only)  
**Focus:** Functional requirements only (no colors/themes)

**⚠️ IMPORTANT:** This spec matches the **actual backend APIs built**. Features marked "Phase 4" require backend work first.

---

## 📱 Page Structure & User Flows

### **1. PUBLIC PAGES (No Login Required)**

#### 1.1 Landing Page `/`

**Purpose:** Marketing + Quick Station Search

**Components:**

**Hero Section:**
- Heading text
- Subheading text
- CTA button: "Find Charging Stations"
- CTA button: "Sign Up Free"

**Search Section:**
- Search input: "Enter location or use current location"
- Button: "Use My Location" (with location icon)
- Dropdown: "Search Radius" (5km, 10km, 20km, 50km)
- Button: "Search Stations"

**Features Section:**
- Feature card 1: "Real-time Availability"
- Feature card 2: "Instant Booking"
- Feature card 3: "Secure Payment"
- Feature card 4: "24/7 Support"

**Footer:**
- Links: About, Contact, Terms, Privacy
- Copyright text

---

#### 1.2 Station Search Results `/stations/search`

**Purpose:** Browse nearby charging stations

**Components:**

**Top Bar:**
- Back button
- Search summary: "Found 12 stations within 10km"
- Filter button (opens filter panel)

**Filter Panel (Sidebar/Modal):**
- Radius slider: 5-50km
- Connector types: Checkboxes (CCS2, CHAdeMO, Type 2, GB/T)
- Price range slider: ₹0 - ₹200/hour
- Availability toggle: "Available now only"
- Button: "Apply Filters"
- Button: "Reset Filters"

**Station List:**
Each station card shows:
- Station name
- Address (truncated)
- Distance: "2.3 km away"
- Price: "₹50/hour"
- Available slots: "4 slots available"
- Connector types: Icons (CCS2, CHAdeMO)
- Button: "View Details"
- Icon: Map pin (clicking shows on map)

**Map View Toggle:**
- Button: "List View" / "Map View"
- Map shows station markers with info popup

**Empty State:**
- Icon: No results
- Text: "No stations found nearby"
- Button: "Expand Search Radius"

---

#### 1.3 Station Details `/stations/:id`

**Purpose:** View station info and available time slots

**Components:**

**Header:**
- Back button
- Station name
- Share button (generates short URL + QR code)

**Station Info Card:**
- Address (full)
- Distance: "2.3 km away"
- Price: "₹50/hour"
- Total slots: "4 charging points"
- Connector types: List with icons
- Opening hours: "24/7" or "8 AM - 8 PM"
- Button: "Get Directions" (opens maps)

**Date Selector:**
- Label: "Select Date"
- Date picker: Shows next 7 days
- Selected date highlighted

**Time Slots Grid:**
- Time slots as cards/buttons (e.g., "2:00 PM - 3:00 PM")
- Status indicators:
  - Available (selectable)
  - Booked (disabled, grayed out)
  - Selected (highlighted)
- Shows 12-24 slots depending on operating hours

**Bottom Action:**
- Button: "Book This Slot" (enabled when slot selected)
- Shows: "Selected: 2:00 PM - 3:00 PM on Sep 20"

**Login Prompt (if not logged in):**
- Modal: "Login required to book"
- Button: "Login"
- Button: "Sign Up"

---

#### 1.4 Login Page `/login`

**Purpose:** User authentication

**Components:**

**Login Form:**
- Input: Email
- Input: Password (with show/hide toggle)
- Checkbox: "Remember me"
- Link: "Forgot password?"
- Button: "Login"
- Divider: "or"
- Link: "Don't have an account? Sign Up"

**Error Message Area:**
- Shows validation errors or login failures

---

#### 1.5 Sign Up Page `/signup`

**Purpose:** User registration

**Components:**

**Registration Form:**
- Input: Full Name
- Input: Email
- Input: Phone Number
- Input: Password (with strength indicator)
- Input: Confirm Password
- Checkbox: "I agree to Terms & Conditions"
- Button: "Create Account"
- Link: "Already have an account? Login"

**Validation Messages:**
- Real-time validation for each field
- Password strength: Weak/Medium/Strong

---

### **2. USER PAGES (Login Required)**

#### 2.1 User Dashboard `/dashboard`

**Purpose:** Home page after login

**Components:**

**Header:**
- App logo
- Search bar (quick station search)
- Profile dropdown menu

**Quick Actions:**
- Card: "Find Charging Station" (icon + text)
- Card: "My Bookings" (icon + text)
- Card: "AI Assistant" (icon + text)

**Upcoming Bookings Section:**
- Heading: "Upcoming Bookings"
- Booking cards (max 3, sorted by date):
  - Station name
  - Date & time: "Sep 20, 2:00 PM - 3:00 PM"
  - Status badge: "Confirmed"
  - Button: "View Details"
  - Button: "Cancel"
- Link: "View All Bookings"

~~**Recent Stations Section:**~~ (Backend tracking not implemented)
~~- Heading: "Recently Viewed Stations"~~
~~- Station cards (horizontal scroll):~~
  ~~- Station name~~
  ~~- Distance~~
  ~~- Price~~
  ~~- Button: "Book Again"~~

~~**Stats Cards (if available):**~~ (Backend tracking not implemented)
~~- Total bookings count~~
~~- Total amount spent~~
~~- Favorite station~~

---

#### 2.2 My Bookings Page `/bookings`

**Purpose:** View all user bookings

**Components:**

**Tab Navigation:**
- Tab: "Upcoming" (count badge)
- Tab: "Pending Payment" (count badge)
- Tab: "Past"
- Tab: "Cancelled"

**Upcoming Tab:**
Each booking card shows:
- Station name
- Address (truncated)
- Date & time: "Sep 20, 2:00 PM - 3:00 PM"
- Status badge: "Confirmed"
- Amount: "₹50.00"
- Booking ID: "#5001"
- Button: "View QR Code"
- Button: "Get Directions"
- Button: "Cancel Booking"

**Pending Payment Tab:**
Each booking card shows:
- Station name
- Date & time
- Amount: "₹50.00"
- ~~Timer: "Payment expires in 14:23"~~ (Backend doesn't track expiry yet)
- Button: "Complete Payment" (prominent)
- Button: "Cancel"

**Past Tab:**
- Same as Upcoming, but:
  - Status: "Completed"
  - Remove cancel button
  - Add: "Book Again" button

**Cancelled Tab:**
- Same as Past
- Status: "Cancelled"
- Shows cancellation reason (if any)
- ~~Shows refund status~~ (Refunds are manual/out-of-band in v1)

**Empty States:**
- Icon: No bookings
- Text: "No bookings yet"
- Button: "Find Charging Stations"

---

#### 2.3 Booking Details Page `/bookings/:id`

**Purpose:** Detailed view of a single booking

**Components:**

**Header:**
- Back button
- Title: "Booking Details"
- Booking ID: "#5001"

**Status Banner:**
- Status: "Confirmed" / "Pending Payment" / "Completed" / "Cancelled"
- Icon based on status

**Station Info:**
- Station name
- Full address
- Map thumbnail (clickable)
- Button: "Get Directions"

**Booking Details:**
- Date: "September 20, 2026"
- Time: "2:00 PM - 3:00 PM"
- Duration: "1 hour"
- Slot ID: "#1001"

**Payment Info:**
- Amount: "₹50.00"
- Payment method: "Razorpay"
- Payment ID: "pay_xxxxx"
- Payment date: "Sep 15, 2026, 10:30 AM"

**QR Code Section (for confirmed bookings):**
- Large QR code (scannable at station)
- Text: "Show this at the station"
- Button: "Download QR Code"
- Button: "Share Booking"

**Actions:**
- Button: "Cancel Booking" (if upcoming)
- Button: "Complete Payment" (if pending)
- ~~Button: "Download Receipt"~~ (Future enhancement)
- ~~Button: "Report Issue"~~ (Future enhancement)

**Cancellation Modal:**
- Heading: "Cancel Booking"
- Text: "Are you sure you want to cancel?"
- Input: "Reason for cancellation (optional)"
- ~~Warning: "Refund will be processed within 5-7 business days"~~ (Refunds are manual in v1)
- Button: "Confirm Cancellation"
- Button: "Keep Booking"

---

#### 2.4 Payment Page `/bookings/:id/payment`

**Purpose:** Complete payment for booking

**Components:**

**Booking Summary:**
- Station name
- Date & time
- Duration: "1 hour"
- Total amount: "₹50.00" (no platform fee in v1)

~~**Timer:**~~
~~- Countdown: "Payment expires in 14:23"~~
~~- Progress bar~~
(Backend doesn't track payment expiry in v1 - this is a future enhancement)

**Payment Method Section:**
- Radio buttons:
  - Credit/Debit Card
  - UPI
  - Net Banking
  - Wallet (Paytm, PhonePe, etc.)

**Razorpay Checkout:**
- Button: "Proceed to Payment" (opens Razorpay modal)

**Terms:**
- Checkbox: "I agree to cancellation policy"
- Link: "View Policy"

**After Payment:**
- Success modal:
  - Icon: Success checkmark
  - Text: "Payment Successful!"
  - Booking ID: "#5001"
  - Button: "View Booking Details"
  - ~~Button: "Download Receipt"~~ (Future enhancement - no receipt generation endpoint)

**Payment Failed:**
- Error modal:
  - Icon: Error
  - Text: "Payment Failed"
  - Reason: (from Razorpay)
  - Button: "Retry Payment"
  - Button: "Cancel Booking"

---

#### 2.5 AI Assistant Page `/ai-chat`

**Purpose:** Chat with AI assistant for help

**Components:**

**Chat Header:**
- Back button
- Title: "AI Assistant"
- Button: "New Conversation"

**Chat Messages Area:**
- Message bubbles (user and assistant)
- Timestamp for each message
- Typing indicator: "AI is typing..."

**Suggested Actions (Initial State):**
- Button: "Find nearby stations"
- Button: "Check my bookings"
- Button: "Help with payment"
- Button: "Report an issue"

**Chat Input:**
- Text input: "Ask me anything..."
- Button: "Send" (icon)
- Disable when AI is responding

**AI Capabilities (Show in Help/Info):**
- Text: "I can help you:"
  - Find charging stations
  - Check booking status
  - Answer questions about pricing
  - Guide through booking process

---

#### 2.6 Profile Page `/profile`

**Purpose:** View and edit user profile

**Components:**

**Profile Header:**
- Avatar (initials or uploaded image)
- Name
- Email
- Member since: "September 2026"

**Profile Information:**
- Label: "Full Name"
  - Value: [editable]
- Label: "Email"
  - Value: [editable]
- Label: "Phone Number"
  - Value: [editable]
- Label: "Default Location"
  - Value: [editable]
  - Button: "Use Current Location"

**Edit Mode:**
- Button: "Edit Profile" (toggles to edit mode)
- Button: "Save Changes" (when editing)
- Button: "Cancel" (when editing)

**Account Actions:**
- Button: "Change Password"
- ~~Button: "Notification Preferences"~~ (No notification system in v1)
- ~~Button: "Delete Account"~~ (No endpoint in v1)

**Logout:**
- Button: "Logout"

---

#### 2.7 Change Password Modal

**Components:**
- Input: "Current Password"
- Input: "New Password" (with strength indicator)
- Input: "Confirm New Password"
- Button: "Update Password"
- Button: "Cancel"

---

#### ~~2.8 Notification Preferences Modal~~ (Not in v1)

~~Components removed - no notification system backend in v1~~

---

### **3. ADMIN PAGES (Admin Role Required)**

#### 3.1 Admin Dashboard `/admin`

**Purpose:** Overview of platform operations

**Components:**

**Stats Cards (Top Row):**
- Card: "Total Bookings Today"
  - Number (no trend data in v1)
- Card: "Revenue Today"
  - Amount: "₹12,500" (no trend data in v1)
- Card: "Active Stations"
  - Number
- Card: "Active Users"
  - Number

~~**Charts Section:**~~ (Requires backend aggregation - Phase 4)
~~- Line chart: "Bookings Over Time"~~
~~- Bar chart: "Revenue by Station"~~
~~- Pie chart: "Booking Status Distribution"~~

**Recent Bookings Table:**
- Columns: Booking ID, User, Station, Time, Amount, Status
- Rows: Last 10 bookings
- Link: "View All Bookings"

**Quick Actions:**
- Button: "Add New Station"
- Button: "Generate Slots"
- Button: "View All Bookings"

---

#### 3.2 Admin Stations List `/admin/stations`

**Purpose:** Manage all stations

**Components:**

**Header:**
- Title: "Stations"
- Button: "Add New Station"
- Search input: "Search stations..."
- Dropdown filter: "Status" (All, Active, Inactive)

**Stations Table:**
- Columns:
  - ID
  - Name
  - Address (truncated)
  - Total Slots
  - Available Now
  - Price/Hour
  - Status (badge: Active/Inactive)
  - Actions
- Actions per row:
  - Button: "Edit" (icon)
  - Button: "View Slots" (icon)
  - Button: "Deactivate/Activate" (toggle icon)
  - Button: "Delete" (icon, with confirmation)

**Pagination:**
- Page numbers
- Items per page dropdown: 10, 20, 50

**Export:**
- ~~Button: "Export to CSV"~~ (Not implemented in v1)

**Empty State:**
- Text: "No stations found"
- Button: "Add First Station"

---

#### 3.3 Add/Edit Station Page `/admin/stations/new` or `/admin/stations/:id/edit`

**Purpose:** Create or modify station

**Components:**

**Form Fields:**
- Input: "Station Name" *
- Textarea: "Address" *
- Input: "Latitude" * (with map picker)
- Input: "Longitude" * (with map picker)
- Button: "Pick on Map"
- Textarea: "Description"
- Input: "Total Slots" * (number)
- Input: "Price per Hour" * (₹)
- Checkboxes: "Connector Types" * (CCS2, CHAdeMO, Type 2, GB/T)
- Toggle: "Active" (default: On)

**Map Preview:**
- Shows selected location
- Draggable marker

**Actions:**
- Button: "Save Station"
- Button: "Cancel"

**Validation:**
- Required fields marked with *
- Real-time validation errors

---

#### 3.4 Station Slots Page `/admin/stations/:id/slots`

**Purpose:** Manage slots for a station

**Components:**

**Header:**
- Back button
- Station name
- Button: "Generate New Slots"

**Date Selector:**
- Date picker: Select date to view
- Button: "Today"
- Button: "Tomorrow"

**Slots Grid/List:**
Each slot shows:
- Time: "2:00 PM - 3:00 PM"
- Status badge: Available/Reserved/Booked/Unavailable
- Booking ID (if booked): "#5001"
- Actions:
  - Button: "Mark Unavailable" (if available)
  - Button: "Mark Available" (if unavailable)
  - Button: "View Booking" (if booked)

**Bulk Actions:**
- Checkbox: "Select All"
- Button: "Mark Selected as Unavailable"
- Button: "Delete Selected Slots"

**Stats Summary:**
- Total slots: 24
- Available: 15
- Booked: 6
- Reserved: 2
- Unavailable: 1

---

#### 3.5 Generate Slots Modal

**Components:**
- Input: "Start Date" *
- Input: "End Date" *
- Input: "Slot Duration (minutes)" * (default: 60)
- Input: "Operating Hours Start" * (dropdown: 00:00-23:00)
- Input: "Operating Hours End" * (dropdown: 01:00-24:00)
- Preview: "This will generate approximately 192 slots"
- Button: "Generate Slots"
- Button: "Cancel"

**Success Message:**
- Text: "Generated 192 slots (0 skipped)"
- Button: "View Slots"

---

#### 3.6 Admin Bookings List `/admin/bookings`

**Purpose:** View and manage all bookings

**Components:**

**Filters Bar:**
- Dropdown: "Status" (All, Pending, Confirmed, Completed, Cancelled)
- Date picker: "From Date"
- Date picker: "To Date"
- Dropdown: "Station" (All stations + individual)
- Search: "Booking ID or User Email"
- Button: "Apply Filters"
- Button: "Clear Filters"

**Bookings Table:**
- Columns:
  - Booking ID
  - User (name + email)
  - Station
  - Date & Time
  - Amount
  - Status (badge)
  - Payment Status (badge)
  - Actions
- Actions per row:
  - Button: "View Details" (icon)
  - Button: "Cancel Booking" (icon, with confirmation)
  - ~~Button: "Refund"~~ (Manual/out-of-band process in v1)

**Pagination:**
- Same as stations table

~~**Export:**~~ (Not implemented in v1)
~~- Button: "Export to CSV"~~

---

#### 3.7 Admin Booking Details `/admin/bookings/:id`

**Purpose:** Detailed view with admin actions

**Components:**

**All sections from User Booking Details, plus:**

**Admin Actions Section:**
- Button: "Cancel Booking" (with reason input)
- ~~Button: "Issue Refund"~~ (Manual process in v1)
- ~~Button: "Mark as No-Show"~~ (Not implemented in v1)
- ~~Button: "Contact User"~~ (Manual process in v1)

~~**Admin Notes:**~~ (Not implemented in v1)
~~- Textarea: "Add internal note"~~

~~**Activity Log:**~~ (Audit logging was explicitly cut from scope)
~~- Timeline of all actions~~

---

~~#### 3.8 Admin Users List `/admin/users`~~ (Not Implemented in v1)

~~**Purpose:** View and manage users~~ (No backend endpoint exists)

~~**Components:**~~

~~**Header:**~~
~~- Title: "Users"~~
~~- Search: "Search by name or email"~~

~~**Users Table:**~~
~~- Columns:~~
  ~~- ID~~
  ~~- Name~~
  ~~- Email~~
  ~~- Phone~~
  ~~- Role (badge: USER/ADMIN)~~
  ~~- Total Bookings~~
  ~~- Member Since~~
  ~~- Status (Active/Inactive)~~
  ~~- Actions~~
~~- Actions:~~
  ~~- Button: "View Bookings"~~
  ~~- Button: "Deactivate/Activate"~~

---

### **4. SHARED COMPONENTS**

#### 4.1 Navigation Bar

**Public (Not Logged In):**
- Logo (left)
- Links: Find Stations, About, Contact
- Buttons: Login, Sign Up (right)

**User (Logged In):**
- Logo (left)
- Links: Find Stations, My Bookings, AI Chat
- Icon: Profile Dropdown (right)
(No notification bell - notifications are ephemeral WebSocket only)

**Admin (Logged In):**
- Logo (left)
- Links: Dashboard, Stations, Bookings
- Icon: Profile Dropdown (right)
(No Users link - not implemented in v1)
(No notification bell - not implemented)

#### 4.2 Profile Dropdown Menu

**User:**
- Link: "My Profile"
- Link: "My Bookings"
- Link: "Settings"
- Divider
- Link: "Logout"

**Admin:**
- Link: "My Profile"
- Link: "Admin Dashboard"
- Link: "Settings"
- Divider
- Link: "Logout"

#### ~~4.3 Notification Panel~~ (Not in v1 - WebSocket only)

**What Actually Works:**
- WebSocket push messages (ephemeral, not stored)
- Messages appear as browser notifications or toast
- No notification center/inbox
- No persistence or read/unread tracking

**WebSocket Message Types (ephemeral only):**
- Booking confirmed
- Payment successful
- Booking cancelled

(Full notification center is Phase 4 - needs backend table + API)

#### 4.4 Loading States

**Components:**
- Skeleton loaders for lists/cards
- Spinner for buttons
- Progress bar for file uploads
- Text: "Loading..." where appropriate

#### 4.5 Error States

**Components:**
- Error icon
- Error message
- Button: "Try Again" or "Go Back"

#### 4.6 Empty States

**Components:**
- Illustration/icon
- Heading: "No items found"
- Description text
- CTA button (contextual)

#### 4.7 Confirmation Modals

**Components:**
- Heading: Question
- Body text: Explanation
- Warning text (if destructive action)
- Button: "Confirm" (danger style for destructive)
- Button: "Cancel" (default style)

---

## 📊 Responsive Breakpoints

### Desktop (1024px+)
- Full sidebar navigation
- Multi-column layouts
- Expanded tables
- ~~Map + list side-by-side~~ (Map integration is Phase 3)

### Tablet (768px - 1023px)
- Collapsible sidebar
- 2-column layouts where possible
- Horizontal scrolling tables

### Mobile (< 768px)
- Bottom navigation bar
- Single column layout
- Stacked components
- Hamburger menu
- Swipeable tabs

---

## 🔔 Real-time Features (WebSocket)

### What Actually Works (v1):

1. **Booking Confirmation:**
   - WebSocket message sent when payment confirmed
   - Show browser notification or toast
   - Auto-refresh booking list

2. **Booking Cancellation:**
   - WebSocket message sent when cancelled
   - Show notification

**What Doesn't Work Yet:**
- ~~Slot availability updates~~ (Future)
- ~~Notification center~~ (No backend)
- ~~Admin dashboard live updates~~ (Future)

---

## ~~📱 Progressive Web App (PWA) Features~~ (Explicitly out of scope for v1)

PWA features were cut from scope per `00_overview.md`. Phase 4 if needed:
- ~~Add to Home Screen~~
- ~~Offline mode~~
- ~~Push notifications~~

---

## 🎨 Component States

### Buttons:
- Default
- Hover
- Active/Pressed
- Disabled
- Loading (spinner)

### Form Inputs:
- Empty
- Filled
- Focused
- Error
- Disabled
- Success (with checkmark)

### Cards:
- Default
- Hover (if clickable)
- Selected/Active
- Disabled

### Status Badges:
- Confirmed (success color)
- Pending (warning color)
- Cancelled (error color)
- Completed (neutral color)

---

## 📋 Form Validation Rules

### Email:
- Format: valid email
- Real-time validation
- Error: "Invalid email format"

### Password:
- Min length: 8 characters
- Must include: uppercase, lowercase, number
- Strength indicator: Weak/Medium/Strong
- Error: specific requirement not met

### Phone:
- Format: 10 digits
- Optional country code
- Error: "Invalid phone number"

### Required Fields:
- Show * marker
- Error: "[Field] is required"

### Number Inputs:
- Min/max validation
- Error: "Must be between X and Y"

---

## 🔗 URL Structure Summary

```
Public:
/                          - Landing page
/stations/search           - Search results
/stations/:id              - Station details
/login                     - Login
/signup                    - Sign up
/forgot-password           - Password reset
/b/:shortCode              - Short URL redirect

User:
/dashboard                 - User dashboard
/bookings                  - My bookings
/bookings/:id              - Booking details
/bookings/:id/payment      - Payment page
/ai-chat                   - AI assistant
/profile                   - User profile
/profile/settings          - Settings

Admin:
/admin                     - Admin dashboard
/admin/stations            - Stations list
/admin/stations/new        - Add station
/admin/stations/:id/edit   - Edit station
/admin/stations/:id/slots  - Manage slots
/admin/bookings            - All bookings
/admin/bookings/:id        - Booking details (admin view)
~~/admin/users~~           - ~~Users list~~ (not implemented in v1)
```

---

## 🎯 Priority Levels for Implementation

### Phase 1 (MVP - Backend Ready):
1. ✅ Landing page
2. ✅ Login/Signup
3. ✅ Station search + details
4. ✅ Booking flow (create → pay → confirm)
5. ✅ My Bookings page
6. ✅ Profile page (basic)

### Phase 2 (Backend Partially Ready):
7. ✅ Admin stations management (CRUD ready)
8. 🔄 Admin dashboard (needs aggregation backend)
9. 🔄 Admin bookings management (partial)
10. ✅ AI assistant (Claude only, basic)

### Phase 3 (Enhancement - Frontend Only):
11. Advanced filters
12. Map view integration
13. Better mobile UX

### Phase 4 (Needs Backend Work):
14. Notification center (needs backend table + API)
15. Payment timer/expiry (needs scheduled job)
16. Refund UI (needs refund API)
17. Analytics/Charts (needs aggregation endpoints)
18. CSV export (needs backend)
19. Admin notes/activity log (needs audit system)
20. PWA features
21. Users management page

---

## 💡 Interaction Patterns

### Search Flow:
1. User enters location OR clicks "Use My Location"
2. Select radius
3. Click "Search"
4. Shows loading skeleton
5. Displays results list
6. User can filter/toggle map

### Booking Flow:
1. Select station from search
2. Choose date
3. Choose time slot
4. Click "Book"
5. Login if not authenticated
6. Review booking summary
7. Complete payment (Razorpay modal)
8. See success message
9. Redirect to booking details

### Payment Flow:
1. Review order summary
2. Accept terms
3. Click "Proceed to Payment"
4. Razorpay modal opens
5. User completes payment
6. Modal closes
7. Success message shown
8. Booking confirmed (WebSocket update)

---

## 📱 Mobile-Specific Considerations

### Bottom Navigation (Mobile):
- Icon: Home → Dashboard
- Icon: Search → Find Stations
- Icon: Bookings → My Bookings  
- Icon: Chat → AI Assistant
- Icon: Profile → Profile

### Gestures:
- Swipe left/right: Navigate between tabs
- Pull to refresh: Update booking list
- Swipe to delete: Remove notification

### Mobile Optimizations:
- Larger tap targets (44px minimum)
- Sticky headers
- Bottom sheets for modals
- Floating action buttons

---

## ✅ Checklist for Designer

For each page, ensure:
- [ ] All required components listed
- [ ] All button actions defined
- [ ] Form fields with validation rules
- [ ] Error states designed
- [ ] Empty states designed
- [ ] Loading states designed
- [ ] Mobile responsive layout
- [ ] Tablet layout (if different)
- [ ] Accessibility considerations
- [ ] Icon choices documented

---

---

## ⚠️ WHAT'S ACTUALLY READY vs WHAT NEEDS WORK

### ✅ Backend Ready (Build These First):
- **Pages:** 15 pages with full backend support
- Landing, Login/Signup
- Station search + details
- Booking flow (create → payment → confirm)
- My Bookings (all tabs)
- Booking details + cancellation
- Profile (basic fields)
- Admin: Stations CRUD
- Admin: Stations slots management

### 🔄 Backend Partially Ready:
- AI Assistant (Claude only, no tools)
- Admin Dashboard (stats only, no charts)
- Admin Bookings (list only, no actions)

### ❌ Backend Not Ready (Phase 4):
- Notification center (no table/API)
- Payment expiry timer (no scheduled job)
- Refunds UI (manual process only)
- Charts/Analytics (no aggregation API)
- CSV export (no endpoint)
- Activity log (audit logging cut from scope)
- Users management (no endpoint)
- PWA features (out of scope)

---

## 🎯 Corrected Totals

**Actually Ready Pages:** ~15 pages (v1 scope)  
**Need Backend Work:** ~10 features (Phase 4)  
**Components:** ~35 reusable components  

---

## 💡 Recommendations

1. **Use v0.dev** instead of Stitch if you're comfortable with code - it outputs React+Tailwind directly
2. **Start with Phase 1** (15 pages) - everything is backend-ready
3. **Skip Phase 4 features** in design until backend is built
4. **Use browser notifications** for WebSocket (no notification center needed)
5. **Keep payment flow simple** (no timer, no platform fee)

This **corrected spec** now matches your **actual working backend**! 🎯

