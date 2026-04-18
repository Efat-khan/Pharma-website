# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bangladesh pharmacy eCommerce platform (Pharmaci) — NestJS API + Next.js 14 web frontend, PostgreSQL + Redis, all containerized via Docker Compose.

## Essential Commands

**All development happens through Docker — never run `npm install` on the host.**

```bash
# Start all services
docker compose up -d

# Rebuild API after source code changes (Windows volume mounts don't relay file events reliably)
docker compose build api && docker compose up -d --force-recreate api

# Rebuild web after source code changes
docker compose build web && docker compose up -d --force-recreate web

# Run a Prisma migration
docker exec pharmaci_api npx prisma migrate dev --name <migration_name>

# Apply existing migrations (after fresh start)
docker exec pharmaci_api npx prisma migrate deploy

# Regenerate Prisma client (after schema change)
docker exec pharmaci_api npx prisma generate

# Open a shell in the API container
docker exec -it pharmaci_api sh

# View API logs
docker logs -f pharmaci_api

# Start Prisma Studio (optional)
docker compose up prisma-studio
```

**Service URLs:**
- Web: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs
- Prisma Studio: http://localhost:5555

## Architecture

### Monorepo layout
```
apps/
  api/     NestJS 10, port 4000 — all business logic
  web/     Next.js 14 App Router, port 3000 — customer-facing UI
```

### API (`apps/api/src/`)
Feature-based NestJS modules: `auth`, `users`, `products`, `categories`, `cart`, `orders`, `payments`, `prescriptions`, `admin`, `notifications`. Global prefix is `/api/v1`.

- **`prisma/`** — singleton PrismaService, injected across all modules
- **`common/`** — shared decorators (`@CurrentUser`), guards (`JwtAuthGuard`, `RolesGuard`), and pipes
- **`auth/`** — OTP phone flow: `send-otp` → `verify-otp` → JWT pair issued. Refresh tokens stored in DB (table `RefreshToken`)
- **`cart/`** — server-side cart with 15-minute stock soft-hold (`CartItem.reservedUntil`)
- **`orders/`** — order numbers formatted `ARG-YYYY-XXXXXX`; address snapshot saved as JSON at placement time; stock decremented atomically
- **`notifications/`** — BullMQ queues for async SMS/email dispatch

### Web (`apps/web/src/`)
- **`app/(auth)/`** — login/register pages (no header/footer)
- **`app/(store)/`** — main storefront (home, products, cart, checkout, orders, account)
- **`app/admin/`** — admin dashboard
- **`lib/axios.ts`** — single Axios instance; base URL `/api/v1`; 401 interceptor auto-refreshes the access token and retries; redirects to `/login` on double failure
- **`store/auth.store.ts`** — Zustand store (persisted to localStorage); `setAuth()` writes tokens to cookies for the Axios interceptor
- **`app/providers.tsx`** — wraps app with React Query `QueryClientProvider` and Zustand

### Auth flow
1. POST `/api/v1/auth/send-otp` with `{ phone }`
2. POST `/api/v1/auth/verify-otp` with `{ phone, otp, name? }`
3. Response: `{ accessToken, refreshToken, user }`
4. Tokens stored in cookies (`accessToken` expires 15 min, `refreshToken` expires 7 days)
5. **Dev OTP is always `123456`** (bypassed when `NODE_ENV=development`)

### Data layer
- Prisma v5.22.0 — **do not upgrade to v6/v7** (v7 has breaking datasource syntax change)
- `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` required in `schema.prisma` for Alpine Linux containers
- Soft-delete users via `deletedAt` field; never hard-delete

## Key Rules

**Docker volumes:** Named volumes `api_node_modules`, `web_node_modules`, `web_next` in `docker-compose.yml` prevent host `node_modules` from overwriting container packages. Both `.dockerignore` files exclude `node_modules`. Do not revert to anonymous volume syntax.

**Prisma commands:** Always run inside the container (`docker exec pharmaci_api npx prisma ...`), never from the host.

**Windows hot reload:** NestJS `--watch` and Next.js dev server do not reliably pick up file changes from Windows host volumes. After editing backend code, rebuild + force-recreate the container. Frontend CSS/layout changes may require the same.

**Payment webhooks:** Never trust frontend payment callbacks — always verify via gateway webhooks (`/payments/webhook/bkash`, `/payments/webhook/sslcommerz`).

**Rate limits:** Auth endpoints have fine-grained throttle decorators (5 req/min for send-otp, 10 req/min for verify-otp) on top of the global 30 req/60s throttler.

**Roles:** `CUSTOMER`, `PHARMACIST`, `ADMIN` — enforced via `RolesGuard` + `@Roles()` decorator.

## Environment Variables

All variables are provided via `docker-compose.yml`. No `.env` file is required for local dev. External service placeholders to replace for production:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`
- `GREEN_WEB_BD_API_KEY`, `GREEN_WEB_BD_SENDER_ID`
- JWT secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`)
