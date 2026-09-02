"use client";

import { useState, useMemo, useEffect } from "react";
import PropertyCard from "@/components/property-cards";
import ScrollReveal from "@/components/scroll-reveal";
import { listPublicProperties, getPrimaryImages } from "@/lib/api/properties";
import type { Property, PropertyStatus } from "@/lib/api/types";

const statusFilters: { label: string; value: PropertyStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Reserved", value: "RESERVED" },
  { label: "Sold", value: "SOLD" },
];

export default function Listings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");
  const [status, setStatus] = useState<PropertyStatus | "ALL">("AVAILABLE");
  const [priceRange, setPriceRange] = useState(2000000000);

  useEffect(() => {
    let cancelled = false;
    listPublicProperties().then(async (p) => {
      if (cancelled) return;
      setProperties(p);
      setLoading(false);
      const imgs = await getPrimaryImages(p.map((prop) => prop.id));
      if (!cancelled) setImages(imgs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(properties.map((p) => p.location))).sort(),
    [properties],
  );

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (status !== "ALL" && p.status !== status) return false;
      if (
        locationQuery &&
        !p.location.toLowerCase().includes(locationQuery.toLowerCase())
      )
        return false;
      if (Number(p.price) > priceRange) return false;
      return true;
    });
  }, [properties, status, locationQuery, priceRange]);

  return (
    <div className="container py-12">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">
          The Showroom
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Explore Investment Opportunities
        </h1>
        <p className="text-muted-foreground max-w-xl mb-10">
          Curated real estate and land assets, verified and titled, across
          West Africa&apos;s most resilient markets.
        </p>
      </ScrollReveal>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <ScrollReveal direction="left" className="lg:w-64 shrink-0">
          <div className="space-y-8 lg:sticky lg:top-24">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3">
                Status
              </h3>
              <div className="space-y-1">
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatus(f.value)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      status === f.value
                        ? "bg-gold/20 font-medium text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3">
                Location
              </h3>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="e.g. Gwarinpa, Maitama"
                className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              {locations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {locations.slice(0, 6).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocationQuery(loc)}
                      className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/70 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs text-muted-foreground">NGN</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={2000000000}
                step={1000000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₦1M</span>
                <span>₦2B+</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {loading ? "…" : filtered.length}
              </span>{" "}
              assets available for investment
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-4/3 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map((property, i) => (
                <ScrollReveal key={property.id} delay={i * 0.06}>
                  <PropertyCard property={property} imageUrl={images.get(property.id)} />
                </ScrollReveal>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">
                No properties match your filters
              </p>
              <p className="text-sm">
                Try adjusting your location, status, or price range criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
