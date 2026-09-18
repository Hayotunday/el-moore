"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import PropertyCard from "@/components/property-cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { listMyFavorites } from "@/lib/api/customer-portal";
import { getPrimaryImages } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";

export default function SavedProperties() {
  const { user } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    listMyFavorites()
      .then(async (list) => {
        if (cancelled) return;
        setProperties(list);
        setLoading(false);
        const imgs = await getPrimaryImages(list.map((p) => p.id));
        if (!cancelled) setImages(imgs);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="container py-24 flex justify-center">
        <ScrollReveal>
          <div className="rounded-md bg-card p-12 text-center shadow-ambient max-w-md">
            <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h1 className="text-xl font-bold mb-2">
              Sign in to see your saved properties
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Create an account or sign in to save properties and pick up where
              you left off on any device.
            </p>
            <Button onClick={() => openAuthDrawer("signin")}>Sign In</Button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <ScrollReveal>
        <p className="eyebrow mb-3">Your Watchlist</p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">
          Saved Properties
        </h1>
        <p className="text-muted-foreground max-w-xl mb-10">
          Properties you&apos;ve saved while browsing the showroom, synced to
          your account.
        </p>
      </ScrollReveal>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-4/3 rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
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
