import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/api/types";

export default function PropertyCard({
  property,
  imageUrl,
}: {
  property: Property;
  imageUrl?: string | null;
}) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(property.id);

  return (
    <Link href={`/listings/${property.id}`} className="group block h-full">
      <motion.div
        className="group relative flex h-full flex-col overflow-hidden rounded-md bg-card shadow-ambient transition-shadow hover:shadow-ambient-lg"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                El-Moore Real Estate
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(property.id);
            }}
            aria-label={fav ? "Remove from saved properties" : "Save property"}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full glass transition-colors active:scale-95"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </button>
          <span
            className={`absolute bottom-3 left-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              property.status === "AVAILABLE"
                ? "bg-gold text-secondary-foreground"
                : property.status === "RESERVED"
                  ? "bg-primary/90 text-primary-foreground"
                  : "glass-dark text-white"
            }`}
          >
            {property.status === "AVAILABLE"
              ? "Available"
              : property.status === "RESERVED"
                ? "Reserved"
                : "Sold"}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-medium">
            <MapPin className="h-3 w-3" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-semibold text-foreground leading-snug">{property.title}</h3>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Entry Value
            </span>
            <span className="font-bold text-foreground">{formatCurrency(property.price)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
