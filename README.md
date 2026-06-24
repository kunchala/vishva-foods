# Vishva Foods 🍛

**The World on Your Plate** — a 100% vegetarian Indian food ordering site for a home
(cloud) kitchen in Ashburn, VA. Order online for pickup or delivery, pay with Stripe,
and dispatch a courier through DoorDash Drive or Uber Direct.

```bash
npm install
cp .env.example .env
npm run dev        # → http://localhost:3000  (runs in mock mode with no keys)
```

Full setup, the real story on DoorDash/Uber/Grubhub, and deployment are in
**[SETUP.md](./SETUP.md)**.

## Stack
React 19 + Vite · Tailwind 4 + shadcn/ui · Express · Supabase (Postgres + RLS) ·
Stripe Payment Element · DoorDash Drive / Uber Direct · Resend.

## Scripts
| | |
|---|---|
| `npm run dev` | Dev server (Express + Vite, single process, HMR) |
| `npm run build` | Build client + bundle server into `dist/` |
| `npm start` | Run the production build |
| `npm run check` | TypeScript type-check |

## Status
Complete and building. Runs in safe/mock mode out of the box; add the credentials in
`.env` (Supabase, Stripe, a courier, Resend) to take real orders. See SETUP.md §3.
