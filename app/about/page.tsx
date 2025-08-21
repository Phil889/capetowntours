"use client";
import React from "react";

export default function AboutPage() {
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
          About Cape Town Safari Tours
        </h1>
        <div className="text-yellow-100/90 text-lg leading-relaxed space-y-6">
          <p>
            <span className="font-bold text-yellow-200">Cape Town Safari Tours</span> is a locally owned and operated company dedicated to creating unforgettable, private adventures in South Africa. Our mission is to connect travelers with the magic of Africa through expertly crafted, luxury experiences.
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">Our Story</h2>
          <p>
            Founded by passionate locals with decades of experience in tourism and wildlife, we believe that every journey should be as unique as the traveler. We started with a simple idea: to offer truly private, customizable tours that go beyond the ordinary.
          </p>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-bold text-yellow-200">Authenticity:</span> We showcase the real South Africa, from its wild beauty to its vibrant cultures.</li>
            <li><span className="font-bold text-yellow-200">Exclusivity:</span> Every tour is private, tailored, and never shared with strangers.</li>
            <li><span className="font-bold text-yellow-200">Sustainability:</span> We support eco-friendly practices and local communities.</li>
            <li><span className="font-bold text-yellow-200">Excellence:</span> Our guides are experts, storytellers, and passionate hosts.</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">Meet Our Team</h2>
          <p>
            Our team is made up of wildlife specialists, wine connoisseurs, adventure seekers, and cultural ambassadors—all united by a love for Africa and a commitment to exceptional service.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-bold text-yellow-200">James:</span> Safari guide & wildlife expert</li>
            <li><span className="font-bold text-yellow-200">Lindiwe:</span> Cultural tour leader & historian</li>
            <li><span className="font-bold text-yellow-200">Michael:</span> Wine & culinary specialist</li>
            <li><span className="font-bold text-yellow-200">Sarah:</span> Guest experience manager</li>
          </ul>
          <h2 className="font-bold text-yellow-200 text-2xl mt-8 mb-2">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>100% private, luxury tours—no strangers, ever.</li>
            <li>Handpicked experiences, from Big 5 safaris to gourmet wine tours.</li>
            <li>Transparent pricing, no hidden fees.</li>
            <li>Trusted by thousands of travelers worldwide.</li>
          </ul>
          <p className="mt-8">
            <span className="font-bold text-yellow-200">Join us</span> for the adventure of a lifetime. Discover Africa your way—with Cape Town Safari Tours.
          </p>
        </div>
      </div>
    </section>
  );
}
