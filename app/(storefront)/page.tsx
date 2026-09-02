"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/scroll-reveal";
import PropertyCard from "@/components/property-cards";
import AnimatedCounter from "@/components/animated-counter";
import { listPublicProperties, getPrimaryImages } from "@/lib/api/properties";
import { listPublishedPosts } from "@/lib/api/blog";
import type { Property, BlogPost } from "@/lib/api/types";

export default function Lobby() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Map<string, string | null>>(new Map());
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listPublicProperties(), listPublishedPosts().catch(() => [])]).then(
      async ([p, b]) => {
        if (cancelled) return;
        setProperties(p);
        setPosts(b);
        const imgs = await getPrimaryImages(p.slice(0, 6).map((prop) => prop.id));
        if (!cancelled) setImages(imgs);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const available = useMemo(
    () => properties.filter((p) => p.status === "AVAILABLE"),
    [properties],
  );
  const featured = available.slice(0, 3);
  const cities = useMemo(
    () => new Set(properties.map((p) => p.location.split(",")[0].trim())).size,
    [properties],
  );

  return (
    <div className="relative flex flex-col items-center justify-center overflow-x-hidden">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-[92vh] min-h-165 w-full flex items-end overflow-hidden"
      >
        <motion.img
          src="/assets/hero-bg.jpg"
          alt="Luxury property"
          style={{ y: heroY }}
          className="absolute inset-0 h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/50 to-primary/10" />
        <motion.div
          style={{ opacity: heroOpacity }}
          className="container relative z-10 md:pl-10 pb-20 space-y-8"
        >
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              Curated Real Estate &amp; Land Investment
            </p>
          </ScrollReveal>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] max-w-3xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Build Your Wealth with
            <br />
            <span className="text-gold italic">El-Moore Real Estate</span>
          </motion.h1>

          <motion.p
            className="max-w-lg text-primary-foreground/75"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Verified titles, curated locations, and a portfolio built on
            transparency and long-term appreciation — not hype.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 glass rounded-md overflow-hidden shadow-ambient-lg max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-white/15">
              <label className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mb-1 block">
                Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/90">
                  Abuja, Lagos &amp; beyond
                </span>
              </div>
            </div>
            <Link
              href="/listings"
              className="bg-gold text-secondary-foreground px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.97]"
            >
              Find Opportunities <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Live stats strip */}
      <section className="w-full bg-primary border-t border-white/10">
        <div className="container grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 text-primary-foreground">
          {[
            { icon: Building2, value: available.length, label: "Live Listings", suffix: "" },
            { icon: MapPin, value: cities, label: "Locations Covered", suffix: "" },
            { icon: ShieldCheck, value: 100, label: "Titles Verified", suffix: "%" },
            { icon: TrendingUp, value: properties.length, label: "Assets Curated", suffix: "" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-1">
              <stat.icon className="h-4 w-4 text-gold mb-1" />
              <p className="text-2xl sm:text-3xl font-bold tabular-nums">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Showroom */}
      <section className="container py-20">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                Investment Curations
              </p>
              <h2 className="text-3xl font-bold text-foreground">Featured Showroom</h2>
            </div>
            <Link
              href="/listings"
              className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              View All Portfolio
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-4/3 rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal className="lg:col-span-2">
              <PropertyCard property={featured[0]} imageUrl={images.get(featured[0].id)} />
            </ScrollReveal>
            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                <div className="rounded-md bg-card p-6 space-y-3 shadow-ambient">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    The Vault
                  </p>
                  <h3 className="text-lg font-bold">
                    Secure Your Titles with Our Private Digital Vault
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Encrypted storage for C of O, Governor&apos;s Consent, and Survey
                    plans. Accessible globally, anytime.
                  </p>
                  <Link
                    href="/saved"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-foreground hover:text-muted-foreground"
                  >
                    Access My Vault <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="rounded-md bg-gold p-6 text-secondary-foreground space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-secondary-foreground/70 font-semibold">
                    Calculated Growth
                  </p>
                  <h3 className="text-lg font-bold">ROI Forecasting Tool</h3>
                  <p className="text-sm opacity-80">
                    Predict your wealth trajectory based on market data trends
                    in Abuja and Lagos.
                  </p>
                  <Link
                    href="/calculator"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-background/10 border border-background/20 px-4 py-2 rounded hover:bg-background/20 transition-colors"
                  >
                    Calculate Now
                  </Link>
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

      {/* Academy Teaser */}
      <section className="bg-gradient-green w-full">
        <div className="container py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md overflow-hidden aspect-3/4">
                  <img
                    src="/assets/property-1.jpg"
                    alt="Academy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="rounded-md glass border border-white/10 p-4 text-white">
                    <p className="text-xs font-bold">Legal Masterclass</p>
                    <p className="text-xs opacity-70 mt-1">
                      Understanding Land Use Act implications for investors.
                    </p>
                  </div>
                  <div className="rounded-md overflow-hidden aspect-square">
                    <img
                      src="/assets/property-3.jpg"
                      alt="Academy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">
                El-Moore Academy
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 italic">
                The Investor&apos;s Intelligence Bureau
              </h2>
              <p className="text-white/75 mb-8 max-w-md">
                Knowledge is the bedrock of sustainable wealth. Our academy
                provides curated insights, legal frameworks, and market
                perspectives beyond the standard property portal.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Strategic Insights
                    </h4>
                    <p className="text-sm text-white/70">
                      {posts[0]?.title ?? "Deep-dives into regional development plans and infrastructure pivots."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">
                      Market Perspectives
                    </h4>
                    <p className="text-sm text-white/70">
                      Fresh analysis from the El-Moore editorial desk, published
                      directly to the Academy.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 border border-white/50 text-white rounded-md px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gold hover:border-gold hover:text-secondary-foreground transition-colors active:scale-[0.97]"
              >
                Enter the Academy
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
