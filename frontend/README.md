# Restaurant Management System — Frontend

A Next.js (App Router) + TypeScript frontend for the open-source restaurant management platform. Designed for touchscreens, tablets, and desktop POS systems.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui (Radix-based) |
| State | Zustand |
| HTTP | Axios |
| Realtime | socket.io-client |
| Forms | React Hook Form |
| Charts | Recharts |

---

## Setup

### Prerequisites

- Node.js 18+
- The backend running (see root `README.md` or `docker-compose.yml`)

### Install dependencies

```bash
cd frontend
npm install
```

### Environment variables

Copy `.env.example` and adjust:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3000` | Backend WebSocket URL |
| `NEXT_PUBLIC_TAX_RATE` | `0.08` | Tax rate (8%) |

---

## Running the Dev Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or port 3000 if backend is not running).

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |

---

## Running with the Backend (Docker Compose)

From the root of the repo:

```bash
docker-compose up --build
```

The frontend is not yet dockerized by default. To add it, create a `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

And add to `docker-compose.yml`:

```yaml
frontend:
  build: ./frontend
  ports:
    - "3001:3000"
  environment:
    - NEXT_PUBLIC_API_BASE_URL=http://api:3000/api/v1
    - NEXT_PUBLIC_WS_URL=http://api:3000
  depends_on:
    - api
```

---

## Login Flow

1. User navigates to `/login`.
2. Submits email + password via React Hook Form.
3. `authStore.login()` calls `POST /api/v1/auth/login`.
4. JWT access token + refresh token are stored in `localStorage` (via `utils/storage.ts`).
5. Axios request interceptor attaches `Authorization: Bearer <token>` to every API call.
6. On 401 responses, the interceptor clears credentials and redirects to `/login`.
7. `useRoleGuard(allowedRoles)` hook protects pages — unauthorized users are redirected.

### Roles

| Role | Access |
|---|---|
| `admin` | All pages |
| `manager` | All pages |
| `server` | POS, Tables, Orders, Reservations |
| `chef` | Orders, Prep, Inventory |
| `cashier` | POS, Orders |

---

## How Realtime Events Update the UI

The `useSocket` hook (used in the root layout) connects to the backend via Socket.io with the JWT as auth:

```
services/websocket.ts  →  io(WS_URL, { auth: { token } })
```

Events subscribed and their effects:

| Event | Effect |
|---|---|
| `order.created` | Adds order to `orderStore.activeOrders` |
| `order.updated` | Updates order in `orderStore.activeOrders` |
| `table.updated` | Updates table in `tableStore.tables` |
| `inventory.low_stock` | Adds alert to `inventoryStore.alerts` |
| `inventory.expiring` | Adds alert to `inventoryStore.alerts` |
| `notification.new` | *(hook wired, UI notification panel coming)* |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home dashboard |
| `/login` | Authentication |
| `/pos` | Touch-first POS terminal |
| `/tables` | Restaurant floor layout |
| `/orders` | Live order tracking |
| `/menu` | Menu CRUD management |
| `/reservations` | Booking management |
| `/inventory` | Stock & expiry tracking |
| `/prep` | Kitchen prep logging |
| `/reports` | Sales analytics with Recharts |
| `/kitchen` | **Kitchen Display System (KDS)** |
| `/kitchen/settings` | KDS settings panel |
| `/kitchen/ticket-view/:orderId` | Dedicated full-screen ticket focus |
| `/kitchen/recipe-view/:recipeId` | Full-screen recipe viewer |

---

## Folder Structure

```
frontend/
  app/                    Next.js App Router pages
    (auth)/login/         Login page (no nav wrapper)
    pos/                  POS terminal
    tables/               Table manager
    menu/                 Menu CRUD
    orders/               Order tracking
    reservations/         Reservation viewer
    inventory/            Inventory viewer
    prep/                 Prep manager
    reports/              Reports & charts
  components/
    pos/                  MenuItemButton, OrderCart, PaymentModal
    tables/               TableCard
    reservations/         ReservationCard
    inventory/            InventoryTable
    shared/               TopNav, StatusBadge
    ui/                   Button, Card, Input, Label, Badge, Separator
  services/               Axios API modules per domain
  stores/                 Zustand stores
  hooks/                  useAuth, useSocket, useRoleGuard, useOfflineQueue
  utils/                  money, dates, cn, pagination, storage, sampleData
  types/                  TypeScript interfaces
  config/                 env.ts, routes.ts
  styles/                 globals.css (Tailwind + CSS vars)
```

---

## Offline Fallback (Scaffold)

The `useOfflineQueue` hook (`hooks/useOfflineQueue.ts`) provides:

- Detects browser online/offline state.
- `enqueue(action)` — stores POS actions (create order, add item, payment) in `localStorage` when offline.
- `replayQueue(executor)` — replays queued actions when back online.
- Integrated in `/pos` page with a banner when offline.

---

## Future Expansion

| Platform | Notes |
|---|---|
| **Waiter Mobile App** | PWA with `/tables` and `/orders` — add `manifest.json` + service worker |
| **Admin Dashboard** | Add `/admin` route group, role-guarded to `admin`/`manager` |
| **Online Ordering** | Public-facing `/order` route, no auth required, connects to same API |
| **Multi-language** | Add `next-intl` for i18n |
| **Dark Mode** | Tailwind `dark:` classes already wired via CSS variables |

---

## Kitchen Display System (KDS)

The KDS is a full-screen, touchscreen-first interface for kitchen staff at `/kitchen`.

### Features

- **Live ticket board** — shows all active orders as large colored cards
- **Color-coded status** — gray (new), yellow (preparing), green (ready), red/flashing (overdue), blue (completed)
- **Live timers** — elapsed time + countdown to due time on every ticket
- **Priority badges** — Normal / ⚡ Rush / ⭐ VIP / 🍽 Large Order
- **Station filtering** — Grill / Fryer / Salad / Dessert / Drinks / Prep / Bar
- **Recipe viewer** — tap a menu item to open full-screen recipe with ingredients + instructions
- **Sound alerts** — beep on new order, overdue, or rush order (Web Audio API)
- **Offline mode** — caches tickets in localStorage; queues start/ready/complete actions and replays on reconnect
- **Settings panel** at `/kitchen/settings` — station filter, sound toggles, layout density, ticket size, dark mode (persisted to localStorage)

### Navigation

The KDS layout intentionally hides the global `TopNav` so the entire screen is used for tickets. The `KitchenHeader` provides a minimal clock, ticket counts, mute toggle, connection indicator, and link to settings.

### WebSocket events

Both naming conventions are supported for compatibility with different backend versions:

| Dot format | Underscore format | Effect |
|---|---|---|
| `order.created` | `order_created` | New ticket added to board, sound played |
| `order.updated` | `order_updated` | Ticket updated in place |
| `order.cancelled` | `order_cancelled` | Ticket removed from board |
| `order.ready` | `order_ready` | Ticket status updated |

### API endpoints used

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/orders/active` | Load all active tickets on mount |
| `PUT` | `/orders/:id/status` | Update order status (preparing / ready / served / completed) |
| `GET` | `/recipes/:id` | Fetch recipe details for the viewer |
| `POST` | `/kitchen/start` | Notify backend to begin prep (deducts inventory) |
| `POST` | `/kitchen/complete` | Notify backend of completion (tracks usage) |

### Env vars (no additions needed)

The KDS uses the same env vars as the rest of the frontend:

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend REST API |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3000` | WebSocket server |

### Offline mode behavior

1. When the browser goes offline, a banner appears on the KDS board.
2. Any Start / Ready / Complete action is **queued** in `localStorage` (`rms_kitchen_offline_queue`).
3. Active tickets are **cached** to `localStorage` (`rms_kitchen_ticket_cache`).
4. On reconnect the queue is **replayed** sequentially; failures halt the replay until the next online cycle.
5. The cache is loaded as fallback if the API fails on mount.

### Folder structure additions

```
frontend/
  app/kitchen/
    layout.tsx                        # Full-screen KDS layout (no TopNav)
    page.tsx                          # Main KDS board
    settings/page.tsx                 # Settings panel
    ticket-view/[orderId]/page.tsx    # Dedicated ticket focus view
    recipe-view/[recipeId]/page.tsx   # Full-screen recipe viewer
  components/kitchen/
    KitchenHeader.tsx                 # Sticky header: clock, counts, mute, settings link
    KitchenTicket.tsx                 # Single ticket card with status buttons
    TicketTimer.tsx                   # Live elapsed / remaining countdown
    RecipeViewer.tsx                  # Full-screen recipe overlay
    StationFilter.tsx                 # Station pill filter bar
    OrderStatusBadge.tsx              # Colored status label
    SoundAlert.tsx                    # Web Audio API beep sequences
    TicketGrid.tsx                    # Responsive grid sorted by urgency
  services/
    kitchen.api.ts                    # Axios methods for KDS endpoints
  stores/
    kitchenStore.ts                   # Zustand store with offline queue + localStorage settings
  types/
    kitchen.ts                        # KDS TypeScript types
```

---



- Sample data (`utils/sampleData.ts`) is used as fallback when the API is unreachable — useful for frontend development without the backend running.
- All API service functions return Axios `AxiosResponse<T>` — use `.data` to access the payload.
- Zustand stores use direct state mutation patterns (Immer not required).
