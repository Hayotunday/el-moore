"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, LogOut, Pencil, User as UserIcon, X } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { user, logout, updateProfile } = useAuth();
  const { favorites } = useFavorites();

  const [properties, setProperties] = useState<Property[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingPortal, setLoadingPortal] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    middleName: user?.middleName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    dateOfBirth: user?.dateOfBirth?.slice(0, 10) ?? "",
  });

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

  const startEditing = () => {
    setForm({
      firstName: user.firstName ?? "",
      middleName: user.middleName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      dateOfBirth: user.dateOfBirth?.slice(0, 10) ?? "",
    });
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!form.firstName.trim() || !form.phone.trim()) {
      toast.error("First name and phone are required.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
      });
      toast.success("Profile updated.");
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
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
          <div className="rounded-md bg-card p-6 shadow-ambient">
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Edit Profile
                  </h3>
                  <button
                    onClick={() => setEditing(false)}
                    aria-label="Cancel editing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>First Name</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Last Name</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Middle Name (optional)</Label>
                    <Input
                      value={form.middleName}
                      onChange={(e) => setForm((f) => ({ ...f, middleName: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={user.email ?? ""} disabled />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change the email on your account.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold text-secondary-foreground text-xl font-bold">
                  {initials}
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">{getFullName(user)}</h2>
                  {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                  {user.dateOfBirth && (
                    <p className="text-sm text-muted-foreground">
                      Born {formatDate(user.dateOfBirth)}
                    </p>
                  )}
                  {user.createdAt && (
                    <p className="text-xs text-muted-foreground pt-1">
                      Member since {formatDate(user.createdAt)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Pencil className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            )}
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
