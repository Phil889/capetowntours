"use client";
import React from "react";

export default function TermsOfServicePage() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{
        background:
          "linear-gradient(120deg, #2d1a05 0%, #bfa76a 100%), url('/Best Lion Safari Cape Town.webp') center/cover no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-3xl w-full bg-black/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-yellow-700/60">
        <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-center mb-8 drop-shadow-2xl">
          Terms of Service
        </h1>
        <div className="text-yellow-100/90 text-lg leading-relaxed space-y-6">
          <p>
            Welcome to Cape Town Safari Tours. By accessing or using our website and services, you agree to be bound by the following terms and conditions. Please read them carefully.
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">1. Booking & Payment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All bookings are subject to availability and confirmation.</li>
            <li>Full payment is required to secure your reservation unless otherwise stated.</li>
            <li>Accepted payment methods include credit card, EFT, and other options as listed on our site.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">2. Cancellations & Refunds</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cancellations must be made in writing via email or our contact form.</li>
            <li>Refunds are subject to our cancellation policy, which may vary by tour.</li>
            <li>No-shows or late arrivals are non-refundable.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">3. Changes & Modifications</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We reserve the right to modify itineraries due to weather, safety, or operational reasons.</li>
            <li>We will notify you of any significant changes as soon as possible.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">4. Liability & Insurance</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Participation in tours is at your own risk. We recommend comprehensive travel insurance.</li>
            <li>We are not liable for loss, injury, or damage to personal property during your tour.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">5. Privacy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your personal information is handled in accordance with our Privacy Policy.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">6. Conduct</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We expect all guests to behave respectfully towards guides, staff, and fellow travelers.</li>
            <li>We reserve the right to remove any guest who poses a risk or disrupts the experience for others.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">7. Governing Law</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>These terms are governed by the laws of South Africa.</li>
          </ul>
          <p className="mt-8">
            By using our services, you acknowledge that you have read, understood, and agree to these Terms of Service. If you have any questions, please contact us.
          </p>
        </div>
      </div>
    </section>
  );
}
