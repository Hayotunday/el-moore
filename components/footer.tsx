"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Do not render the main Footer on management routes
  if (pathname?.startsWith("/management")) return null;

  return (
    <footer className="bg-primary text-primary-foreground w-full flex items-center justify-center z-50">
      <div className="w-full flex flex-col justify-between items-center">
        <div className="container px-7 pt-12 pb-7 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">El-Moore Real Estate</h3>
            <p className="text-base font-semibold mt-1">RC: 1938760</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm opacity-80">
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Investment Disclosure
            </Link>
            <Link
              href="/Helpdesk"
              className="hover:opacity-100 transition-opacity"
            >
              Contact Us
            </Link>
          </nav>
        </div>
        <p className="text-sm text-center opacity-70 mb-5 w-full">
          © 2024 El-Moore Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
