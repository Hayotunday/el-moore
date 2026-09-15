"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, KeyRound, Lock, Mail, Search, XCircle } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { checkCustomerEmailExists, claimCustomerAccount } from "@/lib/api/customer-auth";

type Step = "checking" | "email" | "claim" | "not-found";

/**
 * For a customer whose sales rep already created their record (email +
 * purchased property attached) before they ever signed up online — instead
 * of registering fresh, they set a password on the existing record here and
 * are signed straight in. Reached either directly, or via the "this email
 * already has an account" nudge on /signup with ?email= prefilled.
 */
function ClaimAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";
  const { login } = useAuth();

  const [step, setStep] = useState<Step>(prefilledEmail ? "checking" : "email");
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const checkEmail = async (candidate: string) => {
    setError(null);
    setChecking(true);
    try {
      const exists = await checkCustomerEmailExists(candidate);
      setStep(exists ? "claim" : "not-found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check that email.");
      setStep("email");
    } finally {
      setChecking(false);
    }
  };

  // Skip the email-entry step entirely when arriving with ?email= already set.
  useEffect(() => {
    if (prefilledEmail) checkEmail(prefilledEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await checkEmail(email);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setClaiming(true);
    try {
      await claimCustomerAccount({ email, password });
      await login(email, password);
      toast.success("Account claimed — welcome back.");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim this account.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-16"
      style={{ background: "var(--gradient-green)" }}
    >
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_80%_20%,white,transparent_45%)]" />

      <ScrollReveal className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-3xl ring-1 ring-white/15 p-8">
          {step === "checking" && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="text-sm text-white/70">Looking up your account…</p>
            </div>
          )}

          {step === "email" && (
            <>
              <div className="mb-6">
                <div className="flex flex-row items-center gap-3">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                  <h1 className="font-serif text-2xl font-medium text-white">Claim your account</h1>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  If our sales team already set up an account for you after a purchase,
                  enter that email to get started.
                </p>
              </div>

              <form onSubmit={handleCheckEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-email" className="flex items-center gap-2 text-white/80">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="claim-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-white/95"
                  />
                </div>

                {error && (
                  <p className="text-sm text-white bg-destructive/80 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full rounded-full bg-gold" size="lg" disabled={checking}>
                  {checking ? "Checking…" : "Continue"}
                </Button>

                <p className="text-center text-sm text-white/70">
                  Don&apos;t have a purchase with us yet?{" "}
                  <Link href="/signup" className="text-white underline underline-offset-2">
                    Create an account
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === "not-found" && (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-serif text-2xl font-medium text-white mb-2">No account found</h1>
              <p className="text-sm text-white/70 mb-6">
                We couldn&apos;t find an existing account for{" "}
                <span className="font-medium text-white">{email}</span>. If you&apos;re a
                new customer, create an account instead.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/signup">
                  <Button className="w-full rounded-full bg-gold" size="lg">
                    Create Account
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="text-sm text-white/70 hover:text-white underline underline-offset-2"
                >
                  Try a different email
                </button>
              </div>
            </div>
          )}

          {step === "claim" && (
            <>
              <div className="mb-6">
                <div className="flex flex-row items-center gap-3">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <h1 className="font-serif text-2xl font-medium text-white">Set your password</h1>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  We found an account for{" "}
                  <span className="font-medium text-white">{email}</span>. Set a
                  password to finish claiming it.
                </p>
              </div>

              <form onSubmit={handleClaim} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-password" className="flex items-center gap-2 text-white/80">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <Input
                    id="claim-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="bg-white/95"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claim-confirm" className="text-white/80">
                    Confirm Password
                  </Label>
                  <Input
                    id="claim-confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/95"
                  />
                </div>

                {error && (
                  <p className="text-sm text-white bg-destructive/80 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full rounded-full bg-gold" size="lg" disabled={claiming}>
                  {claiming ? (
                    "Claiming account…"
                  ) : (
                    <>
                      Claim Account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="w-full text-center text-sm text-white/70 hover:text-white underline underline-offset-2"
                >
                  Not you? Use a different email
                </button>
              </form>
            </>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function ClaimAccountPage() {
  return (
    <Suspense fallback={null}>
      <ClaimAccountContent />
    </Suspense>
  );
}
