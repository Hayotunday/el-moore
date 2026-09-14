"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ChatbotFab() {
  const pathname = usePathname();

  const isManagementRoute =
    pathname?.startsWith("/management") ||
    pathname?.startsWith("/marketer") ||
    pathname?.startsWith("/invite");
  if (isManagementRoute) return null;

  return (
    <a
      href="https://wa.me/2348000000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with El-Moore on WhatsApp"
      className="fixed right-8 bottom-8 z-45 flex h-13 w-13 items-center justify-center rounded-full bg-gold text-secondary-foreground shadow-[0_14px_30px_rgba(10,21,18,0.28)] transition-transform hover:scale-105"
    >
      <span className="pointer-events-none absolute -inset-1.5 animate-ping-slow rounded-full border-[1.5px] border-gold/50" />
      <MessageCircle className="h-6 w-6" strokeWidth={2.25} />
    </a>
  );
}
