"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/management") ||
    pathname?.startsWith("/marketer") ||
    pathname?.startsWith("/invite")
  ) {
    return null;
  }

  return (
    <footer className="bg-primary text-primary-foreground w-full flex items-center justify-center z-50">
      <div className="w-full flex flex-col justify-between items-center">
        <div className="container px-7 pt-14 pb-8 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">El-Moore Real Estate</h3>
            <p className="text-sm font-medium mt-1 text-primary-foreground/60">RC: 1938760</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-primary-foreground/70">
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary-foreground transition-colors">
              Investment Disclosure
            </Link>
            <Link href="/marketer" className="hover:text-primary-foreground transition-colors">
              Be A Marketer
            </Link>
            <Link href="/helpdesk" className="hover:text-primary-foreground transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
        <p className="text-xs text-center text-primary-foreground/50 mb-6 w-full">
          © {new Date().getFullYear()} El-Moore Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
