"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { getShortName } from "@/lib/utils";

const navItems = [
  { label: "Lobby", path: "/" },
  { label: "Listings", path: "/listings" },
  { label: "ROI Calculator", path: "/calculator" },
  { label: "Blog", path: "/blog" },
  { label: "Helpdesk", path: "/helpdesk" },
  { label: "About Us", path: "/about-us" },
];

const mobileNavItems = [...navItems, { label: "Saved Properties", path: "/saved" }];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out.");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isManagementRoute =
    pathname?.startsWith("/management") ||
    pathname?.startsWith("/marketer") ||
    pathname?.startsWith("/invite");
  if (isManagementRoute) return null;

  return (
    <header
      className={`flex items-center justify-center sticky top-0 z-50 bg-primary text-primary-foreground backdrop-blur transition-shadow ${
        scrolled ? "shadow-ambient-lg" : ""
      }`}
    >
      <div className="container lg:flex h-18 items-center justify-between hidden">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground shrink-0">
          <img src="/assets/el-moore-1.png" alt="El-Moore Logo" className="h-11 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-sm ${
                pathname === item.path
                  ? "text-primary-foreground"
                  : "text-primary-foreground/65 hover:text-primary-foreground"
              }`}
            >
              {item.label}
              {pathname === item.path && (
                <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gold rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/saved"
            className="relative inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-gold/90 transition-colors active:scale-[0.97]"
          >
            <Heart className="h-4 w-4" />
            Saved
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {favorites.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="text-sm font-medium text-primary-foreground/90">
                {getShortName(user) || "there"}
              </span>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthDrawer("signin")}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/25 px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors active:scale-[0.97]"
            >
              <User className="h-4 w-4" /> Sign In
            </button>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="lg:hidden w-full bg-primary p-4 space-y-1">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/el-moore-1.png" alt="El-Moore Logo" className="h-11 w-auto" />
          </Link>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <>
            {mobileNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`w-full block px-3 py-2 rounded-sm text-sm font-medium ${
                  pathname === item.path
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "text-primary-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-primary-foreground/10">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium text-primary-foreground/70"
                >
                  <LogOut className="h-4 w-4" /> Sign out ({getShortName(user) || "there"})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    openAuthDrawer("signin");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium text-primary-foreground/70"
                >
                  <User className="h-4 w-4" /> Sign In
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
