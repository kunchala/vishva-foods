// =============================================================
// VISHVA FOODS — Payment Form
// Renders the Stripe Payment Element (card + Apple Pay + Google
// Pay + Link via automatic_payment_methods) and confirms payment.
// Must be rendered inside <Elements options={{ clientSecret }}>.
// =============================================================
import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentFormProps {
  orderId: string;
  amount: number;
  email: string;
}

export default function PaymentForm({ orderId, amount, email }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirm/${orderId}`,
        receipt_email: email,
      },
    });

    // If we reach here, confirmation failed before redirect.
    if (error) {
      toast.error("Payment failed", { description: error.message });
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="w-5 h-5 text-[#7B2D2D]" />
        <h3 className="font-display font-semibold text-[#1A0A00]">Payment</h3>
      </div>
      <PaymentElement options={{ layout: "tabs" }} />
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="btn-crimson w-full justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing…
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>
      <p className="text-xs text-center text-[#1A0A00]/30">
        Secured by Stripe · Card · Apple Pay · Google Pay
      </p>
    </form>
  );
}
