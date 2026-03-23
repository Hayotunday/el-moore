"use client";

import Link from "next/link";
import { Search, User, Menu, X } from "lucide-react";
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
  // { label: "My Vault", path: "/vault" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-center sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container lg:flex h-16 items-center justify-between hidden">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          <img
            src={"/assets/el-moore.png"}
            alt="El-Moore Logo"
            className="h-14 w-32"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                pathname === item.path
                  ? "text-foreground underline underline-offset-4 decoration-2"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-muted transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.97]"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="lg:hidden w-full border-t border-border bg-background p-4 space-y-1">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground"
          >
            <img
              src={"/assets/el-moore.png"}
              alt="El-Moore Logo"
              className="h-14 w-32"
            />
          </Link>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open &&
          navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`w-full block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </header>
  );
}
