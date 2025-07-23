"use client";
import { useState } from "react";

type BookingWidgetProps = {
  tourId: string;
  price: string | number;
};

export default function BookingWidget({ tourId, price }: BookingWidgetProps) {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Send booking request to API
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, date, guests, guest_email: email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }
      const data = await res.json();
      // Redirect to booking confirmation page
      if (data.booking && data.booking.id) {
        window.location.href = `/booking/confirmed/${data.booking.id}`;
      } else {
        setSuccess("Booking request submitted!");
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form className="border rounded p-4 bg-gray-50 mt-6" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-2">Book this tour</h3>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="border rounded px-2 py-1 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          className="border rounded px-2 py-1 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Guests</label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={guests}
          min={1}
          max={10}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
        />
      </div>
      <div className="mb-2">
        <span className="font-bold">Price:</span> {typeof price === "number" ? price * guests : price}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </form>
  );
}
