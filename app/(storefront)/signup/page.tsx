"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, verifyCode, resendVerification } from "@/lib/api/auth";

type Step = "form" | "verify" | "done";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        firstName: form.firstName,
        middleName: form.middleName || undefined,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      setStep("verify");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyCode({ email: form.email, code });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(form.email);
      toast.success("Verification code resent.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend code.",
      );
    } finally {
      setResending(false);
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
          {step === "form" && (
            <>
              <div className="mb-6">
                <div className="flex flex-row items-center justify-start gap-3">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    Create your account
                  </h1>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  Join El-Moore to save favorites, request inspections, and
                  track your investments.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="flex items-center gap-2 text-white/80"
                    >
                      <User className="h-4 w-4" /> First Name
                    </Label>
                    <Input
                      id="firstName"
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      placeholder="Jane"
                      className="bg-white/95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white/80">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      placeholder="Doe"
                      className="bg-white/95"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-white/80">
                    Middle Name (optional)
                  </Label>
                  <Input
                    id="middleName"
                    value={form.middleName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, middleName: e.target.value }))
                    }
                    className="bg-white/95"
                  />
                </div>
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
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
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
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="At least 8 characters"
                    className="bg-white/95"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        confirmPassword: e.target.value,
                      }))
                    }
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
                  className="w-full rounded-full bg-gold"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-white underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="mb-6">
                <div className="flex flex-row items-center gap-3">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-secondary-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    Verify your email
                  </h1>
                </div>
                <p className="text-sm text-white/70 mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-white">{form.email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white/80">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="bg-white/95 text-center text-lg tracking-[0.5em]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-white bg-destructive/80 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full bg-gold"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify Email <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full text-center text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
                >
                  {resending ? "Resending..." : "Resend code"}
                </button>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <div className="flex flex-row items-center gap-3">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Email verified
                </h1>
              </div>
              <p className="text-sm text-white/70 mb-6">
                Your account is ready. Sign in with your email and password to
                continue.
              </p>
              <Link href="/signin">
                <Button className="w-full rounded-full" size="lg">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
