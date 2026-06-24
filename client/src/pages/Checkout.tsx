// =============================================================
// VISHVA FOODS — Checkout
// Phase 1: contact + fulfillment (+ live DoorDash/Uber quote)
// Phase 2: real Stripe Payment Element (card/Apple/Google Pay)
// Order is created server-side (service role) so guest checkout
// works under RLS; payment finalization dispatches the courier.
// =============================================================
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Truck, ShoppingBag, AlertCircle } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { stripePromise, stripeConfigured } from "@/lib/stripe";
import PaymentForm from "@/components/PaymentForm";
import { toast } from "sonner";
import type { FulfillmentType } from "@/contexts/CartContext";

interface DeliveryForm {
  name: string; email: string; phone: string;
  address: string; city: string; zip: string; instructions: string;
}

export default function CheckoutPage() {
  const {
    items, subtotal, tax, total, deliveryFee,
    fulfillment, setFulfillment, setDeliveryFee, setDeliveryAddress, setDeliveryEta,
    deliveryEta, itemCount,
  } = useCart();

  const [form, setForm] = useState<DeliveryForm>({
    name: "", email: "", phone: "", address: "", city: "Ashburn", zip: "", instructions: "",
  });
  const [quoteFetching, setQuoteFetching] = useState(false);
  const [quoteReady, setQuoteReady] = useState(false);
  const [preparing, setPreparing] = useState(false);

  // Phase 2 state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (items.length === 0 && !clientSecret) {
    return (
      <main className="min-h-screen bg-[#FEF6E8] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="font-display font-bold text-[#1A0A00] text-2xl mb-2">Your cart is empty</h1>
          <p className="text-[#1A0A00]/50 mb-6">Add some dishes before checking out</p>
          <Link href="/menu" className="btn-crimson">Browse Menu</Link>
        </div>
      </main>
    );
  }

  const handleFulfillmentChange = (type: FulfillmentType) => {
    setFulfillment(type);
    setQuoteReady(false);
    if (type === "pickup") { setDeliveryFee(0); setDeliveryEta(null); }
  };

  const handleGetQuote = async () => {
    if (!form.address || !form.zip || !form.phone) {
      toast.error("Enter your address and phone first");
      return;
    }
    setQuoteFetching(true);
    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dropoff: {
            name: form.name || "Customer",
            phone: form.phone,
            address: `${form.address}, ${form.city}, VA ${form.zip}`,
            city: form.city, state: "VA", zip: form.zip,
            instructions: form.instructions,
          },
          orderValueCents: Math.round(subtotal * 100),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quote failed");
      setDeliveryFee((data.feeCents ?? 0) / 100);
      const eta = data.etaMinutes ? `${data.etaMinutes} min` : "35–50 min";
      setDeliveryEta(eta);
      setDeliveryAddress(`${form.address}, ${form.city}, VA ${form.zip}`);
      setQuoteReady(true);
      toast.success(`Delivery: $${((data.feeCents ?? 0) / 100).toFixed(2)} · ETA ${eta}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't get a delivery quote");
    } finally {
      setQuoteFetching(false);
    }
  };

  const handleContinueToPayment = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your contact details");
      return;
    }
    if (fulfillment === "delivery" && !quoteReady) {
      toast.error("Get a delivery quote first");
      return;
    }
    if (!stripeConfigured) {
      toast.error("Payments aren't configured yet. Add your Stripe key to go live.");
      return;
    }
    setPreparing(true);
    try {
      // 1) Create the pending order (server-side, service role).
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          items: items.map((ci) => ({
            id: ci.item.id, name: ci.item.name, price: ci.item.price, qty: ci.qty,
          })),
          subtotal, tax, delivery_fee: deliveryFee, total,
          fulfillment_type: fulfillment,
          delivery_address: fulfillment === "delivery"
            ? { address: form.address, city: form.city, state: "VA", zip: form.zip, instructions: form.instructions }
            : null,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Couldn't create order");

      // 2) Create the PaymentIntent for that order.
      const piRes = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, email: form.email, name: form.name, orderId: orderData.orderId }),
      });
      const piData = await piRes.json();
      if (!piRes.ok) throw new Error(piData.error || "Couldn't start payment");

      setOrderId(orderData.orderId);
      setClientSecret(piData.clientSecret);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPreparing(false);
    }
  };

  const showPayment = Boolean(clientSecret && orderId && stripePromise);

  return (
    <main className="min-h-screen bg-[#FEF6E8] pt-20 pb-16">
      <div className="container py-8">
        <Link href="/menu" className="inline-flex items-center gap-1.5 text-sm text-[#7B2D2D] hover:text-[#6A2626] mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
        <h1 className="font-display font-bold text-[#1A0A00] text-3xl md:text-4xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Fulfillment */}
            <section className="bg-white rounded-xl p-6 border border-[#D4A017]/15">
              <h2 className="font-display font-semibold text-[#1A0A00] text-lg mb-4">How would you like your order?</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["pickup", "delivery"] as FulfillmentType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFulfillmentChange(type)}
                    disabled={showPayment}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all disabled:opacity-60 ${
                      fulfillment === type ? "border-[#7B2D2D] bg-[#7B2D2D]/5" : "border-[#1A0A00]/15 hover:border-[#7B2D2D]/40"
                    }`}
                    aria-pressed={fulfillment === type}
                  >
                    {type === "pickup"
                      ? <ShoppingBag className={`w-6 h-6 ${fulfillment === type ? "text-[#7B2D2D]" : "text-[#1A0A00]/40"}`} />
                      : <Truck className={`w-6 h-6 ${fulfillment === type ? "text-[#7B2D2D]" : "text-[#1A0A00]/40"}`} />}
                    <span className={`font-semibold text-sm capitalize ${fulfillment === type ? "text-[#7B2D2D]" : "text-[#1A0A00]/50"}`}>{type}</span>
                    <span className="text-xs text-[#1A0A00]/40 text-center">
                      {type === "pickup" ? "Ready in 25–35 min" : "Delivered to your door"}
                    </span>
                  </button>
                ))}
              </div>
              {fulfillment === "pickup" && (
                <div className="mt-4 flex items-start gap-2.5 bg-[#FEF6E8] rounded-lg p-3">
                  <MapPin className="w-4 h-4 text-[#7B2D2D] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#1A0A00]/70">
                    Ready in 25–35 min. Pick up from the <strong>Ashburn, VA area</strong>. Exact address is emailed after your order is confirmed.
                  </p>
                </div>
              )}
            </section>

            {/* Contact */}
            <section className="bg-white rounded-xl p-6 border border-[#D4A017]/15">
              <h2 className="font-display font-semibold text-[#1A0A00] text-lg mb-4">Contact details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="name">Full name *</label>
                  <input id="name" type="text" value={form.name} disabled={showPayment}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="email">Email *</label>
                  <input id="email" type="email" value={form.email} disabled={showPayment}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" placeholder="priya@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="phone">Phone *</label>
                  <input id="phone" type="tel" value={form.phone} disabled={showPayment}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" placeholder="+1 (703) 555-0000" />
                </div>
              </div>
            </section>

            {/* Delivery address */}
            {fulfillment === "delivery" && (
              <section className="bg-white rounded-xl p-6 border border-[#D4A017]/15">
                <h2 className="font-display font-semibold text-[#1A0A00] text-lg mb-4">Delivery address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="address">Street address *</label>
                    <input id="address" type="text" value={form.address} disabled={showPayment}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="city">City</label>
                      <input id="city" type="text" value={form.city} disabled={showPayment}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="zip">ZIP *</label>
                      <input id="zip" type="text" value={form.zip} disabled={showPayment}
                        onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                        className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] disabled:bg-[#FEF6E8]" placeholder="20147" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A0A00]/70 mb-1" htmlFor="instructions">Delivery instructions</label>
                    <textarea id="instructions" rows={2} value={form.instructions} disabled={showPayment}
                      onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                      className="w-full border border-[#1A0A00]/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D2D]/30 focus:border-[#7B2D2D] resize-none disabled:bg-[#FEF6E8]" placeholder="Gate code, leave at door, etc." />
                  </div>
                  {!showPayment && (
                    <button onClick={handleGetQuote} disabled={quoteFetching} className="btn-gold-outline w-full justify-center">
                      {quoteFetching ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#7B2D2D] border-t-transparent rounded-full animate-spin" />
                          Getting quote…
                        </span>
                      ) : quoteReady ? `✓ Delivery: $${deliveryFee.toFixed(2)} · ETA ${deliveryEta ?? ""}` : "Get delivery quote"}
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Payment */}
            <section className="bg-white rounded-xl p-6 border border-[#D4A017]/15">
              {showPayment ? (
                <Elements
                  stripe={stripePromise!}
                  options={{
                    clientSecret: clientSecret!,
                    appearance: { theme: "stripe", variables: { colorPrimary: "#7B2D2D" } },
                  }}
                >
                  <PaymentForm orderId={orderId!} amount={total} email={form.email} />
                </Elements>
              ) : !stripeConfigured ? (
                <div className="flex items-start gap-2.5 bg-[#FEF6E8] rounded-lg p-4 border border-dashed border-[#D4A017]/40">
                  <AlertCircle className="w-5 h-5 text-[#B45309] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1A0A00]">Payments not configured</p>
                    <p className="text-xs text-[#1A0A00]/50 mt-0.5">Add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> and <code>STRIPE_SECRET_KEY</code> to enable checkout.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-[#1A0A00]/50 py-2">
                  Complete your details, then continue to secure payment.
                </div>
              )}
            </section>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#D4A017]/15 sticky top-24">
              <div className="p-5 border-b border-[#D4A017]/15">
                <h2 className="font-display font-semibold text-[#1A0A00] text-lg">Order summary</h2>
                <p className="text-xs text-[#1A0A00]/40 mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
                {items.map((ci) => (
                  <div key={ci.item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FEF6E8] shrink-0">
                      {ci.item.image_url
                        ? <img src={ci.item.image_url} alt={ci.item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🍛</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A0A00] truncate">{ci.item.name}</p>
                      <p className="text-xs text-[#1A0A00]/40">×{ci.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#7B2D2D] shrink-0">${(ci.item.price * ci.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-[#D4A017]/15 space-y-2">
                <div className="flex justify-between text-sm text-[#1A0A00]/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-[#1A0A00]/60"><span>Tax (8.5%)</span><span>${tax.toFixed(2)}</span></div>
                {fulfillment === "delivery" && (
                  <div className="flex justify-between text-sm text-[#1A0A00]/60">
                    <span>Delivery fee</span><span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : "—"}</span>
                  </div>
                )}
                {fulfillment === "pickup" && (
                  <div className="flex items-center gap-1.5 text-xs text-[#2E6B3E] bg-[#2E6B3E]/8 rounded px-2 py-1">
                    <Clock className="w-3 h-3" /> Ready in 25–35 min · Free pickup
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#1A0A00] text-base pt-2 border-t border-[#D4A017]/15">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              {!showPayment && (
                <div className="p-5 pt-0">
                  <button onClick={handleContinueToPayment} disabled={preparing} className="btn-crimson w-full justify-center text-base">
                    {preparing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Preparing…
                      </span>
                    ) : "Continue to payment"}
                  </button>
                  <p className="text-xs text-center text-[#1A0A00]/30 mt-2">Secured by Stripe · 256-bit encryption</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
