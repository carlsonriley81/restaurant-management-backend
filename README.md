# 🍽️ Restaurant Management Backend

A complete, production-ready open-source backend for restaurant management platforms built with **NestJS**, **PostgreSQL** (via Prisma ORM), **Socket.io** WebSockets, **BullMQ** background jobs, and **JWT** authentication with RBAC.

## ✨ Features

- **18 REST API Modules** — orders, menu, inventory, kitchen, tables, reservations, and more
- **Real-time WebSockets** — Socket.io events for orders, kitchen, tables, and inventory
- **Background Jobs** — BullMQ + Redis for async processing
- **JWT Auth + RBAC** — Access tokens (15min), refresh tokens (7d), role-based access control
- **Swagger Docs** — Interactive API docs at `/api/docs`
- **Docker** — Dockerfile + docker-compose with Postgres + Redis
- **Prisma ORM** — Full PostgreSQL schema with migrations and seed data

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Restaurant Management API                     │
├────────────┬───────────┬───────────────┬────────────────────────┤
│  POS App   │  Waiter   │    Kitchen    │     Admin Panel        │
│  (tablet)  │  (mobile) │   Display     │     (web)              │
└─────┬──────┴─────┬─────┴───────┬───────┴──────────┬─────────────┘
      │            │             │                  │
      └────────────┴─────────────┴──────────────────┘
                          │
                   NestJS REST API
                   Socket.io Gateway
                          │
           ┌──────────────┼──────────────┐
           │              │              │
      PostgreSQL        Redis         File
      (Prisma)        (BullMQ)      Storage
```

---

## 🗂️ Modules

| Module | Endpoint | Description |
|---|---|---|
| `auth` | `/api/auth` | JWT login/register/refresh/logout |
| `menu` | `/api/menu` | Menu items CRUD + categories |
| `orders` | `/api/orders` | Order lifecycle + payment |
| `inventory` | `/api/inventory` | Stock tracking + alerts |
| `kitchen` | `/api/kitchen` | Kitchen display tickets |
| `tables` | `/api/tables` | Floor plan + table status |
| `employees` | `/api/employees` | HR + scheduling |
| `payroll` | `/api/payroll` | Pay stubs + hours |
| `recipes` | `/api/recipes` | Recipe management + scaling |
| `prep` | `/api/prep` | Prep log + inventory deduction |
| `trucks` | `/api/trucks` | Delivery tracking |
| `reservations` | `/api/reservations` | Booking system |
| `discounts` | `/api/discounts` | Promo codes + validation |
| `reports` | `/api/reports` | Sales/inventory/employee reports |
| `pos` | `/api/pos` | POS dashboard + stats |
| `waitstaff` | `/api/waitstaff` | Server-scoped view |
| `receipts` | `/api/receipts` | Receipt generation |
| `notifications` | `/api/notifications` | Role-based alerts |

---

## 🔐 Roles

| Role | Access |
|---|---|
| `ADMIN` | Full system access |
| `MANAGER` | All except system config |
| `CHEF` | Kitchen, orders, inventory |
| `SERVER` | Tables, orders, waitstaff |
| `CASHIER` | POS, orders, discounts |
| `DRIVER` | Trucks, deliveries |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### 1. Clone & install

```bash
git clone https://github.com/carlsonriley81/restaurant-management-backend.git
cd restaurant-management-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database and Redis settings
```

### 3. Database setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Start the server

```bash
# Development
npm run start:dev

# Production
npm run build && npm run start:prod
```

API: `http://localhost:3000/api`  
Swagger: `http://localhost:3000/api/docs`

---

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# With pgAdmin (localhost:5050)
docker-compose --profile tools up -d

# View logs
docker-compose logs -f api
```

---

## 📡 API Examples (curl)

### Authentication

```bash
# Login (seed credentials)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@restaurant.com", "password": "admin123"}'

# Register new employee
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John", "lastName": "Doe",
    "email": "john@restaurant.com",
    "password": "password123",
    "role": "SERVER", "hourlyWage": 12
  }'

# Refresh access token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### Menu

```bash
# List menu items
curl http://localhost:3000/api/menu -H "Authorization: Bearer TOKEN"

# Filter by category
curl "http://localhost:3000/api/menu?category=Burgers" -H "Authorization: Bearer TOKEN"

# Create menu item
curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Classic Burger","price":12.99,"category":"Burgers","active":true}'
```

### Orders

```bash
# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{
    "tableId": "TABLE_ID",
    "customerName": "Jane Smith",
    "items": [{"menuItemId": "ITEM_ID", "quantity": 2}]
  }'

# Update status
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"status": "ACCEPTED"}'

# Process payment
curl -X POST http://localhost:3000/api/orders/ORDER_ID/payment \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"paymentMethod": "CREDIT", "tipAmount": 5.00}'
```

### Inventory

```bash
# List inventory
curl http://localhost:3000/api/inventory -H "Authorization: Bearer TOKEN"

# Low stock items
curl "http://localhost:3000/api/inventory?lowStock=true" -H "Authorization: Bearer TOKEN"

# Adjust quantity
curl -X PATCH http://localhost:3000/api/inventory/ITEM_ID/quantity \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"quantity": 25}'
```

### Tables

```bash
# Get all tables
curl http://localhost:3000/api/tables -H "Authorization: Bearer TOKEN"

# Update table status
curl -X PATCH http://localhost:3000/api/tables/TABLE_ID/status \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"status": "SEATED"}'
```

### Reports

```bash
# Sales report
curl "http://localhost:3000/api/reports/sales?period=daily" \
  -H "Authorization: Bearer TOKEN"

# Inventory report
curl http://localhost:3000/api/reports/inventory \
  -H "Authorization: Bearer TOKEN"
```

---

## ⚡ WebSocket Events

Connect to `ws://localhost:3000/events`:

```javascript
const socket = io('http://localhost:3000/events', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

// Listen for events
socket.on('order.updated', ({ orderId, status }) => console.log(orderId, status));
socket.on('kitchen.ticket.new', ({ orderId, items }) => console.log('New ticket:', orderId));
socket.on('table.updated', ({ tableId, status }) => console.log('Table:', tableId, status));
socket.on('inventory.low_stock', ({ productName, quantityOnHand }) => console.warn('Low:', productName));
socket.on('reservation.reminder', (data) => console.log('Reminder:', data));
socket.on('notification.new', ({ title, message }) => alert(`${title}: ${message}`));
```

### Events Reference

| Event | Trigger | Roles |
|---|---|---|
| `order.updated` | Order status change | All |
| `kitchen.ticket.new` | New order placed | CHEF, ADMIN, MANAGER |
| `table.updated` | Table status change | All |
| `inventory.low_stock` | Stock below threshold | ADMIN, MANAGER |
| `reservation.reminder` | Upcoming reservation | ADMIN, MANAGER, SERVER |
| `notification.new` | New notification | Targeted role |

---

## 🧪 Testing

```bash
npm run test          # Unit tests
npm run test:cov      # With coverage
npm run test:e2e      # End-to-end tests
npm run test:watch    # Watch mode
```

---

## 🗄️ Database Schema

18 Prisma models: `Employee`, `RefreshToken`, `MenuItem`, `Recipe`, `RecipeIngredient`, `InventoryItem`, `Order`, `OrderItem`, `KitchenTicket`, `Table`, `Reservation`, `ReservationTable`, `Discount`, `PrepLog`, `PrepLogInventory`, `Truck`, `TruckItem`, `Shift`, `Payroll`, `Receipt`, `Notification`

```bash
npx prisma migrate dev --name <migration-name>  # Create migration
npx prisma migrate deploy                        # Deploy (production)
npx prisma studio                                # Visual database explorer
```

---

## 🌱 Seed Data

Run `npm run prisma:seed` to populate:

| Account | Email | Password | Role |
|---|---|---|---|
| Admin | admin@restaurant.com | admin123 | ADMIN |
| Manager | manager@restaurant.com | manager123 | MANAGER |
| Chef | chef@restaurant.com | chef123 | CHEF |
| Server | server@restaurant.com | server123 | SERVER |

Also creates: 10 tables, 18 inventory items, 3 recipes, 10 menu items, 4 discount codes.

---

## 📁 Project Structure

```
src/
├── common/           # Guards, filters, interceptors, decorators
├── config/           # Configuration
├── gateway/          # Socket.io WebSocket gateway
├── modules/          # 18 feature modules
│   ├── auth/
│   ├── discounts/
│   ├── employees/
│   ├── inventory/
│   ├── kitchen/
│   ├── menu/
│   ├── notifications/
│   ├── orders/
│   ├── payroll/
│   ├── pos/
│   ├── prep/
│   ├── receipts/
│   ├── recipes/
│   ├── reports/
│   ├── reservations/
│   ├── tables/
│   ├── trucks/
│   └── waitstaff/
└── prisma/           # PrismaService
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Sample data
```

---

## 📖 License

MIT — Open source, free to use.
