import { Heart } from "lucide-react";
import { Property } from "@/lib/mockData";
import { useFavorites } from "@/hooks/useFavorites";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(property.id);

  return (
    <Link href={`/showroom/${property.id}`} className="group">
      <motion.div
        className="group relative rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={() => toggle(property.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors active:scale-95"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </button>
          <span className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded bg-secondary text-secondary-foreground">
            +{property.roiPercent}% P.A. ROI
          </span>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">
            <span>{property.type}</span>
            <span>•</span>
            <span>{property.location.split(",")[0]}</span>
          </div>
          <h3 className="font-semibold text-foreground">{property.name}</h3>
          <p className="text-sm text-muted-foreground">
            {property.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">Entry Value</span>
            <span className="font-semibold text-foreground">
              ${property.price.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
