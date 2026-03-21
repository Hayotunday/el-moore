import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground flex items-center justify-center">
      <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">El-Moore Real Estate</h3>
          <p className="text-sm opacity-70 mt-1">
            © 2024 El-Moore Real Estate. All rights reserved.
          </p>
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
            href="/helpdesk"
            className="hover:opacity-100 transition-opacity"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
