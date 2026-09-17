import { useEffect, useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { addFavorite, removeFavorite } from "@/lib/api/customer-portal";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/api/types";

export default function PropertyCard({
  property,
  imageUrl,
}: {
  property: Property;
  imageUrl?: string | null;
}) {
  const { user } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  // Seeded from the property itself (listPublicProperties() attaches
  // isFavorited per-item for a signed-in customer) rather than a separate
  // favorites lookup — kept in local state so the heart can flip instantly
  // on tap without waiting on the parent to refetch its list.
  const [fav, setFav] = useState(property.isFavorited ?? false);

  useEffect(() => {
    setFav(property.isFavorited ?? false);
  }, [property.isFavorited]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthDrawer("signin");
      return;
    }
    const next = !fav;
    setFav(next);
    try {
      if (next) await addFavorite(property.id);
      else await removeFavorite(property.id);
    } catch (err) {
      setFav(!next);
      toast.error(err instanceof Error ? err.message : "Could not update favorites.");
    }
  };

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
            onClick={handleToggleFavorite}
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
          <h3 className="font-serif text-lg font-medium text-foreground leading-snug">
            {property.title}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Entry Value
            </span>
            <span className="font-serif font-semibold text-gold-deep">
              {formatCurrency(property.price)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
