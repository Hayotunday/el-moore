"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { getShortName } from "@/lib/utils";
import SearchDialog from "@/components/search-dialog";

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
  const [searchOpen, setSearchOpen] = useState(false);
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

  return (
    <>
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
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-haspopup="dialog"
            aria-label="Search properties"
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Search className="h-4.5 w-4.5" strokeWidth={2.5} />
          </button>
          <Link
            href="/saved"
            aria-label={`Saved properties${favorites.length ? ` (${favorites.length})` : ""}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Heart className="h-4.5 w-4.5" strokeWidth={2.5} />
            {favorites.length > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-secondary-foreground">
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

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-haspopup="dialog"
              aria-label="Search properties"
              className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button className="p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
