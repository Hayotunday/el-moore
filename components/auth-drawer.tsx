"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { registerUser, verifyCode, resendVerification } from "@/lib/api/auth";

type Step = "form" | "verify";

const EMPTY_SIGNIN = { email: "", password: "" };
const EMPTY_SIGNUP = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthDrawer() {
  const { isOpen, view, setView, close } = useAuthDrawer();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [signin, setSignin] = useState(EMPTY_SIGNIN);
  const [signup, setSignup] = useState(EMPTY_SIGNUP);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep("form");
    setSignin(EMPTY_SIGNIN);
    setSignup(EMPTY_SIGNUP);
    setCode("");
    setError(null);
  }, [isOpen, view]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(signin.email, signin.password);
      toast.success("Signed in.");
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signup.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (signup.password !== signup.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        firstName: signup.firstName,
        middleName: signup.middleName || undefined,
        lastName: signup.lastName,
        email: signup.email,
        password: signup.password,
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
      await verifyCode({ email: signup.email, code });
      toast.success("Email verified — you can now sign in.");
      setSignin({ email: signup.email, password: "" });
      setStep("form");
      setView("signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(signup.email);
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
    <Drawer
      open={isOpen}
      onOpenChange={(open) => (open ? undefined : close())}
      direction="bottom"
    >
      <DrawerContent>
        {step === "form" ? (
          <>
            <DrawerHeader>
              <div className="flex gap-1 rounded-md bg-muted p-1 w-fit mb-2">
                <button
                  onClick={() => setView("signin")}
                  className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                    view === "signin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setView("signup")}
                  className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                    view === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Create Account
                </button>
              </div>
              <DrawerTitle>
                {view === "signin" ? "Welcome back" : "Create your account"}
              </DrawerTitle>
              <DrawerDescription>
                {view === "signin"
                  ? "Sign in to save favorites and track your inspections."
                  : "Join El-Moore to start building your investment portfolio."}
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              {view === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="drawer-signin-email"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="drawer-signin-email"
                      type="email"
                      required
                      value={signin.email}
                      onChange={(e) =>
                        setSignin((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="drawer-signin-password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="drawer-signin-password"
                      type="password"
                      required
                      value={signin.password}
                      onChange={(e) =>
                        setSignin((f) => ({ ...f, password: e.target.value }))
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </Button>

                  <a
                    href="/forgot-password"
                    onClick={close}
                    className="block text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                  >
                    Forgot your password?
                  </a>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="drawer-signup-firstName"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" /> First Name
                      </Label>
                      <Input
                        id="drawer-signup-firstName"
                        required
                        value={signup.firstName}
                        onChange={(e) =>
                          setSignup((f) => ({ ...f, firstName: e.target.value }))
                        }
                        placeholder="Jane"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drawer-signup-lastName">Last Name</Label>
                      <Input
                        id="drawer-signup-lastName"
                        required
                        value={signup.lastName}
                        onChange={(e) =>
                          setSignup((f) => ({ ...f, lastName: e.target.value }))
                        }
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drawer-signup-middleName">
                      Middle Name (optional)
                    </Label>
                    <Input
                      id="drawer-signup-middleName"
                      value={signup.middleName}
                      onChange={(e) =>
                        setSignup((f) => ({ ...f, middleName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="drawer-signup-email"
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="drawer-signup-email"
                      type="email"
                      required
                      value={signup.email}
                      onChange={(e) =>
                        setSignup((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="drawer-signup-password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="drawer-signup-password"
                      type="password"
                      required
                      value={signup.password}
                      onChange={(e) =>
                        setSignup((f) => ({ ...f, password: e.target.value }))
                      }
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drawer-signup-confirm">
                      Confirm Password
                    </Label>
                    <Input
                      id="drawer-signup-confirm"
                      type="password"
                      required
                      value={signup.confirmPassword}
                      onChange={(e) =>
                        setSignup((f) => ({
                          ...f,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </DrawerBody>
          </>
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle>Verify your email</DrawerTitle>
              <DrawerDescription>
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">
                  {signup.email}
                </span>
                .
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="drawer-verify-code"
                    className="flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" /> Verification Code
                  </Label>
                  <Input
                    id="drawer-verify-code"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="text-center text-lg tracking-[0.5em]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
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
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  {resending ? "Resending..." : "Resend code"}
                </button>
              </form>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
