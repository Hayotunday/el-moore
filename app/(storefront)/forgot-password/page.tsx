"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, MessageSquare } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-16"
      style={{ background: "var(--gradient-green)" }}
    >
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_80%_20%,white,transparent_45%)]" />

      <ScrollReveal className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-3xl ring-1 ring-white/15 p-8">
          {!submitted ? (
            <>
              <div className="mb-6">
                <div className="flex flex-row items-center gap-3">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <h1 className="font-serif text-2xl font-medium text-white">
                    Reset your password
                  </h1>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  Self-service password reset isn&apos;t available yet — our
                  support team can reset it for you directly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-white/80"
                  >
                    <Mail className="h-4 w-4" /> Your Account Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-white/95"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-gold"
                  size="lg"
                >
                  Continue
                </Button>

                <p className="text-center text-sm text-white/70">
                  Remembered it after all?{" "}
                  <Link
                    href="/signin"
                    className="text-white underline underline-offset-2"
                  >
                    Back to sign in
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                <MessageSquare className="h-6 w-6 text-gold" />
              </div>
              <h1 className="font-serif text-2xl font-medium text-white mb-2">
                Contact our support team
              </h1>
              <p className="text-sm text-white/70 mb-6">
                We&apos;ve noted the request for{" "}
                <span className="text-white">{email}</span>. Message our
                concierge team on WhatsApp or email and they&apos;ll verify your
                identity and reset your password directly.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold text-secondary-foreground px-6 py-3 text-sm font-semibold hover:bg-gold/90 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" /> Message on WhatsApp
                </a>
                <Link
                  href="/helpdesk"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Go to Helpdesk
                </Link>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
