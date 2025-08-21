'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleItem = (index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        
        return (
          <div 
            key={idx} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-amber-300 hover:shadow-sm"
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full px-5 py-4 text-left hover:bg-amber-50/40 transition-colors group"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <ChevronRight 
                    className={`w-5 h-5 text-amber-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-[15px] leading-snug group-hover:text-amber-700 transition-colors">
                    {faq.q}
                  </h3>
                </div>
              </div>
            </button>
            
            {/* Answer section - separate from button but in same container */}
            <div 
              id={`faq-answer-${idx}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen 
                  ? 'max-h-96' 
                  : 'max-h-0'
              }`}
            >
              <div className="px-5 pb-4 pl-11">
                <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-amber-200 pl-4">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
