"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Lock, LogIn, Mail } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

function SignInContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Signed in.");
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
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
          <div className="mb-6">
            <div className="flex flex-row items-center gap-3">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                <LogIn className="h-5 w-5" />
              </div>
              <h1 className="font-serif text-2xl font-medium text-white">Welcome back</h1>
            </div>
            <p className="text-sm text-white/70 mt-1">
              Sign in to save favorites and track your inspections.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-white/80"
              >
                <Mail className="h-4 w-4" /> Email
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
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-white/80"
              >
                <Lock className="h-4 w-4" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/95"
              />
            </div>

            {error && (
              <p className="text-sm text-white bg-destructive/80 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/forgot-password"
                className="text-white/70 hover:text-white underline underline-offset-2"
              >
                Forgot password?
              </Link>
              <Link
                href="/signup"
                className="text-white/70 hover:text-white underline underline-offset-2"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
