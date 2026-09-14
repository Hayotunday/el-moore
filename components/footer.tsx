"use client";

import Link from "next/link";

// The management/marketer portal is a separate deployment (a separate repo)
// as of the storefront/dashboard split — point this at its real deployed URL.
const MARKETER_PORTAL_URL = process.env.NEXT_PUBLIC_MARKETER_PORTAL_URL || "#";

const columns = [
  {
    heading: "Estates",
    links: [
      { label: "Showroom", href: "/listings" },
      { label: "Saved Properties", href: "/saved" },
      { label: "ROI Calculator", href: "/calculator" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "The Academy", href: "/blog" },
      { label: "Be A Marketer", href: MARKETER_PORTAL_URL },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Helpdesk", href: "/helpdesk" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="container pt-20 pb-10">
        <div className="grid grid-cols-2 gap-10 border-b border-white/12 pb-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img src="/assets/el-moore-1.png" alt="El-Moore Logo" className="h-8 w-auto mb-4" />
            <p className="max-w-[26ch] text-sm leading-relaxed text-primary-foreground/60">
              RC: 1938760. A registered brokerage for verified land and property
              investment across Nigeria.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-[0.7rem] font-semibold tracking-widest text-primary-foreground/55 uppercase">
                {col.heading}
              </h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-primary-foreground/85 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="pt-8 text-center text-[0.78rem] text-primary-foreground/50">
          © {new Date().getFullYear()} El-Moore Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
