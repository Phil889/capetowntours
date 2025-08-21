"use client";
import React from "react";

const faqs = [
  {
    q: "What types of tours do you offer?",
    a: "We offer private safaris, wine tours, coastal adventures, cultural experiences, and fully customized itineraries across South Africa."
  },
  {
    q: "Are your tours private or group-based?",
    a: "All our tours are 100% private—just you and your group, with no strangers."
  },
  {
    q: "How do I book a tour?",
    a: "You can book directly on our website, via email, or by phone. Our team is happy to assist with custom requests."
  },
  {
    q: "Can I customize my itinerary?",
    a: "Absolutely! Every tour is tailored to your interests, pace, and preferences. Let us know your dream trip and we’ll make it happen."
  },
  {
    q: "What is included in the tour price?",
    a: "Our prices are all-inclusive: private guide, transport, entrance fees, and most meals. Any exclusions will be clearly listed."
  },
  {
    q: "Are there any hidden fees?",
    a: "No. We believe in transparent pricing. The price you see is the price you pay."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit cards, EFT, and other secure payment options. All payments are processed securely."
  },
  {
    q: "Is a deposit required?",
    a: "Full payment is usually required to confirm your booking. For custom or large group tours, a deposit may be arranged."
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made 30+ days before the tour receive a full refund. See our Terms of Service for details."
  },
  {
    q: "What happens if the weather is bad?",
    a: "We monitor conditions closely and will adjust the itinerary for your safety and enjoyment. Alternative activities or rescheduling may be offered."
  },
  {
    q: "Are your guides certified?",
    a: "Yes. All guides are experienced, certified, and passionate local experts."
  },
  {
    q: "Is travel insurance required?",
    a: "We strongly recommend comprehensive travel insurance for all guests."
  },
  {
    q: "Can you accommodate dietary restrictions?",
    a: "Yes, please let us know your dietary needs in advance and we’ll ensure you’re well taken care of."
  },
  {
    q: "Do you offer airport transfers?",
    a: "Yes, private airport transfers can be arranged as part of your tour package."
  },
  {
    q: "Are your vehicles safe and comfortable?",
    a: "Our fleet is modern, air-conditioned, and meticulously maintained for your comfort and safety."
  },
  {
    q: "Is the company eco-friendly?",
    a: "We are committed to sustainable tourism and support certified eco-friendly partners and local communities."
  },
  {
    q: "Can I book last-minute?",
    a: "We do our best to accommodate last-minute bookings, subject to availability. Contact us for urgent requests."
  },
  {
    q: "How do I contact you in an emergency?",
    a: "You’ll receive a 24/7 emergency contact number with your booking confirmation."
  },
  {
    q: "Do you offer tours for families with children?",
    a: "Yes! We welcome families and can tailor activities for all ages."
  },
  {
    q: "What languages do your guides speak?",
    a: "Our guides speak English and several other languages. Let us know your preference when booking."
  },
  {
    q: "Can you help with special occasions (honeymoons, birthdays)?",
    a: "Absolutely! We love making your special moments unforgettable—just let us know your plans."
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking as early as possible, especially for peak seasons, but we’re happy to help with short notice too."
  }
];

export default function FAQPage() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{
        background:
          "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-4xl w-full bg-black/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-yellow-700/60">
        <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-center mb-8 drop-shadow-2xl">
          Frequently Asked Questions
        </h1>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-black/30 rounded-xl p-6 border border-yellow-700/30 shadow-lg">
              <h2 className="font-bold text-yellow-200 text-xl mb-2">{faq.q}</h2>
              <p className="text-yellow-100/90 text-lg">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-yellow-100/80 text-center text-lg">
          <p>
            Still have questions? <a href="/contact" className="underline text-yellow-300 hover:text-yellow-100">Contact us</a> and our team will be happy to help!
          </p>
        </div>
      </div>
    </section>
  );
}
