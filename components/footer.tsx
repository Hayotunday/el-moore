"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { subscribe } from "@/lib/api/newsletter";
import ScrollReveal from "@/components/scroll-reveal";

// The management/marketer portal is a separate deployment (a separate repo)
// as of the storefront/dashboard split — point this at its real deployed URL.
const MARKETER_PORTAL_URL = process.env.NEXT_PUBLIC_MARKETER_PORTAL_URL || "#";

const columns = [
  {
    heading: "Estates",
    links: [
      { label: "Showroom", href: "/listings" },
      { label: "Saved Properties", href: "/saved" },
      { label: "ROI Calculator", href: "/calculator" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "The Academy", href: "/blog" },
      { label: "Be A Marketer", href: MARKETER_PORTAL_URL },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Helpdesk", href: "/helpdesk" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubscribing(true);
    try {
      await subscribe(trimmed);
      toast.success("You're subscribed to The Curator's Digest.");
      setEmail("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not subscribe. Please try again.",
      );
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="container pt-20 pb-10">
        {/* Newsletter */}
        <div className="w-full bg-primary border-b border-white/12 py-12 mb-12">
          <div className="w-full flex flex-wrap items-center justify-between gap-8">
            <div className="">
              <h2 className="font-serif text-2xl font-medium text-primary-foreground max-w-[22ch]">
                The Curator&apos;s Digest
              </h2>
              <p className="mt-2 max-w-[34ch] text-sm text-primary-foreground/65">
                Bi-weekly architectural and financial analysis, straight to your
                inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex shrink-0 gap-2.5 max-sm:w-full max-sm:flex-col"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professional@email.com"
                className="min-w-64 rounded-md border border-white/25 bg-transparent px-5 py-3.5 text-sm text-white placeholder:text-white/45 focus:border-gold focus:outline-none max-sm:min-w-0"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="whitespace-nowrap rounded-md bg-gold px-6.5 py-3.5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-gold/90 disabled:opacity-60"
              >
                {subscribing ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 border-b border-white/12 pb-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img
              src="/assets/el-moore-1.png"
              alt="El-Moore Logo"
              className="h-8 w-auto mb-4"
            />
            <p className="max-w-[26ch] text-sm leading-relaxed text-primary-foreground/60">
              RC: 1938760. A registered brokerage for verified land and property
              investment across Nigeria.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-[0.7rem] font-semibold tracking-widest text-primary-foreground/55 uppercase">
                {col.heading}
              </h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-primary-foreground/85 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="pt-8 text-center text-[0.78rem] text-primary-foreground/50">
          &copy; {new Date().getFullYear()} El-Moore Real Estate. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
