"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Calculator,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/scroll-reveal";
import { useAuth } from "@/contexts/auth-context";
import { listPublicProperties, listPropertyImages } from "@/lib/api/properties";
import { formatCurrency, getFullName } from "@/lib/utils";
import type { Property, PropertyImage } from "@/lib/api/types";

export default function PropertyPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", date: "", time: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData((f) => ({ ...f, name: f.name || getFullName(user), email: f.email || user.email }));
  }, [user]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // GET /properties/{id} and its images both require staff auth on the live
    // backend — only /properties/public is reachable by an anonymous visitor —
    // so the detail page resolves the property from that same public list
    // Listings/Home already use, rather than the authenticated single-property
    // endpoint (which would 401 for every real storefront visitor).
    Promise.all([listPublicProperties(), listPropertyImages(id).catch(() => [])])
      .then(([all, imgs]) => {
        if (cancelled) return;
        const match = all.find((p) => p.id === id);
        if (!match) {
          setNotFound(true);
          return;
        }
        setProperty(match);
        setImages(imgs);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container min-h-[50vh] flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="container min-h-[50vh] flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Link href="/listings" className="text-primary underline underline-offset-4">
          Return to Showroom
        </Link>
      </div>
    );
  }

  const heroImage = images[activeImage]?.imageUrl ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-primary overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-green">
            <span className="text-sm font-semibold uppercase tracking-widest text-white/50">
              El-Moore Real Estate
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-8 left-0 w-full container z-10">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors glass-dark px-4 py-2 rounded-full text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Showroom
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/50 to-transparent pt-32 pb-12">
          <div className="container text-white">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-2 text-gold text-xs font-bold uppercase tracking-widest">
                <span>{property.status === "AVAILABLE" ? "Available" : property.status === "RESERVED" ? "Reserved" : "Sold"}</span>
                <span>•</span>
                <span>{property.location}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-medium mb-4 text-white leading-tight">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 opacity-90">
                  <MapPin className="h-4 w-4 text-white/80" />
                  <span>{property.location}</span>
                </div>
                <div className="px-3 py-1 border border-white/30 rounded-full text-xs font-bold glass-dark text-gold">
                  <ShieldCheck className="inline h-3 w-3 mr-1 -mt-0.5" /> Title Verified
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="container py-12 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {images.length > 1 && (
            <ScrollReveal>
              <h2 className="font-serif text-lg font-medium mb-4">Gallery</h2>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      i === activeImage ? "border-gold" : "border-transparent"
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <h2 className="font-serif text-2xl font-medium mb-4 text-foreground">Property Overview</h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {property.title} is located in {property.location}, listed at{" "}
              {formatCurrency(property.price)}. All titles offered by El-Moore
              Real Estate are verified and held within our secure document
              infrastructure prior to sale — reach out to our concierge team
              for the full title and inspection report.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-md p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-ambient">
              <div>
                <h3 className="font-serif text-xl font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold-deep" /> Wealth Projection
                </h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Calculate the compounded value of this asset over 5-10 years
                  using our proprietary appreciation model.
                </p>
              </div>
              <Link
                href={`/calculator?price=${property.price}`}
                className="bg-gold text-secondary-foreground px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-gold/90 transition-colors whitespace-nowrap flex items-center gap-2 active:scale-[0.97]"
              >
                <Calculator className="h-4 w-4" /> Calculate Potential
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Sidebar - Inspection Form */}
        <div className="space-y-8">
          <ScrollReveal direction="left" delay={0.2}>
            <div className="rounded-md p-6 shadow-ambient sticky top-24 bg-card">
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                  Listing Value
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-semibold text-gold-deep">
                    {formatCurrency(property.price)}
                  </span>
                </div>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Calendar className="h-4 w-4 text-gold" /> Request Inspection
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-muted/30 border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Julian Draxler"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full bg-muted/30 border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="julian@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                          Date
                        </label>
                        <input
                          required
                          type="date"
                          className="w-full bg-muted/30 border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                          Time
                        </label>
                        <input
                          required
                          type="time"
                          min="09:00"
                          max="16:00"
                          className="w-full bg-muted/30 border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-md p-3 flex items-start gap-3 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">
                        Availability
                      </span>
                      Inspections are available Mon – Fri between 09:00 AM and
                      04:00 PM.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-secondary-foreground py-3 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-gold/90 transition-colors active:scale-[0.98]"
                  >
                    Confirm Appointment
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">
                    Request Received
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Our concierge team has received your request and will send
                    a calendar invite to your email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80"
                  >
                    Schedule another
                  </button>
                </motion.div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
