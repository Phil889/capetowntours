"use client";
import { useState } from "react";

type PaymentFormProps = {
  bookingId: string;
  amount: number;
};

export default function PaymentForm({ bookingId, amount }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate payment details (replace with Stripe integration)
      const paymentDetails = { card: "4242 4242 4242 4242" };
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, paymentDetails }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Payment failed");
      }
      // Redirect to confirmation page
      window.location.href = `/booking/confirmed/${bookingId}`;
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="border rounded p-4 bg-gray-50 mt-6" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-2">Payment</h3>
      <div className="mb-2">
        <span className="font-bold">Amount:</span> {amount}
      </div>
      {/* In production, add Stripe Elements or payment fields here */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
