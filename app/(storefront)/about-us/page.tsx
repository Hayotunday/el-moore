"use client";

import { useState } from "react";
import { CheckCircle, Compass, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal";
import { subscribe } from "@/lib/api/newsletter";

const pillars = [
  {
    icon: Compass,
    title: "Balance & Professionalism",
    body: "Every engagement — from a first inquiry to a closed sale — is handled with the same measured, professional standard, regardless of the size of the investment.",
  },
  {
    icon: TrendingUp,
    title: "Ambition & Market Dominance",
    body: "We pursue premium, high-value property offerings that reflect real market leadership, not just listings volume.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency & Integrity",
    body: "Verified titles, clear documentation, and honest positioning — the foundation of a real estate partner clients can trust with generational wealth.",
  },
];

const leadership = [
  { role: "Managing Director" },
  { role: "General Manager" },
  { role: "Head of Sales & Acquisitions" },
  { role: "Head of Legal & Compliance" },
];

export default function AboutUs() {
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
      toast.error(err instanceof Error ? err.message : "Could not subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <p className="eyebrow mb-4">Our Philosophy</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-[1.1] mb-6">
              Building Wealth Through <em className="text-gold-deep italic">Curated</em> Real
              Estate
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              El-Moore Real Estate exists at the intersection of trust and
              opportunity — a partner for clients seeking verified, high-value
              property investment across Nigeria&apos;s fastest-growing
              districts.
            </p>
            <div className="flex gap-3">
              <Link
                href="/listings"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
              >
                View Our Portfolio
              </Link>
              <Link
                href="/helpdesk"
                className="border border-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-muted transition-colors active:scale-[0.97]"
              >
                Speak With Us
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="rounded-md overflow-hidden aspect-4/3 shadow-ambient">
              <img
                src="/assets/identity-hero.jpg"
                alt="El-Moore HQ"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Story — sourced from the El-Moore BrandMark narrative */}
      <section className="container py-20">
        <ScrollReveal>
          <p className="eyebrow mb-4">Our Identity</p>
          <h2 className="font-serif text-2xl font-medium mb-6">The Mark We Build On</h2>
          <p className="text-muted-foreground max-w-2xl mb-12">
            Our brandmark is deliberate: dual curves sweeping around rising
            vertical forms. The curves reflect inclusivity and the seamless
            journey we provide clients; the towers represent premium,
            high-value property offerings and market ambition. Together, the
            interplay of curve and line represents the transparency and
            integrity we build every client relationship on.
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 0.08}>
              <div className="rounded-md bg-card p-6 h-full shadow-ambient space-y-3">
                <pillar.icon className="h-6 w-6 text-gold-deep" />
                <h3 className="font-serif text-base font-medium">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="container py-20">
        <ScrollReveal>
          <p className="eyebrow mb-4">Our Team</p>
          <h2 className="font-serif text-2xl font-medium mb-2">Leadership</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-lg">
            The team responsible for every acquisition, sale, and client
            relationship at El-Moore Real Estate.
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((member, i) => (
            <ScrollReveal key={member.role} delay={i * 0.08}>
              <div className="group">
                <div className="aspect-square rounded-md bg-muted mb-4 overflow-hidden flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold text-secondary-foreground flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {member.role}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="container py-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-md bg-card p-8 shadow-ambient">
            <div>
              <h3 className="font-serif text-lg font-medium mb-1">Verified, Every Time</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Every property in our catalog is titled and verified before it
                reaches a client — no exceptions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground shrink-0">
              <CheckCircle className="h-4 w-4 text-gold" /> Title Verification
              on Every Listing
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Newsletter */}
      <section className="container py-12">
        <ScrollReveal>
          <div className="bg-gradient-green rounded-md p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl font-medium italic mb-1 text-white">
                The Curator&apos;s Digest
              </h2>
              <p className="text-sm text-white/70 max-w-xs">
                Bi-weekly architectural and financial analysis, straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="professional@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/20 rounded-md px-4 py-2.5 text-sm bg-white/10 text-white placeholder:text-white/50 flex-1 md:w-64 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-gold text-secondary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] whitespace-nowrap disabled:opacity-60"
              >
                {subscribing ? "Subscribing…" : "Subscribe Now"}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="bg-gradient-green w-full">
        <div className="container py-20 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl font-medium mb-4 text-white">
              Experience Personal Concierge Investment
            </h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto">
              Every story at El-Moore begins with a conversation. Let us
              curate your next high-value acquisition with the discretion you
              deserve.
            </p>
            <Link
              href="/helpdesk"
              className="inline-flex items-center bg-gold text-secondary-foreground px-8 py-4 rounded-md font-semibold hover:bg-gold/90 transition-colors active:scale-[0.97]"
            >
              Request Private Consultation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
