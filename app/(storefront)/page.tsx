"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Heart,
  MapPin,
  Plus,
  Minus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import ScrollReveal from "@/components/scroll-reveal";
import AnimatedCounter from "@/components/animated-counter";
import { useFavorites } from "@/hooks/useFavorites";
import { listPublicProperties, getPrimaryImages } from "@/lib/api/properties";
import { subscribe } from "@/lib/api/newsletter";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/api/types";

// Alternates a property spotlight with the brokerage speaking about itself —
// mirrors the Glass Vault concept's hero exactly. Photography reuses the
// existing brand asset library since the hero is brand messaging, not a
// live-inventory feed (the Showroom section below is the real-data one).
const heroSlides: {
  image: string;
  badge?: string;
  eyebrow: string;
  headline: ReactNode;
  lede: string;
  ctaText: string;
  ctaHref: string;
}[] = [
  {
    image: "/assets/property-2.jpg",
    badge: "Ikoyi, Lagos · ₦250,000,000",
    eyebrow: "Featured Estate",
    headline: (
      <>
        A villa built
        <br />
        for <em className="text-gold italic">generations.</em>
      </>
    ),
    lede: "Four bedrooms, private gardens, and a verified title — inside our Ikoyi showroom's most requested address.",
    ctaText: "View This Estate",
    ctaHref: "#showroom",
  },
  {
    image: "/assets/hero-bg.jpg",
    eyebrow: "Who We Are",
    headline: (
      <>
        Verify before
        <br />
        you <em className="text-gold italic">trust.</em>
      </>
    ),
    lede: "Every title we offer is checked, documented, and held in a digital vault before it ever reaches a listing.",
    ctaText: "Read Our Story",
    ctaHref: "#who-we-are",
  },
  {
    image: "/assets/property-4.jpg",
    badge: "Gwarinpa, Abuja · ₦85,000,000",
    eyebrow: "New Listing",
    headline: (
      <>
        Land that holds
        <br />
        its <em className="text-gold italic">value.</em>
      </>
    ),
    lede: "A fully documented plot in one of Abuja's fastest-appreciating districts — ready for immediate development.",
    ctaText: "Explore the Plot",
    ctaHref: "#showroom",
  },
  {
    image: "/assets/property-1.jpg",
    eyebrow: "Curated Real Estate & Land Investment",
    headline: (
      <>
        Build your wealth
        <br />
        with <em className="text-gold italic">El-Moore.</em>
      </>
    ),
    lede: "Verified titles, curated locations, and a portfolio built on transparency and long-term appreciation — not hype.",
    ctaText: "Explore the Showroom",
    ctaHref: "#showroom",
  },
];

const pillars = [
  {
    num: "01",
    title: "Verified Titles",
    body: "Every C of O and Governor's Consent checked and documented before a property is listed.",
  },
  {
    num: "02",
    title: "The Digital Vault",
    body: "Encrypted, permanent storage for your titles and survey plans — accessible from anywhere.",
  },
  {
    num: "03",
    title: "ROI Forecasting",
    body: "Model your projected return before you commit, using real regional appreciation data.",
  },
  {
    num: "04",
    title: "The Academy",
    body: "Legal masterclasses on title law and land-use regulation, written for buyers, not lawyers.",
  },
];

const process = [
  {
    num: "01",
    title: "Browse Verified Listings",
    body: "Every property in the showroom has already cleared title verification before it's published.",
  },
  {
    num: "02",
    title: "Schedule an Inspection",
    body: "Visit the property in person with our team, Monday to Friday, at a time that works for you.",
  },
  {
    num: "03",
    title: "Secure With Our Sales Team",
    body: "Choose outright payment or an installment plan, and sign with full documentation support.",
  },
  {
    num: "04",
    title: "Receive Your Digital Title",
    body: "Your ownership documents are uploaded to your personal Vault, ready whenever you need them.",
  },
];

const faqs = [
  {
    q: "How is a title actually verified?",
    a: "Our team checks the Certificate of Occupancy or Governor's Consent against the relevant land registry, confirms there are no competing claims, and documents the chain of ownership before a property is ever listed for sale.",
  },
  {
    q: "Can I pay in installments?",
    a: "Yes — most properties support a structured installment plan alongside outright purchase. Your sales representative will walk you through the schedule and terms during the acquisition step.",
  },
  {
    q: "What happens after I sign?",
    a: "Your ownership documents — title, survey plan, and receipt — are uploaded to your personal Digital Vault, where you can access or download them at any time.",
  },
];

export default function Lobby() {
  const { toggle, isFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listPublicProperties().then(async (p) => {
      if (cancelled) return;
      setProperties(p);
      setLoading(false);
      const imgs = await getPrimaryImages(p.slice(0, 3).map((prop) => prop.id));
      if (!cancelled) setImages(imgs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || heroSlides.length <= 1) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % heroSlides.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribing(true);
    try {
      await subscribe(newsletterEmail);
      toast.success("Subscribed — welcome to the Curator's Digest.");
      setNewsletterEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe.");
    } finally {
      setSubscribing(false);
    }
  };

  const available = useMemo(
    () => properties.filter((p) => p.status === "AVAILABLE"),
    [properties],
  );
  const featuredProperty = available[0];
  const cities = useMemo(
    () => new Set(properties.map((p) => p.location.split(",")[0].trim())).size,
    [properties],
  );

  const statusLabel = useCallback((status: Property["status"]) => {
    if (status === "AVAILABLE") return "Available";
    if (status === "RESERVED") return "Reserved";
    return "Sold";
  }, []);

  const current = heroSlides[slide];

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden">
      {/* Hero — full-bleed carousel */}
      <section
        id="top"
        className="relative w-full min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <div
              key={s.image + i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1800 ease-in-out ${
                i === slide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${s.image})` }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,17,15,0.35) 0%, rgba(8,17,15,0.12) 32%, rgba(8,17,15,0.86) 100%)",
            }}
          />
        </div>

        <div className="container relative z-10 pt-28 pb-24 md:pt-32">
          <div className="max-w-xl md:max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                {current.badge && (
                  <span className="mb-4 inline-flex items-center bg-gold px-3.5 py-1.5 text-[0.68rem] font-bold tracking-wide text-secondary-foreground uppercase">
                    {current.badge}
                  </span>
                )}
                <p className="eyebrow on-dark mb-4">{current.eyebrow}</p>
                <h1 className="font-serif text-4xl leading-[1.08] font-medium text-white md:text-6xl mb-5">
                  {current.headline}
                </h1>
                <p className="mb-7 max-w-md text-[1.02rem] leading-relaxed text-white/78">
                  {current.lede}
                </p>
                <Link
                  href={current.ctaHref}
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-7 py-3.5 text-xs font-bold tracking-wide text-secondary-foreground uppercase transition-colors hover:bg-gold/90"
                >
                  {current.ctaText} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute right-8 bottom-9 z-10 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full border transition-all ${
                i === slide
                  ? "w-4.5 border-gold bg-gold"
                  : "w-2 border-white/60 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section id="who-we-are" className="w-full bg-primary py-28 text-center">
        <ScrollReveal className="container">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow on-dark mb-4 justify-center">Who We Are</p>
            <h2 className="font-serif text-3xl font-medium text-primary-foreground md:text-[2.6rem] mb-5">
              A brokerage built for people who verify before they trust.
            </h2>
            <p className="text-primary-foreground/72 leading-relaxed">
              El-Moore exists because too many Nigerians have paid for land that
              was never really theirs to buy. Every title we offer is checked,
              documented, and held in a digital vault before it ever reaches a
              listing — so the only thing you have to decide is whether the
              property is right for you.
            </p>
            <div className="mt-10 flex flex-wrap justify-center">
              {[
                "Registered Brokerage",
                "Verified Titles Only",
                "Lagos & Abuja Coverage",
              ].map((mark, i) => (
                <span
                  key={mark}
                  className={`px-7 text-sm font-semibold text-primary-foreground/75 ${
                    i > 0 ? "border-l border-white/18" : ""
                  }`}
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Pillars — What You Get */}
      <section id="pillars" className="container py-24 text-center">
        <ScrollReveal>
          <p className="eyebrow mb-4 justify-center">What You Get</p>
          <h2 className="font-serif text-3xl font-medium mb-14">
            Four things every El-Moore client owns
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-8 border-t border-line pt-10 text-left md:grid-cols-4 md:gap-0 md:border-t-0 md:pt-0">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.num} delay={i * 0.08}>
              <div
                className={`h-full pt-6 md:pt-10 ${i > 0 ? "md:border-l md:border-line md:pl-7" : ""}`}
              >
                <p className="font-serif text-2xl text-gold-deep italic mb-4">
                  {p.num}
                </p>
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Showroom */}
      <section id="showroom" className="container pt-0 pb-20">
        <ScrollReveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Investment Curations</p>
              <h2 className="font-serif text-3xl font-medium text-foreground">
                Featured Showroom
              </h2>
            </div>
            <Link
              href="/listings"
              className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              View All Portfolio
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <div className="aspect-4/3 rounded-md bg-muted animate-pulse lg:min-h-115" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="aspect-square rounded-md bg-muted animate-pulse" />
              <div className="aspect-square rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        ) : featuredProperty ? (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <ScrollReveal>
              <Link
                href={`/listings/${featuredProperty.id}`}
                className="relative flex min-h-115 flex-col justify-end overflow-hidden rounded-md bg-primary"
              >
                {images.get(featuredProperty.id) ? (
                  <img
                    src={images.get(featuredProperty.id)!}
                    alt={featuredProperty.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,15,0.9)_0%,rgba(8,17,15,0.02)_55%)]" />
                <span className="absolute top-5 left-5 z-10 bg-gold px-4 py-1.5 text-[0.64rem] font-bold tracking-wide text-secondary-foreground uppercase">
                  {statusLabel(featuredProperty.status)}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(featuredProperty.id);
                  }}
                  aria-label={
                    isFavorite(featuredProperty.id)
                      ? "Remove from saved properties"
                      : "Save property"
                  }
                  className="absolute top-5 right-5 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-[rgba(8,17,15,0.5)] text-white"
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(featuredProperty.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>
                <div className="relative z-10 flex items-end justify-between gap-4 p-7">
                  <div>
                    <p className="mb-1.5 text-[0.7rem] tracking-wide text-white/55 uppercase">
                      {featuredProperty.location}
                    </p>
                    <h3 className="font-serif text-xl font-medium text-white md:text-2xl">
                      {featuredProperty.title}
                    </h3>
                  </div>
                  <span className="font-serif text-lg font-semibold whitespace-nowrap text-gold">
                    {formatCurrency(featuredProperty.price)}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <ScrollReveal delay={0.1}>
                <div
                  className="relative flex min-h-55 flex-col justify-end overflow-hidden rounded-md bg-cover bg-center p-7"
                  style={{ backgroundImage: "url(/assets/property-3.jpg)" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,15,0.88)_10%,rgba(8,17,15,0.15)_90%)]" />
                  <div className="relative z-10">
                    <p className="eyebrow on-dark">The Vault</p>
                    <h3 className="font-serif text-lg font-medium text-white mt-1">
                      Secure Your Titles
                    </h3>
                    <p className="mt-1.5 mb-3 text-sm text-white/72">
                      Encrypted storage for C of O, Governor&apos;s Consent, and
                      Survey plans.
                    </p>
                    <Link
                      href="/saved"
                      className="text-xs font-bold tracking-wide text-gold uppercase hover:text-gold/80"
                    >
                      Access My Vault →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div
                  className="relative flex min-h-55 flex-col justify-end overflow-hidden rounded-md bg-cover bg-center p-7"
                  style={{ backgroundImage: "url(/assets/property-4.jpg)" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,15,0.88)_10%,rgba(8,17,15,0.15)_90%)]" />
                  <div className="relative z-10">
                    <p className="eyebrow on-dark">Calculated Growth</p>
                    <h3 className="font-serif text-lg font-medium text-white mt-1">
                      ROI Forecasting Tool
                    </h3>
                    <p className="mt-1.5 mb-3 text-sm text-white/72">
                      Predict your wealth trajectory using Abuja and Lagos
                      market data.
                    </p>
                    <Link
                      href="/calculator"
                      className="text-xs font-bold tracking-wide text-gold uppercase hover:text-gold/80"
                    >
                      Calculate Now →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
            New opportunities are being curated — check back shortly.
          </div>
        )}
      </section>

      {/* Process */}
      <section id="process" className="container py-24 text-center">
        <ScrollReveal>
          <p className="eyebrow mb-4 justify-center">The Process</p>
          <h2 className="font-serif text-3xl font-medium mb-16">
            How you own with El-Moore
          </h2>
        </ScrollReveal>
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px bg-line lg:block" />
          {process.map((step, i) => (
            <ScrollReveal
              key={step.num}
              delay={i * 0.08}
              className="text-left lg:pr-6"
            >
              <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-background font-serif text-base">
                {step.num}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Live stats strip */}
      <section className="w-full bg-primary">
        <div className="container grid grid-cols-2 sm:grid-cols-4">
          {[
            {
              icon: Building2,
              value: available.length,
              label: "Live Listings",
              suffix: "",
            },
            {
              icon: MapPin,
              value: cities,
              label: "Locations Covered",
              suffix: "",
            },
            {
              icon: ShieldCheck,
              value: 100,
              label: "Titles Verified",
              suffix: "%",
            },
            {
              icon: TrendingUp,
              value: properties.length,
              label: "Assets Curated",
              suffix: "",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center gap-1 py-13 text-center text-primary-foreground border-white/14 ${
                i > 0 ? "border-l" : ""
              }`}
            >
              <stat.icon className="h-4 w-4 text-gold mb-1" />
              <p className="font-serif text-2xl font-medium sm:text-3xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[0.66rem] font-semibold tracking-widest text-white/60 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container py-24">
        <div className="mx-auto max-w-xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="eyebrow mb-4 justify-center">Questions</p>
              <h2 className="font-serif text-3xl font-medium">
                Before you reach out
              </h2>
            </div>
          </ScrollReveal>
          <div className="flex flex-col">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 0.06}>
                <details
                  className="group border-t border-line py-6 last:border-b"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.08rem] font-medium marker:content-none">
                    {item.q}
                    <Plus className="h-4 w-4 shrink-0 text-gold-deep group-open:hidden" />
                    <Minus className="hidden h-4 w-4 shrink-0 text-gold-deep group-open:block" />
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full bg-primary">
        <ScrollReveal className="container flex flex-wrap items-center justify-between gap-8 py-24">
          <div>
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
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
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
        </ScrollReveal>
      </section>
    </div>
  );
}
