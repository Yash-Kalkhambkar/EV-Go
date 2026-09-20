# Visual Page Requirements - EV Charging Platform

Pure functional specification. What needs to be on each page.

---

## PUBLIC PAGES

### 1. Landing Page `/`
- Hero heading text
- Hero subheading text
- Button: "Find Charging Stations"
- Button: "Sign Up Free"
- Search input box
- Button: "Use My Location"
- Dropdown: Select search radius (5km, 10km, 20km, 50km)
- Button: "Search Stations"
- 4 feature cards with icon + text
- Footer with links (About, Contact, Terms, Privacy)

### 2. Station Search Results `/stations/search`
- Back button
- Search summary text (e.g., "Found 12 stations within 10km")
- Filter button
- Filter panel:
  - Radius slider (5-50km)
  - Connector type checkboxes (CCS2, CHAdeMO, Type 2, GB/T)
  - Price range slider (₹0-₹200/hour)
  - "Available now" toggle
  - "Apply Filters" button
  - "Reset Filters" button
- Station cards showing:
  - Station name
  - Address
  - Distance
  - Price per hour
  - Available slots count
  - Connector type icons
  - "View Details" button
  - Map pin icon
- Toggle: "List View" / "Map View"
- Map with station markers
- Empty state: "No stations found" + "Expand Search Radius" button

### 3. Station Details `/stations/:id`
- Back button
- Station name
- Share button
- Address (full)
- Distance
- Price per hour
- Connector types list with icons
- Date picker
- Time slot grid showing:
  - Each slot with time range
  - Status (Available/Booked/Blocked)
  - Price
- Selected slot highlighted
- "Book This Slot" button
- Map showing station location
- Share modal:
  - Short URL text (copyable)
  - QR code image
  - "Copy Link" button
  - "Download QR" button

---

## AUTH PAGES

### 4. Login `/login`
- Logo
- Heading: "Welcome Back"
- Email input field
- Password input field
- "Forgot Password?" link
- "Login" button
- "Don't have an account? Sign up" link
- Error message area

### 5. Register `/register`
- Logo
- Heading: "Create Account"
- Name input field
- Email input field
- Phone number input field
- Password input field
- Confirm password input field
- "Register" button
- "Already have an account? Login" link
- Error message area

---

## USER DASHBOARD

### 6. Dashboard `/dashboard`
- Welcome message with user name
- "Upcoming Bookings" section:
  - Booking cards (max 3) showing:
    - Station name
    - Date and time
    - Status badge
    - "View Details" button
    - "Cancel" button
  - "View All Bookings" link
- Empty state: "No upcoming bookings" + "Find Stations" button

### 7. My Bookings `/bookings`
- Page heading: "My Bookings"
- Tabs: Upcoming | Pending Payment | Completed | Cancelled
- Booking cards showing:
  - Station name
  - Address
  - Date and time
  - Status badge
  - Amount
  - "View Details" button
- Empty state per tab
- Pagination controls

### 8. Booking Details `/bookings/:id`
- Back button
- Booking ID
- Status badge
- QR code
- Station details:
  - Name
  - Address
  - Map button
- Slot details:
  - Date
  - Time range
- Payment details:
  - Amount
  - Payment status
  - Transaction ID
- Action buttons:
  - "Cancel Booking" (if upcoming)
  - "Complete Payment" (if pending)
- Cancellation modal:
  - Reason dropdown
  - Confirm/Cancel buttons
  - Refund message: "Contact support"

### 9. Profile `/profile`
- Page heading: "My Profile"
- Profile info card:
  - Name (editable)
  - Email (editable)
  - Phone (editable)
  - Role badge
  - Member since date
- "Save Changes" button
- "Change Password" section:
  - Current password field
  - New password field
  - Confirm password field
  - "Update Password" button

### 10. AI Chat `/ai-chat`
- Page heading: "AI Assistant"
- Chat message list:
  - User messages (right-aligned)
  - AI responses (left-aligned)
  - Timestamps
- Message input box
- "Send" button
- Suggested action buttons:
  - "Find nearby stations"
  - "Check my bookings"
  - "Help with payment"
  - "Report an issue"
- Empty state: "Ask me anything about EV charging"

---

## ADMIN PAGES

### 11. Admin Stations List `/admin/stations`
- Page heading: "Manage Stations"
- "Add New Station" button
- Search input: "Search by name or location"
- Stations table:
  - Columns: ID, Name, Address, Connectors, Slots, Status, Actions
  - "Edit" button
  - "Manage Slots" button
  - "Delete" button (with confirmation)
- Pagination controls
- Empty state: "No stations found"

### 12. Add/Edit Station `/admin/stations/new` or `/admin/stations/:id/edit`
- Back button
- Page heading: "Add Station" or "Edit Station"
- Form fields:
  - Station name
  - Address
  - Latitude
  - Longitude
  - "Use Map" button (opens map picker)
  - Price per hour
  - Connector types (multi-select checkboxes)
- "Save Station" button
- "Cancel" button
- Map modal for selecting coordinates

### 13. Manage Slots `/admin/stations/:id/slots`
- Back button
- Station name heading
- "Generate Slots" button
- Date picker
- Slots table:
  - Columns: Date, Time, Status, Actions
  - "Edit" button
  - "Delete" button
- Pagination controls
- Generate slots modal:
  - Start date
  - End date
  - Start time
  - End time
  - Slot duration (minutes)
  - "Generate" button
  - "Cancel" button
- Edit slot modal:
  - Status dropdown
  - "Save" button

### 14. Admin Bookings List `/admin/bookings`
- Page heading: "All Bookings"
- Filters:
  - Status dropdown (All, Confirmed, Pending, Cancelled, Completed)
  - Date range picker
  - Search by booking ID or user
  - "Apply Filters" button
- Bookings table:
  - Columns: Booking ID, User, Station, Date/Time, Amount, Status, Payment Status, Actions
  - "View Details" button
  - "Cancel Booking" button (with confirmation)
- Pagination controls

### 15. Admin Booking Details `/admin/bookings/:id`
- Back button
- Booking ID
- Status badges (Booking Status + Payment Status)
- User info:
  - Name
  - Email
  - Phone
- Station info:
  - Name
  - Address
- Slot info:
  - Date
  - Time range
- Payment info:
  - Amount
  - Transaction ID
  - Razorpay Order ID
  - Razorpay Payment ID
  - Payment timestamp
- Action buttons:
  - "Cancel Booking" (with confirmation)
- Cancellation modal same as user side

---

## SHARED COMPONENTS

### Navigation Bar
**Public (not logged in):**
- Logo (left)
- Links: Find Stations, About, Contact
- Buttons: Login, Sign Up (right)

**User (logged in):**
- Logo (left)
- Links: Find Stations, My Bookings, AI Chat
- Profile dropdown (right):
  - My Profile
  - My Bookings
  - Settings
  - Logout

**Admin (logged in):**
- Logo (left)
- Links: Dashboard, Stations, Bookings
- Profile dropdown (right):
  - My Profile
  - Admin Dashboard
  - Settings
  - Logout

### Toast Notifications
- Success message (green)
- Error message (red)
- Info message (blue)
- Warning message (yellow)
- Auto-dismiss after 5 seconds
- Close button

### Loading States
- Skeleton cards for lists
- Spinner for buttons
- Full-page loader for navigation

### Empty States
- Icon
- Message text
- Action button (optional)

### Confirmation Modals
- Heading
- Message text
- "Confirm" button
- "Cancel" button

---

**Total: 15 pages + shared components**
