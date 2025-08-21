"use client";
import React from "react";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <div className="text-yellow-100/90 text-lg leading-relaxed space-y-6">
          <p>
            At Cape Town Safari Tours, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal details (name, email, phone, address) provided during booking or inquiry.</li>
            <li>Payment information (processed securely via third-party providers).</li>
            <li>Travel preferences and special requests.</li>
            <li>Website usage data (cookies, analytics, device info).</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process bookings, payments, and provide requested services.</li>
            <li>To communicate with you about your tour, updates, or offers.</li>
            <li>To improve our website, services, and customer experience.</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">3. Data Sharing & Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do not sell or rent your personal information to third parties.</li>
            <li>We may share data with trusted partners (e.g., payment processors, tour operators) only as needed to fulfill your booking.</li>
            <li>All data is stored securely and access is restricted to authorized personnel.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">4. Cookies & Tracking</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We use cookies and analytics to understand website usage and improve our services.</li>
            <li>You can manage cookie preferences in your browser settings.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">5. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may request access, correction, or deletion of your personal data at any time.</li>
            <li>You may opt out of marketing communications at any time.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">6. Changes to This Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We may update this Privacy Policy from time to time. The latest version will always be available on our website.</li>
          </ul>
          <p className="mt-8">
            If you have any questions or concerns about our Privacy Policy, please contact us at <span className="font-bold text-yellow-200">info@capetownsafaritours.com</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
