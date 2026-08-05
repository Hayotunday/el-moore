"use client";

import Link from "next/link";
import { Search, User, Menu, X, Building2 } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Lobby", path: "/" },
  { label: "Listings", path: "/listings" },
  { label: "ROI-Calculator", path: "/calculator" },
  { label: "Blog", path: "/blog" },
  { label: "Helpdesk", path: "/helpdesk" },
  { label: "About Us", path: "/about-us" },
  { label: "Marketer Portal", path: "/marketer" },
  // { label: "My Vault", path: "/vault" },
];

const mobileNavItems = [
  { label: "Lobby", path: "/" },
  { label: "Listings", path: "/listings" },
  { label: "ROI-Calculator", path: "/calculator" },
  { label: "Blog", path: "/blog" },
  { label: "Helpdesk", path: "/helpdesk" },
  { label: "About Us", path: "/about-us" },
  { label: "Marketer Portal", path: "/marketer" },
  { label: "Profile", path: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Do not render the main Navbar on management routes
  const isManagementRoute =
    pathname?.startsWith("/management") || pathname?.startsWith("/marketer");
  if (isManagementRoute) return null;

  return (
    <header className="flex items-center justify-center sticky top-0 z-50 border-b border-primary/20 bg-primary text-primary-foreground backdrop-blur supports-backdrop-filter:bg-primary/95">
      <div className="container lg:flex h-16 items-center justify-between hidden">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary-foreground flex items-center gap-2"
        >
          <Building2 className="h-8 w-8 text-gold" />
          <span>El-Moore</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === item.path
                  ? "text-primary-foreground underline underline-offset-4 decoration-2"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-gold/90 transition-colors active:scale-[0.97]"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="lg:hidden w-full border-t border-primary/20 bg-primary p-4 space-y-1">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary-foreground flex items-center gap-2"
          >
            <Building2 className="h-8 w-8 text-gold" />
            <span>El-Moore</span>
          </Link>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open &&
          mobileNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`w-full block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-primary-foreground/10 text-primary-foreground"
                  : "text-primary-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </header>
  );
}
