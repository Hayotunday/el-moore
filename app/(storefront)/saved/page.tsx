"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import PropertyCard from "@/components/property-cards";
import { useFavorites } from "@/hooks/useFavorites";
import { listPublicProperties, getPrimaryImages } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";

export default function SavedProperties() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);

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

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="container py-12">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">
          Your Watchlist
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Properties</h1>
        <p className="text-muted-foreground max-w-xl mb-10">
          Properties you&apos;ve saved while browsing the showroom, kept here
          on this device for quick access.
        </p>
      </ScrollReveal>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-4/3 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : savedProperties.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.08}>
              <PropertyCard property={p} imageUrl={images.get(p.id)} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="rounded-md bg-card p-12 text-center shadow-ambient">
            <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">No saved properties yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Browse the showroom and tap the heart icon to save properties
              here.
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
            >
              Browse Showroom
            </Link>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
