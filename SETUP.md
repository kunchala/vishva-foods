# Vishva Foods — Setup & Deployment

A 100% vegetarian Indian ordering site. Customers order on **vishvaindianfoods.com**
for **pickup** or **delivery**; payment runs through **Stripe**; delivery orders
dispatch a courier through **DoorDash Drive** (or **Uber Direct**).

This is a single Node/Express app that serves the React frontend **and** the API.
One process, one deploy.

---

## 1. Run it locally (5 minutes, no accounts needed)

```bash
npm install
cp .env.example .env      # leave it mostly blank for now
npm run dev               # http://localhost:3000
```

With an empty `.env` everything still runs in **safe/mock mode**:

- Menu shows built-in seed dishes (no database needed yet)
- Delivery quotes return a flat **$4.99** (mock courier)
- Checkout shows a "payments not configured" notice instead of a broken card box

That lets you click through the whole site before signing up for anything.

---

## 2. The honest reality on delivery integrations

This matters, so it's worth being precise:

| Service | What it is | Can your site dispatch it? |
|---|---|---|
| **DoorDash Drive** | White-label courier API — a Dasher picks up *your* order and delivers it | ✅ **Yes.** Built in. Sandbox works immediately; production needs a quick approval. |
| **Uber Direct** | Uber's white-label courier API (commission-free) | ✅ **Yes.** Built in as a drop-in alternative. Sandbox immediately; production needs a short pilot. |
| **Uber Eats** | Uber's **marketplace** (customers browse inside the Uber Eats app) | ❌ Not a checkout integration. List your kitchen there; orders arrive via Uber's tablet/POS. Link out to it. |
| **Grubhub** | Marketplace only — no self-serve courier API for a small/home merchant | ❌ Not a checkout integration. List your kitchen there; link out to it. |

**What that means for you:** orders placed *on your own website* are delivered by
**DoorDash Drive or Uber Direct** — both fully wired here. Uber Eats / Grubhub /
DoorDash Marketplace are separate storefronts you list on; you don't dispatch them
from your checkout, you link customers to those listings. There is no API that lets
a brand-new home kitchen programmatically push orders into Grubhub's courier network —
anyone claiming otherwise is selling a middleware reseller, not a real Grubhub API.

You pick the active courier with one env var:

```
DELIVERY_PROVIDER=doordash   # or "uber", or "mock"
```

---

## 3. Going live — what to set up

Fill these into `.env`. Each is independent; add them as you go.

### a) Supabase (database) — required for real orders
1. Create a project at supabase.com.
2. **Project Settings → API** → copy:
   - Project URL → `SUPABASE_URL` **and** `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only — never the browser)
3. **SQL Editor** → run `supabase/migrations/001_init_schema.sql`, then
   `supabase/migrations/002_payment_fields.sql`.
4. (Optional) seed the menu: run the inserts in `supabase/seed.ts` (or add dishes in
   the Table editor). Until the `menu_items` table has rows, the site shows seed data.

### b) Stripe (payments) — required for checkout
1. Dashboard → **Developers → API keys** (start in **test mode**):
   - Secret key (`sk_test_…`) → `STRIPE_SECRET_KEY`
   - Publishable key (`pk_test_…`) → `VITE_STRIPE_PUBLISHABLE_KEY`
2. Webhook secret:
   - **Local:** `stripe login` then
     `stripe listen --forward-to localhost:3000/api/stripe/webhook`
     — copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
   - **Production:** Dashboard → Developers → Webhooks → add endpoint
     `https://vishvaindianfoods.com/api/stripe/webhook`, event
     `payment_intent.succeeded` → copy its signing secret.
3. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

> Note: payment also finalizes through a fallback on the confirmation page, so checkout
> works locally **even without** `stripe listen` running. The webhook is the
> production-grade path; the fallback is the dev convenience.

### c) DoorDash Drive (delivery) — when you want real couriers
1. Create a developer account at developer.doordash.com.
2. **Credentials** → create an Access Key → copy the three values:
   - `DOORDASH_DEVELOPER_ID`, `DOORDASH_KEY_ID`, `DOORDASH_SIGNING_SECRET`
3. Set `DELIVERY_PROVIDER=doordash` and fill the `RESTAURANT_*` pickup address.
4. New keys are **sandbox** (no real Dashers, free). Request production access in the
   portal when you're ready to take live orders.

### d) Uber Direct (alternative delivery)
1. Set up a Direct account (developer.uber.com/docs/deliveries → Get Started).
2. From the dashboard **Developer** tab copy: `UBER_DIRECT_CLIENT_ID`,
   `UBER_DIRECT_CLIENT_SECRET`, `UBER_DIRECT_CUSTOMER_ID`.
3. Set `DELIVERY_PROVIDER=uber`.

### e) Resend (email) — order confirmations
1. resend.com → API key → `RESEND_API_KEY`.
2. Verify your domain so you can send from `orders@vishvaindianfoods.com`
   (set `EMAIL_FROM`). Until then, emails are skipped (orders still work).

### f) Admin
Set `ADMIN_TOKEN` to any long random string. Open `/admin`, paste it in to see live
orders, advance order status, and toggle menu availability.

---

## 4. Deploy

The project is configured for **two** deploy styles. Pick one.

### Option A — Vercel (static frontend + serverless API)

`vercel.json` and the `api/` function are already set up. Vercel serves the React app
as static files and runs the Express API as one serverless function.

1. Push the project to GitHub (or use the Vercel CLI / drag-drop upload).
2. Import the repo in Vercel. Leave the framework preset as **Other** — `vercel.json`
   controls the build. (Don't override the Output Directory; the config sets it.)
3. **Environment Variables** (Project → Settings → Environment Variables) — add the
   same keys from your `.env`. Important: the `VITE_*` keys are read at **build time**,
   so they must be present before/at deploy. Add all of them to *Production* (and
   *Preview* if you use it):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
     `STRIPE_WEBHOOK_SECRET`, `DELIVERY_PROVIDER`, the `DOORDASH_*` / `UBER_DIRECT_*`
     set, `RESTAURANT_*`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_TOKEN`
4. Deploy. The site loads even with no env (mock mode); add keys to light up features.
5. Stripe webhook: add an endpoint at `https://<your-app>.vercel.app/api/stripe/webhook`
   for `payment_intent.succeeded`. (Even if the webhook isn't set up, payments still
   finalize — the confirmation page calls a server fallback that verifies the
   PaymentIntent directly. The webhook just adds server-push reliability.)

> Note: with no env, a fresh Vercel deploy now shows the **website** (not a JS file).
> If you previously saw raw server code, that was Vercel serving the old build output;
> this version fixes it via `vercel.json`.

### Option B — Render / Railway / Fly.io (single Node service, no code changes)

Because `server/index.ts` serves both the API and the built frontend, you can run the
whole thing as one Node process:

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Env vars:** paste everything from your `.env`
- Stripe webhook → `https://<your-host>/api/stripe/webhook`

This needs zero restructuring and is the simplest mental model. Render has a free tier.

---

Either way: point `vishvaindianfoods.com` (Namecheap DNS) at the host, then switch
Stripe to live keys and DoorDash/Uber to production credentials when you're ready.

---

## 5. How the order flow works (for reference)

1. Customer fills contact + fulfillment. Delivery shows a **live courier quote**
   (`POST /api/delivery/quote`).
2. "Continue to payment" creates a **pending order** server-side
   (`POST /api/orders`, service-role key — so guest checkout works under RLS) and a
   **Stripe PaymentIntent** with wallets enabled (card, Apple Pay, Google Pay, Link).
3. Customer pays in the Stripe Payment Element → redirected to `/confirm/:id`.
4. Payment success → order is **finalized** (idempotently, via webhook *and* the
   confirm-page fallback): marked paid, a courier is dispatched for delivery orders,
   and a confirmation email is sent.
5. `/track/:id` polls real order status; `/admin` manages everything.

---

## Project structure

```
client/            React app (Vite, Tailwind, shadcn/ui)
  src/pages/       Home, Menu, Checkout, OrderConfirm, Track, Admin
  src/lib/         supabase (graceful), stripe, menu seed data
server/            Express API + static host
  index.ts         entry: webhook (raw) → json → routes → Vite/static
  routes/          stripe, delivery, orders (+ admin)
  lib/
    delivery/      provider abstraction: doordash, uber, mock
    orders.ts      money path: create → finalize → dispatch → email
    ddJwt.ts       DoorDash JWT signer (no deps)
supabase/migrations/  001 schema, 002 payment fields
```
