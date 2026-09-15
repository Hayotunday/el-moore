"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, LogOut, User as UserIcon } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { useFavorites } from "@/hooks/useFavorites";
import { listMyProperties, listMySales } from "@/lib/api/customer-portal";
import { formatCurrency, formatDate, getFullName, getInitials } from "@/lib/utils";
import type { Property, Sale } from "@/lib/api/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();

  if (!user) {
    return (
      <div className="container py-24 flex justify-center">
        <ScrollReveal>
          <div className="rounded-md bg-card p-12 text-center shadow-ambient max-w-md">
            <UserIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h1 className="text-xl font-bold mb-2">Sign in to view your profile</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Create an account or sign in to manage your details and see your saved
              properties in one place.
            </p>
            <Button onClick={() => openAuthDrawer("signin")}>Sign In</Button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return <ProfileContent />;
}

function ProfileContent() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

  const [properties, setProperties] = useState<Property[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingPortal, setLoadingPortal] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listMyProperties().catch(() => []), listMySales().catch(() => [])]).then(
      ([p, s]) => {
        if (cancelled) return;
        setProperties(p);
        setSales(s);
        setLoadingPortal(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  const initials = getInitials(user);

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out.");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
      <ScrollReveal>
        <p className="eyebrow mb-4">My Account</p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-10">Your Profile</h1>
      </ScrollReveal>

      <div className="space-y-6">
        {/* Identity */}
        <ScrollReveal>
          <div className="rounded-md bg-card p-6 shadow-ambient flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold text-secondary-foreground text-xl font-bold">
              {initials}
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{getFullName(user)}</h2>
              {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
              <p className="text-sm text-muted-foreground">{user.phone}</p>
              {user.createdAt && (
                <p className="text-xs text-muted-foreground pt-1">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Saved properties shortcut */}
        <ScrollReveal delay={0.05}>
          <Link
            href="/saved"
            className="rounded-md bg-card p-6 shadow-ambient flex items-center justify-between gap-4 hover:shadow-ambient-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                <Heart className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="font-medium text-foreground">Saved Properties</p>
                <p className="text-sm text-muted-foreground">
                  {favorites.length} {favorites.length === 1 ? "property" : "properties"} on
                  your watchlist
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-foreground">View →</span>
          </Link>
        </ScrollReveal>

        {/* My properties */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              My Properties
            </h3>
            {loadingPortal ? (
              <div className="h-16 rounded-md bg-muted animate-pulse" />
            ) : properties.length > 0 ? (
              <div className="space-y-3">
                {properties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/listings/${property.id}`}
                    className="flex items-center justify-between gap-4 rounded-md border border-border p-4 hover:border-foreground/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {formatCurrency(property.price)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Properties you purchase with El-Moore will appear here.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* My sales */}
        <ScrollReveal delay={0.15}>
          <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Purchase History
            </h3>
            {loadingPortal ? (
              <div className="h-16 rounded-md bg-muted animate-pulse" />
            ) : sales.length > 0 ? (
              <div className="space-y-3">
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {sale.saleType === "INSTALLMENT" ? "Installment Plan" : "Outright Purchase"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sale.createdAt ? formatDate(sale.createdAt) : ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No purchases on record yet.</p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
