// =============================================================
// VISHVA FOODS — Order Tracking
// Pulls real status from /api/orders/:id and polls for updates.
// Timeline: Received → Preparing → Out for Delivery → Delivered
// =============================================================
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Phone, ArrowLeft, Package, Truck, Home, ExternalLink } from "lucide-react";

type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode; description: string }[] = [
  { key: "received", label: "Order received", icon: <CheckCircle2 className="w-5 h-5" />, description: "We've got your order and are getting started." },
  { key: "preparing", label: "Being prepared", icon: <Package className="w-5 h-5" />, description: "Your food is being freshly cooked in our kitchen." },
  { key: "out_for_delivery", label: "Out for delivery", icon: <Truck className="w-5 h-5" />, description: "Your courier is on the way to you." },
  { key: "delivered", label: "Delivered", icon: <Home className="w-5 h-5" />, description: "Enjoy your meal! 🎉" },
];

const STATUS_ORDER: OrderStatus[] = ["received", "preparing", "out_for_delivery", "delivered"];

interface OrderRow {
  id: string;
  status: string;
  fulfillment_type: "pickup" | "delivery";
  tracking_url?: string | null;
}

export default function TrackPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId ?? "";
  const [, navigate] = useLocation();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [lookup, setLookup] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    async function load() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok && !cancelled) setOrder(await res.json());
      } catch {
        /* ignore — keep last known */
      }
    }
    load();
    timer = setInterval(load, 10000); // poll for status changes
    return () => { cancelled = true; clearInterval(timer); };
  }, [orderId]);

  const rawStatus = (order?.status as OrderStatus) || "received";
  const currentStatus: OrderStatus = STATUS_ORDER.includes(rawStatus) ? rawStatus : "received";
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isPickup = order?.fulfillment_type === "pickup";

  return (
    <main className="min-h-screen bg-[#FEF6E8] pt-24 pb-16">
      <div className="container max-w-2xl py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#7B2D2D] hover:text-[#6A2626] mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {orderId && (
          <div className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden">
            <div className="bg-[#7B2D2D] px-6 py-6">
              <p className="text-white/60 text-sm mb-1">Tracking order</p>
              <h1 className="font-display font-bold text-white text-2xl font-mono">
                VF-{orderId.slice(0, 8).toUpperCase()}
              </h1>
              <div className="mt-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4A017]" />
                <span className="text-[#D4A017] text-sm font-medium">
                  {currentStatus === "delivered"
                    ? "Delivered!"
                    : isPickup ? "Ready in 25–35 min" : "Estimated: 35–50 min"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="relative">
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#D4A017]/20" />
                <div className="space-y-6">
                  {STATUS_STEPS
                    .filter((s) => !(isPickup && s.key === "out_for_delivery"))
                    .map((step, i, arr) => {
                      const stepIndex = STATUS_ORDER.indexOf(step.key);
                      const isCompleted = stepIndex <= currentIndex;
                      const isCurrent = step.key === currentStatus;
                      return (
                        <motion.div
                          key={step.key} className="relative flex items-start gap-4"
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCompleted ? "bg-[#7B2D2D] text-white" : "bg-[#FEF6E8] text-[#1A0A00]/30 border-2 border-[#D4A017]/20"
                          } ${isCurrent ? "ring-4 ring-[#7B2D2D]/20" : ""}`}>
                            {isCompleted ? step.icon : <Circle className="w-5 h-5" />}
                          </div>
                          <div className={`pt-1.5 ${isCompleted ? "" : "opacity-40"}`}>
                            <p className={`font-semibold text-sm ${isCurrent ? "text-[#7B2D2D]" : "text-[#1A0A00]"}`}>
                              {isPickup && step.key === "delivered" ? "Picked up" : step.label}
                              {isCurrent && <span className="ml-2 text-xs bg-[#7B2D2D] text-white px-2 py-0.5 rounded-full">Current</span>}
                            </p>
                            <p className="text-xs text-[#1A0A00]/50 mt-0.5">
                              {isPickup && step.key === "delivered" ? "Your order is ready for pickup." : step.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {order?.tracking_url && !isPickup && (
                <a href={order.tracking_url} target="_blank" rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 btn-gold-outline text-sm">
                  <ExternalLink className="w-4 h-4" /> Live courier tracking
                </a>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="border-t border-[#D4A017]/15 pt-5">
                <p className="text-sm text-[#1A0A00]/50 mb-3">Need help with your order?</p>
                <a href="tel:+17035550000" className="inline-flex items-center gap-2 btn-gold-outline text-sm" aria-label="Call Vishva Foods">
                  <Phone className="w-4 h-4" /> Call us
                </a>
              </div>
            </div>
          </div>
        )}

        {!orderId && (
          <div className="mt-6 bg-white rounded-xl border border-[#D4A017]/15 p-6">
            <h2 className="font-display font-semibold text-[#1A0A00] mb-3">Track an order</h2>
            <div className="flex gap-3">
              <input
                type="text" value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && lookup.trim()) navigate(`/track/${lookup.trim()}`); }}
                placeholder="Enter your order ID"
                className="flex-1 border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D]"
              />
              <button
                onClick={() => { if (lookup.trim()) navigate(`/track/${lookup.trim()}`); }}
                className="btn-crimson text-sm px-4 py-2.5"
              >
                Track
              </button>
            </div>
            <p className="text-xs text-[#1A0A00]/40 mt-2">Your order ID is in your confirmation email.</p>
          </div>
        )}
      </div>
    </main>
  );
}
