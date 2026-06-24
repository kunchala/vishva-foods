// =============================================================
// VISHVA FOODS — Cart Drawer
// Slide-over from right. Accessible, keyboard dismissible.
// =============================================================
import { useEffect } from "react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, setQty, removeItem, subtotal, tax, total, deliveryFee, fulfillment, itemCount } = useCart();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4A017]/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#7B2D2D]" />
            <h2 className="font-display font-semibold text-[#1A0A00] text-lg">
              Your Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-[#7B2D2D]">({itemCount} items)</span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#7B2D2D]/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-[#1A0A00]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-5xl">🛒</div>
              <p className="font-display text-[#1A0A00]/50 text-lg">Your cart is empty</p>
              <p className="text-sm text-[#1A0A00]/40">Add a few dishes — everything's cooked fresh to order</p>
              <Link
                href="/menu"
                onClick={onClose}
                className="btn-crimson text-sm"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(ci => (
                <li key={ci.item.id} className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FEF6E8] shrink-0">
                    {ci.item.image_url ? (
                      <img src={ci.item.image_url} alt={ci.item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍛</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1A0A00] truncate">{ci.item.name}</p>
                    <p className="text-xs text-[#1A0A00]/50">${ci.item.price.toFixed(2)} each</p>
                    {/* Qty stepper */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => ci.qty === 1 ? removeItem(ci.item.id) : setQty(ci.item.id, ci.qty - 1)}
                        className="w-6 h-6 rounded-full border border-[#7B2D2D]/40 text-[#7B2D2D] flex items-center justify-center hover:bg-[#7B2D2D] hover:text-white transition-colors"
                        aria-label={`Decrease ${ci.item.name} quantity`}
                      >
                        {ci.qty === 1 ? <Trash2 className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                      </button>
                      <span className="text-sm font-semibold text-[#1A0A00] w-4 text-center">{ci.qty}</span>
                      <button
                        onClick={() => setQty(ci.item.id, ci.qty + 1)}
                        className="w-6 h-6 rounded-full bg-[#7B2D2D] text-white flex items-center justify-center hover:bg-[#6A2626] transition-colors"
                        aria-label={`Increase ${ci.item.name} quantity`}
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  {/* Line total */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-[#7B2D2D]">
                      ${(ci.item.price * ci.qty).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary + CTA */}
        {items.length > 0 && (
          <div className="border-t border-[#D4A017]/20 px-5 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#1A0A00]/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#1A0A00]/70">
                <span>Tax (8.5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {fulfillment === "delivery" && deliveryFee > 0 && (
                <div className="flex justify-between text-[#1A0A00]/70">
                  <span>Delivery fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#1A0A00] text-base pt-1 border-t border-[#D4A017]/20">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-chili w-full justify-center text-base font-bold shadow-lg"
            >
              Proceed to Checkout
            </Link>
            <p className="text-xs text-center text-[#1A0A00]/40">
              {fulfillment === "pickup" ? "Pickup · Ready in 25–35 min" : "Delivery · Address at checkout"}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
