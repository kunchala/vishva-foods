// =============================================================
// VISHVA FOODS — Vercel serverless function
// All /api/* requests are routed here (see vercel.json). Exports
// the Express app as the handler; Vercel's @vercel/node wraps it.
// The static frontend is served by Vercel directly from dist/public.
// =============================================================
import "dotenv/config";
import { createApiApp } from "../server/app.js";

const app = createApiApp();

export default app;
