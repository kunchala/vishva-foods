// =============================================================
// VISHVA FOODS — Order Confirmation
// Reads Stripe's redirect params, finalizes the order via the
// idempotent /confirm endpoint (works even without webhook
// forwarding in dev), then shows the real order summary.
// =============================================================
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface OrderRow {
  id: string;
  customer_email: string;
  total: number;
  fulfillment_type: "pickup" | "delivery";
  status: string;
  paid: boolean;
  tracking_url?: string | null;
}

export default function OrderConfirmPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId ?? "";
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const cleared = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function finalizeAndLoad() {
      const url = new URL(window.location.href);
      const paymentIntentId = url.searchParams.get("payment_intent");
      const redirectStatus = url.searchParams.get("redirect_status");

      // Finalize via the idempotent fallback (no-op if webhook already ran).
      if (paymentIntentId && redirectStatus === "succeeded") {
        try {
          await fetch(`/api/orders/${orderId}/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId }),
          });
        } catch {
          /* fall through to fetch — webhook may have handled it */
        }
      }

      // Load the order, with a short poll in case finalize is mid-flight.
      for (let attempt = 0; attempt < 4 && !cancelled; attempt++) {
        try {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            const data: OrderRow = await res.json();
            if (!cancelled) {
              setOrder(data);
              setState("ready");
              if (data.paid && !cleared.current) {
                cleared.current = true;
                clearCart();
              }
              if (data.paid) return;
            }
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 1200));
      }

      if (!cancelled && !order) {
        // Couldn't load the order (e.g. DB not configured). Still show success
        // if Stripe told us the payment succeeded.
        if (redirectStatus === "succeeded") {
          setState("ready");
          if (!cleared.current) { cleared.current = true; clearCart(); }
        } else {
          setState("error");
          setMessage("We couldn't load this order. Check your email for confirmation.");
        }
      }
    }

    finalizeAndLoad();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fulfillment = order?.fulfillment_type ?? "pickup";
  const shortId = orderId ? `VF-${orderId.slice(0, 8).toUpperCase()}` : "VF-ORDER";

  if (state === "loading") {
    return (
      <main className="min-h-screen bg-[#FEF6E8] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#7B2D2D] animate-spin mx-auto mb-3" />
          <p className="text-[#1A0A00]/60">Confirming your order…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FEF6E8] pt-24 pb-16 flex items-center">
      <div className="container max-w-2xl">
        <motion.div
          className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="bg-[#7B2D2D] px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-16 h-16 bg-[#D4A017] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-[#1A0A00]" />
            </motion.div>
            <h1 className="font-display font-bold text-white text-3xl mb-2">Order confirmed!</h1>
            <p className="text-white/70">Thank you for your order</p>
            <div className="mt-4 inline-block bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#D4A017] font-mono font-bold text-lg">{shortId}</span>
            </div>
            {order && (
              <p className="text-white/70 text-sm mt-3">Total paid · ${Number(order.total).toFixed(2)}</p>
            )}
          </div>

          <div className="p-8 space-y-6">
            {state === "error" && (
              <div className="flex items-start gap-3 bg-[#FEF6E8] rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-[#B45309] mt-0.5 shrink-0" />
                <p className="text-sm text-[#1A0A00]/70">{message}</p>
              </div>
            )}

            {fulfillment === "pickup" ? (
              <div className="flex items-start gap-3 bg-[#FEF6E8] rounded-xl p-4">
                <MapPin className="w-5 h-5 text-[#7B2D2D] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A0A00]">Pickup details</p>
                  <p className="text-sm text-[#1A0A00]/60 mt-1">
                    Ready in <strong>25–35 minutes</strong>. The exact pickup address has been emailed to you.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-[#FEF6E8] rounded-xl p-4">
                <Clock className="w-5 h-5 text-[#7B2D2D] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A0A00]">Delivery details</p>
                  <p className="text-sm text-[#1A0A00]/60 mt-1">
                    Estimated delivery <strong>35–50 minutes</strong>. A driver is being dispatched to your address.
                  </p>
                  {order?.tracking_url && (
                    <a href={order.tracking_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#7B2D2D] font-medium mt-2 hover:underline">
                      Live courier tracking <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 bg-[#FEF6E8] rounded-xl p-4">
              <Mail className="w-5 h-5 text-[#7B2D2D] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[#1A0A00]">Confirmation email</p>
                <p className="text-sm text-[#1A0A00]/60 mt-1">
                  A summary{fulfillment === "pickup" ? " and pickup address" : " and delivery ETA"} has been sent
                  {order?.customer_email ? ` to ${order.customer_email}` : " to your email"}.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={`/track/${orderId}`} className="btn-crimson flex-1 justify-center">
                Track order <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/menu" className="btn-gold-outline flex-1 justify-center">Order again</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
