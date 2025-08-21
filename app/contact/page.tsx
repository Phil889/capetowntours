"use client";
import React from "react";

export default function ContactPage() {
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
          Contact Us
        </h1>
        <p className="text-yellow-100/90 text-lg text-center mb-8">
          Have a question, need a custom quote, or want to plan your dream safari? Our team is here to help!
        </p>
        <form className="space-y-6">
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-yellow-200 font-semibold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="w-full rounded-lg px-4 py-3 bg-black/40 text-yellow-100 border border-yellow-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="message"
              name="message"
              rows={5}
              required
              placeholder="How can we help you?"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4B796] via-[#E59A59] to-[#BFA76A] text-black font-bold text-lg shadow-lg hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>
        <div className="mt-10 text-yellow-100/80 text-center space-y-2">
          <div>
            <span className="font-bold text-yellow-200">Email:</span> info@capetownsafaritours.com
          </div>
          <div>
            <span className="font-bold text-yellow-200">Phone:</span> +27 11 123 4567
          </div>
          <div>
            <span className="font-bold text-yellow-200">Address:</span> Cape Town, South Africa
          </div>
        </div>
      </div>
    </section>
  );
}
