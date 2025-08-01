"use client";

import React, { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    key: "1",
    question: "What is Webflow and why is it the best website builder?",
    answer:
      "Webflow is a powerful visual development platform that allows designers to build fully responsive websites without writing a single line of code. It combines the flexibility of code with the simplicity of a visual editor, empowering creators to bring their ideas to life faster and more efficiently than ever before.",
  },
  {
    key: "2",
    question: "What is your favorite template from BRIX Templates?",
    answer:
      "BRIX Templates offers a wide range of premium Webflow templates. Our favorite is the 'Startup Framework' due to its versatility and clean design.",
  },
  {
    key: "3",
    question: "Can I customize the templates easily?",
    answer:
      "Yes, all templates from BRIX are built with flexibility in mind, allowing full customization using Webflow’s no-code tools.",
  },
  {
    key: "4",
    question: "Do you offer customer support?",
    answer:
      "Absolutely. Our dedicated team offers support through chat, email, and detailed documentation to help you every step of the way.",
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string | false>("1");
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleFAQ = (key: string) => {
    setExpanded(expanded === key ? false : key);
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-lime-500">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = expanded === faq.key;
            const contentHeight = contentRefs.current[faq.key]?.scrollHeight ?? 0;

            return (
              <div
                key={faq.key}
                className="bg-white rounded-4xl shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.key)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left text-[#111827] font-semibold text-base sm:text-lg focus:outline-none"
                >
                  <span className={`transition-all ${isOpen ? "font-bold text-lime-500" : ""}`}>
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`ml-4 text-gray-500 transform transition-transform duration-500 ${
                      isOpen ? "rotate-180 text-[#0057FF]" : ""
                    }`}
                  />
                </button>
                <div
                  ref={(el) => { contentRefs.current[faq.key] = el; }}
                  style={{
                    maxHeight: isOpen ? `${contentHeight}px` : "0px",
                    transition: "max-height 0.5s ease, opacity 0.5s ease",
                    opacity: isOpen ? 1 : 0,
                  }}
                  className="px-6 text-gray-600 text-sm leading-relaxed"
                >
                  <div className="py-4">{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
