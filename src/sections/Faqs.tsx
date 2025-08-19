"use client";

import Tag from "@/components/Tag";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
  {
    question: "What is Linko?",
    answer:
      "Linko is a simple and modern tool that helps you organize, share, and manage all your important links in one place. Whether it’s for personal use, work, or your community, Linko keeps everything tidy and easy to access.",
  },
  {
    question: "Do I need an account to use Linko?",
    answer:
      "No, you can explore public profiles without an account. But to create your own Linko page, customize it, and save links, you’ll need to sign up—it only takes a minute.",
  },
  {
    question: "Can I customize my Linko page?",
    answer:
      "Yes! You can personalize your page with themes, fonts, and custom branding so your link hub reflects your style or brand identity.",
  },
  {
    question: "Is Linko free?",
    answer:
      "Yes, Linko offers a free plan with all the essentials. We also have premium features like advanced analytics, custom domains, and priority support for professionals and businesses.",
  },
  {
    question: "How do I share my Linko profile?",
    answer:
      "Once your profile is set up, you’ll get a unique link (like linko.xyz/yourname) that you can share on social media, email signatures, or anywhere online.",
  },
  {
    question: "Can I track how many people click my links?",
    answer:
      "Definitely! Linko provides real-time analytics, so you can see how many people are visiting your page, which links are most popular, and where your audience comes from.",
  },
];

export default function Faqs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex justify-center">
          <Tag>FAQs</Tag>
        </div>
        <h2 className="text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
          Questions? We&apos;ve got{" "}
          <span className="text-lime-400">answers</span>
        </h2>

        <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
          {faqs.map((faq, faqIndex) => (
            <div
              key={faq.question}
              onClick={() =>
                setSelectedIndex(selectedIndex === faqIndex ? null : faqIndex)
              }
              className="bg-neutral-900 rounded-2xl border border-white/10 p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium m-0">{faq.question}</h3>
                <Plus
                  size={30}
                  className={twMerge(
                    "text-lime-400 flex-shrink-0 transition duration-300",
                    selectedIndex === faqIndex && "rotate-45"
                  )}
                />
              </div>

              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{ height: 0, marginTop: 0 }}
                    animate={{ height: "auto", marginTop: 24 }}
                    exit={{ height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/50">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
